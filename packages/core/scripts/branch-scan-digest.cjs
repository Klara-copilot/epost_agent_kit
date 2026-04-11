#!/usr/bin/env node
/**
 * Branch Scan Digest
 *
 * Daily branch health scan — diffs all active branches vs main,
 * computes trend (new/resolved/unchanged), posts Slack digest.
 *
 * Usage:
 *   node packages/core/scripts/branch-scan-digest.cjs
 *   node packages/core/scripts/branch-scan-digest.cjs --dry-run
 *
 * Env:
 *   REVIEW_SLACK_CHANNEL  — Slack channel ID or name (e.g. C0123456789 or #code-review)
 *   SLACK_BOT_TOKEN       — Slack bot OAuth token (required for posting)
 *
 * Exit: always 0 (non-blocking)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const https = require('https');

// ── Config ────────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes('--dry-run');
const MAX_HISTORY_RUNS = 30;
const BRANCH_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days
const HARDCODED_EXCLUSIONS = new Set(['kb', 'main', 'master', 'HEAD', 'origin/HEAD', 'origin']);
const CONFIDENCE_THRESHOLD = 0.5;
const SEVERITY_THRESHOLD = 2;
const TOP_FINDINGS_LIMIT = 5;
const SCAN_CONFIG_FILE = '.epost-scan-config.json';

// ── Path Resolution ───────────────────────────────────────────────────────────

function findRepoRoot() {
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, 'packages')) && fs.existsSync(path.join(dir, '.claude'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  // Fallback: use cwd
  return process.cwd();
}

const ROOT = findRepoRoot();
const HISTORY_FILE = path.join(ROOT, 'reports', 'branch-scan-history.json');
const REPORT_DIR = path.join(ROOT, 'reports', 'branch-scan');

// ── Scan Config ───────────────────────────────────────────────────────────────

/**
 * Load optional .epost-scan-config.json from repo root.
 *
 * Config format:
 * {
 *   "version": "1.0",
 *   "repos": [
 *     {
 *       "name": "my-repo",
 *       "path": "/absolute/path/or/relative/to/config",
 *       "slackChannel": "C0123456789",       // overrides REVIEW_SLACK_CHANNEL
 *       "excludeBranches": ["staging", "qa"] // extends hardcoded exclusions
 *     }
 *   ]
 * }
 *
 * If absent, defaults to single-repo mode scanning ROOT with env vars.
 */
function loadScanConfig() {
  const configPath = path.join(ROOT, SCAN_CONFIG_FILE);
  if (!fs.existsSync(configPath)) {
    // Default: scan this repo only
    return {
      repos: [
        {
          name: path.basename(ROOT),
          path: ROOT,
          slackChannel: process.env.REVIEW_SLACK_CHANNEL || null,
          excludeBranches: [],
        },
      ],
    };
  }

  try {
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (!Array.isArray(raw.repos) || raw.repos.length === 0) {
      warn(`${SCAN_CONFIG_FILE} has no repos — falling back to single-repo mode`);
      return loadScanConfig.__fallback();
    }

    return {
      repos: raw.repos.map((r) => ({
        name: r.name || path.basename(r.path || ROOT),
        // Resolve relative paths against the config file location (ROOT)
        path: r.path ? path.resolve(ROOT, r.path) : ROOT,
        slackChannel: r.slackChannel || process.env.REVIEW_SLACK_CHANNEL || null,
        excludeBranches: Array.isArray(r.excludeBranches) ? r.excludeBranches : [],
      })),
    };
  } catch (e) {
    warn(`Failed to parse ${SCAN_CONFIG_FILE}: ${e.message} — using single-repo default`);
    return {
      repos: [
        {
          name: path.basename(ROOT),
          path: ROOT,
          slackChannel: process.env.REVIEW_SLACK_CHANNEL || null,
          excludeBranches: [],
        },
      ],
    };
  }
}

// ── Logging ───────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[branch-scan] ${msg}`);
}

function warn(msg) {
  console.warn(`[branch-scan] WARNING: ${msg}`);
}

// ── Git Helpers ───────────────────────────────────────────────────────────────

