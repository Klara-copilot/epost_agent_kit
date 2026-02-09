#!/usr/bin/env node
/**
 * Get active plan from session state
 *
 * Usage: node .claude/scripts/get-active-plan.cjs
 *
 * Reads active plan path from session temp file.
 * Prints path to stdout or 'none' if no active plan.
 */

// Version check (must run before requires that may use Node 18+ APIs)
const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
  console.error('Error: Node.js >= 18.0.0 required (current: ' + process.version + ')');
  console.error('Please upgrade: https://nodejs.org/ or use nvm: nvm install 18');
  process.exit(1);
}

const { readSessionState } = require('../hooks/lib/ck-config-utils.cjs');

/**
 * Main execution
 */
function main() {
  // Get session ID from environment
  const sessionId = process.env.CK_SESSION_ID;
  if (!sessionId) {
    console.error('Warning: CK_SESSION_ID not set');
    console.log('none');
    process.exit(0);
  }

  try {
    // Read session state
    const state = readSessionState(sessionId);
    
    // Output active plan or 'none'
    if (state && state.activePlan) {
      console.log(state.activePlan);
    } else {
      console.log('none');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error: ' + error.message);
    console.log('none');
    process.exit(0);
  }
}

main();
