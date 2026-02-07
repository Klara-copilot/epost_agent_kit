#!/usr/bin/env node
/**
 * Set active plan in session state
 *
 * Usage: node .claude/scripts/set-active-plan.cjs <plan-directory>
 *
 * Writes plan path to session temp file for hook injection.
 * Supports both absolute and relative paths.
 */

const path = require('path');
const fs = require('fs');

// Import session state utilities
const { readSessionState, writeSessionState, normalizePath } = require('../hooks/lib/ck-config-utils.cjs');

/**
 * Main execution
 */
function main() {
  // Parse arguments
  const planPath = process.argv[2];
  if (!planPath) {
    console.error('Usage: set-active-plan.cjs <plan-directory>');
    console.error('Example: node .claude/scripts/set-active-plan.cjs plans/260206-0003-my-feature');
    process.exit(1);
  }

  // Resolve path (relative -> absolute using CWD)
  const cwd = process.cwd();
  const resolvedPath = path.isAbsolute(planPath)
    ? planPath
    : path.resolve(cwd, planPath);
  // Normalize path (remove trailing slashes, etc.)
  const absolutePath = normalizePath(resolvedPath) || resolvedPath;

  // Validate plan directory exists
  if (!fs.existsSync(absolutePath)) {
    console.error('Error: Plan directory does not exist: ' + absolutePath);
    console.error('Please check the path and try again.');
    process.exit(1);
  }

  // Validate it's a directory
  const stats = fs.statSync(absolutePath);
  if (!stats.isDirectory()) {
    console.error('Error: Path is not a directory: ' + absolutePath);
    process.exit(1);
  }

  // Get session ID from environment
  const sessionId = process.env.CK_SESSION_ID;
  if (!sessionId) {
    console.error('Warning: CK_SESSION_ID not set. Session state may not persist.');
    console.error('Active plan set locally but may not be available to subagents.');
    process.exit(1);
  }

  try {
    // Read current session state or create new
    let state = readSessionState(sessionId);
    if (!state) {
      state = {
        sessionOrigin: cwd,
        activePlan: null,
        suggestedPlan: null,
        timestamp: null,
        source: null
      };
    }

    // Update state with new active plan
    state.activePlan = absolutePath;
    state.timestamp = Date.now();
    state.source = 'set-active-plan';
    state.sessionOrigin = cwd;

    // Write state to session temp file
    const success = writeSessionState(sessionId, state);
    if (!success) {
      console.error('Error: Failed to write session state');
      process.exit(1);
    }

    // Print confirmation
    console.log('Active plan set to: ' + absolutePath);
    process.exit(0);
  } catch (error) {
    console.error('Error: ' + error.message);
    process.exit(1);
  }
}

main();