function git(args, opts = {}) {
  try {
    return execSync(`git ${args}`, {
      cwd: opts.cwd || ROOT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      ...opts,
    }).trim();
  } catch (e) {
    return null;
  }
}

/**
 * Fetch remote refs so we have up-to-date branch list.
 * @param {string} repoPath — absolute path to the git repo
 */
function fetchRemotes(repoPath) {
  log('Fetching remote refs...');
  git('fetch --all --prune', { cwd: repoPath });
}

/**
 * Returns list of active remote branch names (stripped of origin/ prefix).
 * Active = at least 1 commit in the last 7 days.
 * @param {string} repoPath — absolute path to the git repo
 * @param {string[]} extraExclusions — additional branch names to skip
 */
function getActiveBranches(repoPath, extraExclusions = []) {
  const now = Math.floor(Date.now() / 1000);
  const raw = git("branch -r --sort=-committerdate --format='%(refname:short) %(committerdate:unix)'", { cwd: repoPath });
  if (!raw) return [];

  const excluded = new Set([...HARDCODED_EXCLUSIONS, ...extraExclusions]);

  const branches = [];
  for (const line of raw.split('\n')) {
    const parts = line.trim().replace(/^'|'$/g, '').split(' ');
    if (parts.length < 2) continue;

    const [refName, timestamp] = parts;
    const age = now - parseInt(timestamp, 10);
    if (isNaN(age) || age > BRANCH_AGE_SECONDS) continue;

    const branchName = refName.replace(/^origin\//, '');

    if (excluded.has(branchName) || excluded.has(refName)) continue;

    branches.push(branchName);
  }

  return branches;
}

/**
 * Get the HEAD commit sha of a remote branch.
 * @param {string} branch
 * @param {string} repoPath
 */
function getBranchCommit(branch, repoPath) {
  return git(`rev-parse origin/${branch}`, { cwd: repoPath }) || 'unknown';
}

/**
 * Get list of files changed in this branch vs main.
 * @param {string} branch
 * @param {string} repoPath
 */
function getBranchDiffFiles(branch, repoPath) {
  const output = git(`diff origin/main...origin/${branch} --name-only`, { cwd: repoPath });
  if (!output) return [];
  return output.split('\n').filter(Boolean);
}

/**
 * Get the full diff content for a branch vs main.
 * @param {string} branch
 * @param {string} repoPath
 */
function getBranchDiff(branch, repoPath) {
  return git(`diff origin/main...origin/${branch}`, { cwd: repoPath }) || '';
}

// ── Finding Simulation (LLM stub) ─────────────────────────────────────────────

/**
 * In production this would invoke the code-review skill / LLM.
 * For now, parses any existing known-findings for these files as a proxy,
 * and returns a structured list with confidence + severity fields.
 *
 * Each finding: { id, file, line, category, severity, confidence }
 *
 * @param {string} branch
 * @param {string[]} diffFiles
 * @param {string} repoPath — absolute path to the git repo
 */
function reviewBranchDiff(branch, diffFiles, repoPath) {
  const knownFindingsPath = path.join(repoPath, 'reports', 'known-findings', 'code.json');

  const findings = [];

  if (fs.existsSync(knownFindingsPath)) {
    try {
      const db = JSON.parse(fs.readFileSync(knownFindingsPath, 'utf-8'));
      const allFindings = db.findings || [];

      for (const f of allFindings) {
        if (f.resolved) continue;

        // Match if finding's file_pattern overlaps with changed files
        const matchedFile = diffFiles.find(df =>
          f.file_pattern && (df.includes(f.file_pattern) || f.file_pattern.includes(df))
        );

        if (!matchedFile) continue;

        const severity = f.severity_score || 2;
        const confidence = f.confidence || 0.5;

        // Apply informational threshold
        if (confidence < CONFIDENCE_THRESHOLD || severity < SEVERITY_THRESHOLD) continue;

        findings.push({
          id: f.rule_id || `FINDING-${f.id}`,
          file: f.file_pattern || matchedFile,
          line: 0, // line not stored in known-findings schema
          category: f.category || 'UNKNOWN',
          severity,
          confidence,
        });
      }
    } catch (e) {
      warn(`Failed to read known-findings: ${e.message}`);
    }
  }

  // In dry-run with no known-findings, return empty (correct behavior)
  return findings;
}

// ── History ───────────────────────────────────────────────────────────────────

function loadHistory() {
  if (!fs.existsSync(HISTORY_FILE)) {
    return { schemaVersion: '1.0.0', runs: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
  } catch (e) {
    warn(`Could not parse history file: ${e.message}. Starting fresh.`);
    return { schemaVersion: '1.0.0', runs: [] };
  }
}

function saveHistory(history) {
  fs.mkdirSync(path.dirname(HISTORY_FILE), { recursive: true });
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
}

/**
 * Add a new run to history, rotating to keep max MAX_HISTORY_RUNS.
 */
function appendRun(history, runData) {
  history.runs.push(runData);
  if (history.runs.length > MAX_HISTORY_RUNS) {
    history.runs = history.runs.slice(history.runs.length - MAX_HISTORY_RUNS);
  }
  return history;
}

// ── Trend Diff ────────────────────────────────────────────────────────────────

/**
 * Create a stable matching key for a finding.
 * Stable across LLM runs: file + line + category (not id).
 */
function findingKey(f) {
  return `${f.file}:${f.line}:${f.category}`;
}

/**
 * Compute trend diff between previous and current findings for a branch.
 * Returns { new: Finding[], resolved: string[], unchanged: Finding[], total: number }
 */
function computeTrend(previousFindings, currentFindings) {
  const prevKeys = new Map();
  for (const f of (previousFindings || [])) {
    prevKeys.set(findingKey(f), f);
  }

  const currKeys = new Map();
  for (const f of currentFindings) {
    currKeys.set(findingKey(f), f);
  }

  const newFindings = [];
  const unchanged = [];

  for (const [key, f] of currKeys) {
    if (prevKeys.has(key)) {
      unchanged.push(f);
    } else {
      newFindings.push(f);
    }
  }

  const resolved = [];
  for (const key of prevKeys.keys()) {
    if (!currKeys.has(key)) {
      resolved.push(key);
    }
  }

  return {
    new: newFindings,
    resolved,
    unchanged,
    total: currentFindings.length,
  };
}

// ── Slack Posting ─────────────────────────────────────────────────────────────

/**
 * Post a message to Slack via the Web API.
 * Returns a Promise resolving to true on success.
 */
function postToSlack(channel, text, token) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ channel, text });
    const options = {
      hostname: 'slack.com',
      path: '/api/chat.postMessage',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (!parsed.ok) {
            warn(`Slack API error: ${parsed.error}`);
            resolve(false);
          } else {
            resolve(true);
          }
        } catch (e) {
          warn(`Failed to parse Slack response: ${e.message}`);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      warn(`Slack request failed: ${e.message}`);
      resolve(false);
    });

    req.write(body);
    req.end();
  });
}

