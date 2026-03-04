#!/usr/bin/env node
/**
 * Detection Engine — Analyzes session metrics and knowledge for improvement opportunities
 *
 * Reads: .epost-data/improvements/sessions.jsonl + docs/
 * Output: JSON report to stdout + .epost-data/improvements/latest-report.json
 *
 * Detections:
 *   - Repeat errors (same type 3+ times in 7 days)
 *   - Skill gaps (platform detected, no platform-skill loaded)
 *   - Stale knowledge (docs/ entries >90 days without references)
 *   - Rework patterns (avg fixIterations >2)
 *   - Unused skills (loaded but unreferenced 10+ sessions)
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), '.epost-data', 'improvements');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.jsonl');
const REPORT_FILE = path.join(DATA_DIR, 'latest-report.json');
const DOCS_DIR = path.join(process.cwd(), 'docs');

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

// Platform → expected skills mapping
const PLATFORM_SKILLS = {
  web: ['web-frontend', 'web-nextjs', 'web-api-routes'],
  ios: ['ios-development'],
  android: ['android-development'],
  backend: ['backend-javaee']
};

function readSessions() {
  try {
    if (!fs.existsSync(SESSIONS_FILE)) return [];
    return fs.readFileSync(SESSIONS_FILE, 'utf-8')
      .split('\n')
      .filter(Boolean)
      .map(line => { try { return JSON.parse(line); } catch { return null; } })
      .filter(Boolean);
  } catch { return []; }
}

function getRecentSessions(sessions, windowMs) {
  const cutoff = Date.now() - windowMs;
  return sessions.filter(s => new Date(s.timestamp).getTime() > cutoff);
}

/**
 * Detection: Repeat errors — same error type 3+ times in 7 days
 */
function detectRepeatErrors(sessions) {
  const recent = getRecentSessions(sessions, SEVEN_DAYS_MS);
  const errorCounts = {};

  for (const s of recent) {
    for (const t of (s.errors?.types || [])) {
      errorCounts[t] = (errorCounts[t] || 0) + 1;
    }
  }

  return Object.entries(errorCounts)
    .filter(([, count]) => count >= 3)
    .map(([type, count]) => ({
      detection: 'repeat-error',
      severity: 'high',
      detail: `"${type}" errors occurred ${count} times in last 7 days`,
      recommendation: `Create FINDING in docs/findings/ or investigate root cause`
    }));
}

/**
 * Detection: Skill gaps — platform detected but no matching skill loaded
 */
function detectSkillGaps(sessions) {
  const recent = getRecentSessions(sessions, SEVEN_DAYS_MS);
  const findings = [];

  for (const s of recent) {
    const platform = s.routing?.platform;
    if (!platform || !PLATFORM_SKILLS[platform]) continue;

    const loaded = new Set(s.skills?.loaded || []);
    const expected = PLATFORM_SKILLS[platform];
    const missing = expected.filter(sk => !loaded.has(sk));

    if (missing.length > 0) {
      findings.push({
        detection: 'skill-gap',
        severity: 'medium',
        detail: `Platform "${platform}" detected but skills not loaded: ${missing.join(', ')}`,
        recommendation: `Check skill keywords and agent skills: list`,
        session: s.sessionId
      });
    }
  }

  // Deduplicate by platform
  const seen = new Set();
  return findings.filter(f => {
    const key = f.detail;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Detection: Stale knowledge — docs/ entries >90 days old
 */
function detectStaleKnowledge() {
  const findings = [];
  const cutoff = Date.now() - NINETY_DAYS_MS;

  try {
    if (!fs.existsSync(DOCS_DIR)) return [];

    const indexPath = path.join(DOCS_DIR, 'index.json');
    if (!fs.existsSync(indexPath)) return [];

    const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    for (const entry of (index.entries || [])) {
      const updated = entry.updatedAt || entry.created;
      if (!updated) continue;

      const entryDate = new Date(updated).getTime();
      if (entryDate < cutoff) {
        const age = Math.round((Date.now() - entryDate) / (24 * 60 * 60 * 1000));
        findings.push({
          detection: 'stale-knowledge',
          severity: 'low',
          detail: `${entry.id}: "${entry.title}" — ${age} days since last update`,
          recommendation: `Review for accuracy or archive if obsolete`
        });
      }
    }
  } catch { /* silent */ }

  return findings;
}

/**
 * Detection: Rework patterns — avg fixIterations > 2 over recent sessions
 */
function detectReworkPatterns(sessions) {
  const recent = getRecentSessions(sessions, SEVEN_DAYS_MS);
  if (recent.length < 3) return []; // Need enough data

  const iterations = recent
    .map(s => s.rework?.fixIterations || 0)
    .filter(n => n > 0);

  if (iterations.length === 0) return [];

  const avg = iterations.reduce((a, b) => a + b, 0) / iterations.length;

  if (avg > 2) {
    return [{
      detection: 'rework-pattern',
      severity: 'high',
      detail: `Average fix iterations: ${avg.toFixed(1)} across ${iterations.length} sessions (last 7 days)`,
      recommendation: `Review verification process — high rework suggests unclear requirements or insufficient testing`
    }];
  }

  return [];
}

/**
 * Detection: Unused skills — loaded but unreferenced 10+ sessions
 */
function detectUnusedSkills(sessions) {
  const recent = sessions.slice(-20); // Last 20 sessions
  if (recent.length < 10) return [];

  const loadCounts = {};
  const useCounts = {};

  for (const s of recent) {
    for (const sk of (s.skills?.loaded || [])) {
      loadCounts[sk] = (loadCounts[sk] || 0) + 1;
    }
    for (const sk of (s.skills?.unused || [])) {
      useCounts[sk] = (useCounts[sk] || 0) + 1;
    }
  }

  return Object.entries(useCounts)
    .filter(([sk, unusedCount]) => unusedCount >= 10 && loadCounts[sk])
    .map(([sk, unusedCount]) => ({
      detection: 'unused-skill',
      severity: 'low',
      detail: `Skill "${sk}" loaded but unused in ${unusedCount} of last ${recent.length} sessions`,
      recommendation: `Optimize skill keywords or remove from agent skills: list`
    }));
}

function main() {
  const sessions = readSessions();

  const findings = [
    ...detectRepeatErrors(sessions),
    ...detectSkillGaps(sessions),
    ...detectStaleKnowledge(),
    ...detectReworkPatterns(sessions),
    ...detectUnusedSkills(sessions)
  ];

  // Sort by severity
  const severityOrder = { high: 0, medium: 1, low: 2 };
  findings.sort((a, b) => (severityOrder[a.severity] || 9) - (severityOrder[b.severity] || 9));

  const report = {
    generated: new Date().toISOString(),
    sessionsAnalyzed: sessions.length,
    findingsCount: findings.length,
    findings
  };

  // Write report file
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  } catch { /* silent */ }

  // Output to stdout
  console.log(JSON.stringify(report, null, 2));
}

main();
