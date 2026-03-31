#!/usr/bin/env node
'use strict';

/**
 * statusline.cjs — epost_agent_kit Claude Code status bar
 *
 * Displays: model · context bar · time left · dir · branch
 * No external dependencies — all utilities inlined.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ── ANSI Colors ───────────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const DIM   = '\x1b[2m';
const GREEN   = '\x1b[32m';
const YELLOW  = '\x1b[33m';
const MAGENTA = '\x1b[35m';
const CYAN    = '\x1b[36m';

const useColor = !process.env.NO_COLOR;

function colorize(text, code) {
  return useColor ? `${code}${text}${RESET}` : String(text);
}
const cyan    = t => colorize(t, CYAN);
const yellow  = t => colorize(t, YELLOW);
const magenta = t => colorize(t, MAGENTA);
const dim     = t => colorize(t, DIM);

/** Threshold-based color for context % */
function ctxColor(pct) {
  if (pct >= 85) return '\x1b[31m'; // red
  if (pct >= 70) return YELLOW;
  return GREEN;
}

/** Unicode progress bar ▰▱ */
function progressBar(pct, width = 12) {
  const clamped = Math.max(0, Math.min(100, pct));
  const filled  = Math.round((clamped / 100) * width);
  const empty   = width - filled;
  if (!useColor) return '▰'.repeat(filled) + '▱'.repeat(empty);
  const color = ctxColor(pct);
  return `${color}${'▰'.repeat(filled)}${DIM}${'▱'.repeat(empty)}${RESET}`;
}

// ── Git Info ──────────────────────────────────────────────────────────────────

function execIn(cmd, cwd) {
  try {
    return execSync(cmd, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
      cwd: cwd || undefined,
      timeout: 3000,
      windowsHide: true,
    }).trim();
  } catch {
    return '';
  }
}

function getGitInfo(cwd) {
  if (!execIn('git rev-parse --git-dir', cwd)) return null;
  const branch = execIn('git branch --show-current', cwd)
    || execIn('git rev-parse --short HEAD', cwd);
  return { branch };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function expandHome(p) {
  const home = os.homedir();
  return p.startsWith(home) ? p.replace(home, '~') : p;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const chunks = [];
  process.stdin.setEncoding('utf8');
  await new Promise((resolve, reject) => {
    process.stdin.on('data', c => chunks.push(c));
    process.stdin.on('end', resolve);
    process.stdin.on('error', reject);
  });

  let data;
  try {
    data = JSON.parse(chunks.join(''));
  } catch {
    console.log('📁 ' + expandHome(process.cwd()));
    return;
  }

  // Model
  const modelName = data.model?.display_name || 'Claude';

  // Directory
  const rawDir = data.workspace?.current_dir || data.cwd || process.cwd();
  const currentDir = expandHome(rawDir);

  // Context %
  const usage = data.context_window?.current_usage || {};
  const contextSize = data.context_window?.context_window_size || 0;
  let contextPct = 0;
  if (contextSize > 0) {
    const preCalc = data.context_window?.used_percentage;
    if (typeof preCalc === 'number' && preCalc >= 0) {
      contextPct = Math.round(preCalc);
    } else {
      const tokens = (usage.input_tokens ?? 0)
        + (usage.cache_creation_input_tokens ?? 0)
        + (usage.cache_read_input_tokens ?? 0);
      contextPct = Math.min(100, Math.round((tokens / contextSize) * 100));
    }
  }

  // Usage limits (written by usage-context-awareness hook)
  let usageStr = '';
  let usagePct = null;
  try {
    const cachePath = process.env.CK_USAGE_CACHE_PATH
      || path.join(os.tmpdir(), 'ck-usage-limits-cache.json');
    if (fs.existsSync(cachePath)) {
      const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      if (cache.status !== 'unavailable') {
        const fiveHour = cache.data?.five_hour;
        usagePct = fiveHour?.utilization ?? null;
        const resetAt = fiveHour?.resets_at;
        if (resetAt) {
          const remaining = Math.floor(new Date(resetAt).getTime() / 1000) - Math.floor(Date.now() / 1000);
          if (remaining > 0 && remaining < 18000) {
            const rh = Math.floor(remaining / 3600);
            const rm = Math.floor((remaining % 3600) / 60);
            usageStr = `${rh}h ${rm}m left`;
            if (usagePct != null) usageStr += ` (${Math.round(usagePct)}% used)`;
          }
        }
      }
    }
  } catch {}

  // Git
  const git = getGitInfo(rawDir);

  // ── Render ──
  // Line 1: model + context bar + usage
  let line = `🤖 ${cyan(modelName)}`;
  if (contextPct > 0) {
    const color = ctxColor(contextPct);
    line += `  ${progressBar(contextPct, 12)} ${color}${contextPct}%${RESET}`;
  }
  if (usageStr) {
    line += `  ⌛ ${dim(usageStr)}`;
  }
  line += `  📁 ${yellow(currentDir)}`;
  if (git?.branch) {
    line += `  🌿 ${magenta(git.branch)}`;
  }

  console.log(line);
}

main().catch(() => {
  console.log('📁 ' + expandHome(process.cwd()));
});