// ── Digest Formatting ─────────────────────────────────────────────────────────

/**
 * Format the Slack mrkdwn digest message.
 */
function formatDigest(date, branchResults, skippedBranches) {
  const lines = [];
  const scannedCount = branchResults.length;

  lines.push(`*Branch Health Scan* — ${date}`);
  lines.push(`Scanned: ${scannedCount} active branch${scannedCount !== 1 ? 'es' : ''} (last 7 days) | Skipped: ${skippedBranches.join(', ') || 'none'}`);
  lines.push('');

  if (branchResults.length === 0) {
    lines.push('No active branches found in the last 7 days.');
  } else {
    // Per-branch summary
    for (const { branch, trend } of branchResults) {
      lines.push(`*${branch}*   New: ${trend.new.length} | Resolved: ${trend.resolved.length} | Total: ${trend.total}`);
    }

    // Collect all new findings, sort by severity desc then confidence desc
    const allNew = [];
    for (const { branch, trend } of branchResults) {
      for (const f of trend.new) {
        allNew.push({ ...f, branch });
      }
    }

    allNew.sort((a, b) => {
      if (b.severity !== a.severity) return b.severity - a.severity;
      return b.confidence - a.confidence;
    });

    if (allNew.length > 0) {
      lines.push('');
      lines.push('*Top new findings:*');
      for (const f of allNew.slice(0, TOP_FINDINGS_LIMIT)) {
        const loc = f.line > 0 ? `${f.file}:${f.line}` : f.file;
        lines.push(`• [${f.id}] \`${f.branch}\` — ${loc} (sev ${f.severity}, conf ${f.confidence})`);
      }
    }

    lines.push('');
    lines.push(`Full report: \`reports/branch-scan/${date}.md\``);
  }

  return lines.join('\n');
}

