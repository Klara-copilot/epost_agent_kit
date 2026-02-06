#!/usr/bin/env node
/**
 * Get Active Plan Script
 *
 * Reads and prints current active plan path from session state.
 * Usage: node .claude/scripts/get-active-plan.cjs
 */

const { readSessionState } = require('../hooks/lib/ck-config-utils.cjs');

// Get session ID from environment
const sessionId = process.env.CK_SESSION_ID;

if (!sessionId) {
  console.log('none');
  process.exit(0);
}

// Read session state
const state = readSessionState(sessionId);

if (!state || !state.activePlan) {
  console.log('none');
  process.exit(0);
}

// Print active plan path
console.log(state.activePlan);
process.exit(0);
