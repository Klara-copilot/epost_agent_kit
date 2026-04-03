'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const KERNEL_REPO = 'git@bitbucket.org:axonivy-prod/agent-kernel.git';
const CACHE_DIR = path.join(os.homedir(), '.epost-kit', 'cache', 'agent-kernel');
const STALE_AFTER_MS = 24 * 60 * 60 * 1000; // 24h

/** Check whether the cached clone is older than STALE_AFTER_MS. */
function isCacheStale() {
  const fetchHead = path.join(CACHE_DIR, '.git', 'FETCH_HEAD');
  if (!fs.existsSync(fetchHead)) return true;
  return Date.now() - fs.statSync(fetchHead).mtimeMs > STALE_AFTER_MS;
}

/** Run a git command and return { ok, stderr }. */
function git(args, cwd) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', timeout: 30_000 });
  return { ok: r.status === 0, stderr: (r.stderr || '').trim() };
}

/**
 * Ensure agent-kernel is cloned and reasonably up to date.
 * Returns the absolute path to the skills/ directory, or null on failure.
 * Failures are non-fatal: caller continues with degraded results.
 * @param {boolean} forceRefresh - bypass 24h cache check
 * @returns {string|null}
 */
function syncKernel(forceRefresh = false) {
  if (!fs.existsSync(CACHE_DIR)) {
    process.stderr.write('[kernel] Cloning agent-kernel (first time)...\n');
    fs.mkdirSync(path.dirname(CACHE_DIR), { recursive: true });
    const r = git(['clone', KERNEL_REPO, CACHE_DIR], os.homedir());
    if (!r.ok) {
      process.stderr.write(`[kernel] Clone failed — SSH key configured for Bitbucket?\n  ${r.stderr}\n`);
      return null;
    }
  } else if (forceRefresh || isCacheStale()) {
    process.stderr.write('[kernel] Pulling latest agent-kernel...\n');
    const r = git(['pull', '--ff-only'], CACHE_DIR);
    if (!r.ok) {
      // Non-fatal: serve stale cache, warn user
      process.stderr.write(`[kernel] Pull failed (serving cached version): ${r.stderr}\n`);
    }
  }

  const skillsDir = path.join(CACHE_DIR, 'skills');
  return fs.existsSync(skillsDir) ? skillsDir : null;
}

module.exports = { syncKernel, CACHE_DIR };