// ── Per-Day Markdown Report ───────────────────────────────────────────────────

function writeDailyReport(date, branchResults, skippedBranches) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const reportPath = path.join(REPORT_DIR, `${date}.md`);

  const lines = [
    `# Branch Health Scan — ${date}`,
    '',
    `Scanned: ${branchResults.length} branch${branchResults.length !== 1 ? 'es' : ''} | Skipped: ${skippedBranches.join(', ') || 'none'}`,
    '',
    '## Summary',
    '',
    '| Branch | New | Resolved | Unchanged | Total |',
    '|--------|-----|----------|-----------|-------|',
  ];

  for (const { branch, trend } of branchResults) {
    lines.push(`| ${branch} | ${trend.new.length} | ${trend.resolved.length} | ${trend.unchanged.length} | ${trend.total} |`);
  }

  // Top new findings
  const allNew = [];
  for (const { branch, trend } of branchResults) {
    for (const f of trend.new) allNew.push({ ...f, branch });
  }
  allNew.sort((a, b) => b.severity - a.severity || b.confidence - a.confidence);

  if (allNew.length > 0) {
    lines.push('', '## Top New Findings', '', '| Rule | Branch | File:Line | Sev | Conf |', '|------|--------|-----------|-----|------|');
    for (const f of allNew.slice(0, TOP_FINDINGS_LIMIT)) {
      const loc = f.line > 0 ? `${f.file}:${f.line}` : f.file;
      lines.push(`| ${f.id} | ${f.branch} | ${loc} | ${f.severity} | ${f.confidence} |`);
    }
  }

  fs.writeFileSync(reportPath, lines.join('\n') + '\n', 'utf-8');
  log(`Daily report written: ${path.relative(ROOT, reportPath)}`);
}

// ── Per-Repo Scan ─────────────────────────────────────────────────────────────

/**
 * Run the full branch scan for a single repo config entry.
 * Returns { branchResults, skippedBranches, digest, repoName } for caller.
 *
 * @param {{ name, path, slackChannel, excludeBranches }} repoConfig
 * @param {string} date  — YYYY-MM-DD
 * @param {object} history — loaded history object (mutated in place)
 */
