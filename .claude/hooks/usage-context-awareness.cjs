#!/usr/bin/env node
/**
 * usage-context-awareness.cjs — PostToolUse & UserPromptSubmit Hook
 *
 * Fetches Claude Code usage limits from Anthropic OAuth API and writes to cache.
 * Throttled: 1 min per UserPromptSubmit, 5 min per PostToolUse (avoids noise).
 *
 * Cache file read by context-builder.cjs for injection into tool results.
 * Based on claudekit v2.14 usage-context-awareness, adapted for epost patterns.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const USAGE_CACHE_FILE = path.join(os.tmpdir(), 'epost-usage-limits-cache.json');
const CACHE_TTL_PROMPT_MS = 60_000;   // 1 min for UserPromptSubmit
const CACHE_TTL_TOOL_MS   = 300_000;  // 5 min for PostToolUse

/**
 * Get Claude OAuth access token (macOS Keychain → file fallback)
 */
function getClaudeCredentials() {
  if (os.platform() === 'darwin') {
    try {
      const raw = execSync('security find-generic-password -s "Claude Code-credentials" -w', {
        timeout: 5000,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim();
      const parsed = JSON.parse(raw);
      if (parsed.claudeAiOauth?.accessToken) return parsed.claudeAiOauth.accessToken;
    } catch { /* fall through */ }
  }

  const credPath = path.join(os.homedir(), '.claude', '.credentials.json');
  try {
    const parsed = JSON.parse(fs.readFileSync(credPath, 'utf-8'));
    return parsed.claudeAiOauth?.accessToken || null;
  } catch {
    return null;
  }
}

/**
 * Returns true if enough time has elapsed since last fetch.
 */
function shouldFetch(isPromptEvent) {
  const ttl = isPromptEvent ? CACHE_TTL_PROMPT_MS : CACHE_TTL_TOOL_MS;
  try {
    if (fs.existsSync(USAGE_CACHE_FILE)) {
      const cache = JSON.parse(fs.readFileSync(USAGE_CACHE_FILE, 'utf-8'));
      if (Date.now() - (cache.timestamp || 0) < ttl) return false;
    }
  } catch { /* treat as should-fetch */ }
  return true;
}

/**
 * Atomic cache write (temp+rename prevents partial reads).
 */
function writeCache(status, data) {
  const tmp = `${USAGE_CACHE_FILE}.${process.pid}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(tmp, JSON.stringify({ timestamp: Date.now(), status, data: data || null }));
    fs.renameSync(tmp, USAGE_CACHE_FILE);
  } catch {
    try { fs.unlinkSync(tmp); } catch { /* ignore */ }
  }
}

/**
 * Fetch usage limits from Anthropic OAuth API and persist to cache.
 */
async function fetchAndCacheUsage() {
  const token = getClaudeCredentials();
  if (!token) {
    writeCache('unavailable', null);
    return;
  }

  try {
    const res = await fetch('https://api.anthropic.com/api/oauth/usage', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'anthropic-beta': 'oauth-2025-04-20',
        'User-Agent': 'epost-agent-kit/2.0',
      },
    });

    if (!res.ok) { writeCache('unavailable', null); return; }
    writeCache('available', await res.json());
  } catch {
    writeCache('unavailable', null);
  }
}

async function main() {
  let inputStr = '';
  try { inputStr = fs.readFileSync(0, 'utf-8'); } catch { /* stdin closed */ }

  const input = (() => { try { return JSON.parse(inputStr || '{}'); } catch { return {}; } })();
  const isPromptEvent = typeof input.prompt === 'string';

  if (shouldFetch(isPromptEvent)) {
    await fetchAndCacheUsage();
  }

  // Hook never blocks — always continue
  process.stdout.write(JSON.stringify({ continue: true }));
}

main().catch(() => {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
});
