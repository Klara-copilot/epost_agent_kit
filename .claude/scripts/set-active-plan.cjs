#!/usr/bin/env node
/**
 * Set Active Plan - Writes plan path to session state
 * Usage: node .claude/scripts/set-active-plan.cjs <plan-directory>
 * Exit codes: 0=success, 1=error
 */

const path = require('path');
const fs = require('fs');
const { readSessionState, writeSessionState, normalizePath } = require('../hooks/lib/ck-config-utils.cjs');

const planPath = process.argv[2];
if (!planPath) {
  console.error('Usage: set-active-plan.cjs <plan-directory>');
  console.error('Example: node .claude/scripts/set-active-plan.cjs plans/260206-0003-my-feature');
  process.exit(1);
}

const cwd = path.resolve(process.cwd());
const resolvedPath = path.isAbsolute(planPath) ? planPath : path.join(cwd, planPath);
const normalizedPath = normalizePath(resolvedPath);

if (!normalizedPath) {
  console.error(`Error: Invalid plan path: ${planPath}`);
  process.exit(1);
}

if (!fs.existsSync(normalizedPath)) {
  console.error(`Error: Plan directory does not exist: ${normalizedPath}`);
  console.error('Please create the plan directory first or check the path.');
  process.exit(1);
}

if (!fs.statSync(normalizedPath).isDirectory()) {
  console.error(`Error: Path is not a directory: ${normalizedPath}`);
  process.exit(1);
}

const sessionId = process.env.CK_SESSION_ID;

if (!sessionId) {
  console.warn('Warning: CK_SESSION_ID not set. Plan state may not persist.');
  console.warn('This is expected if running outside Claude Code session.');
}

let state = sessionId ? readSessionState(sessionId) : {};
if (!state) state = { sessionOrigin: cwd, timestamp: Date.now() };

state.activePlan = normalizedPath;
state.timestamp = Date.now();
state.source = 'set-active-plan';

if (sessionId) {
  if (!writeSessionState(sessionId, state)) {
    console.error('Error: Failed to write session state. Check /tmp permissions.');
    process.exit(1);
  }
  console.log(`✓ Active plan set: ${normalizedPath}`);
  console.log(`Session: ${sessionId}`);
} else {
  console.log(`✓ Plan path resolved: ${normalizedPath}`);
  console.log('(Not persisted - no session ID)');
}

process.exit(0);