async function scanRepo(repoConfig, date, history) {
  const { name: repoName, path: repoPath, slackChannel, excludeBranches } = repoConfig;

  log(`[${repoName}] Scanning repo at: ${repoPath}`);

  if (!fs.existsSync(repoPath)) {
    warn(`[${repoName}] Repo path does not exist: ${repoPath} — skipping`);
    return null;
  }

  // 1. Fetch
  if (!DRY_RUN) {
    fetchRemotes(repoPath);
  } else {
    log(`[${repoName}] DRY RUN — skipping git fetch`);
  }

  // 2. Discover active branches
  const activeBranches = getActiveBranches(repoPath, excludeBranches);
  // Report which branch names are always skipped (hardcoded + per-repo extras)
  const skippedBranches = ['kb', ...excludeBranches.filter(b => !HARDCODED_EXCLUSIONS.has(b))];

  log(`[${repoName}] Active branches: ${activeBranches.length}`);

  if (DRY_RUN) {
    log(`[${repoName}] DRY RUN — would scan: ${activeBranches.join(', ') || '(none)'}`);
    log(`[${repoName}] DRY RUN — Slack channel: ${slackChannel || '(not configured)'}`);
    const mockResults = activeBranches.map(branch => ({
      branch,
      trend: { new: [], resolved: [], unchanged: [], total: 0 },
    }));
    const digest = formatDigest(date, mockResults, skippedBranches);
    log(`[${repoName}] DRY RUN digest preview:\n${digest}`);
    return { branchResults: mockResults, skippedBranches, digest, repoName, slackChannel };
  }

  // 3. Load previous run for this repo from history
  const previousRun = history.runs[history.runs.length - 1] || null;
  const previousRepoBranches = previousRun?.repos?.[repoName]?.branches || {};

  // 4. Scan each branch
  const branchResults = [];
  const runBranches = {};

  for (const branch of activeBranches) {
    log(`[${repoName}] Scanning branch: ${branch}`);

    const diffFiles = getBranchDiffFiles(branch, repoPath);
    log(`[${repoName}]   ${diffFiles.length} file(s) changed vs main`);

    const findings = reviewBranchDiff(branch, diffFiles, repoPath);
    log(`[${repoName}]   ${findings.length} finding(s) after confidence filter`);

    const previousFindings = previousRepoBranches[branch]?.findings || null;
    const trend = computeTrend(previousFindings, findings);

    log(`[${repoName}]   Trend — new: ${trend.new.length}, resolved: ${trend.resolved.length}, unchanged: ${trend.unchanged.length}`);

    branchResults.push({ branch, trend, findings });

    runBranches[branch] = {
      commit: getBranchCommit(branch, repoPath),
      findings,
    };
  }

  // 5. Write daily markdown report
  writeDailyReport(date, branchResults, skippedBranches);

  // 6. Append this repo's data into the shared history run (accumulated across repos)
  const latestRun = history.runs[history.runs.length - 1];
  if (latestRun && latestRun.timestamp.startsWith(date)) {
    // Same day run already started — merge repo data into it
    if (!latestRun.repos) latestRun.repos = {};
    latestRun.repos[repoName] = { branches: runBranches };
  } else {
    // First repo for today — push new run
    const newRun = {
      timestamp: new Date().toISOString(),
      repos: { [repoName]: { branches: runBranches } },
    };
    appendRun(history, newRun);
  }

  const digest = formatDigest(date, branchResults, skippedBranches);
  return { branchResults, skippedBranches, digest, repoName, slackChannel };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  log(`Starting branch health scan (date=${date}, dry-run=${DRY_RUN})`);

  // Load scan config (single-repo default if no config file)
  const scanConfig = loadScanConfig();
  log(`Repos to scan: ${scanConfig.repos.map(r => r.name).join(', ')}`);

  // Load shared history
  const history = loadHistory();

  // Scan each repo
  const slackToken = process.env.SLACK_BOT_TOKEN;
  let anySlackFailure = false;

  for (const repoConfig of scanConfig.repos) {
    const result = await scanRepo(repoConfig, date, history);
    if (!result) continue; // repo path missing

    if (DRY_RUN) continue;

    // Post Slack digest for this repo
    const { digest, slackChannel, repoName } = result;

    if (!slackChannel) {
      warn(`[${repoName}] No slackChannel configured — skipping Slack post`);
    } else if (!slackToken) {
      warn(`[${repoName}] SLACK_BOT_TOKEN not set — skipping Slack post`);
    } else {
      log(`[${repoName}] Posting digest to Slack: ${slackChannel}`);
      const posted = await postToSlack(slackChannel, digest, slackToken);
      if (posted) {
        log(`[${repoName}] Digest posted`);
      } else {
        warn(`[${repoName}] Slack post failed`);
        anySlackFailure = true;
      }
    }
  }

  // Save updated history (accumulated across all repos)
  if (!DRY_RUN) {
    saveHistory(history);
    log(`History saved (${history.runs.length} runs)`);
  }

  if (anySlackFailure) {
    warn('One or more Slack posts failed — check logs above');
  }

  log('Branch scan complete');
  process.exit(0);
}

main().catch((err) => {
  console.error('[branch-scan] Fatal error:', err.message);
  process.exit(0); // always exit 0 — non-blocking
});
