#!/usr/bin/env node
/**
 * cook-after-plan-reminder.cjs — SubagentStop
 *
 * Fires when any subagent stops. If the planner agent created/modified a plan file,
 * reminds the user to run /cook or start implementation.
 */

const fs = require('fs');

let input = {};
try {
  const raw = fs.readFileSync('/dev/stdin').toString();
  input = JSON.parse(raw);
} catch {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

// Only fire for epost-planner
const agentName = input?.agent_name || input?.subagent_name || '';
if (!agentName.includes('planner')) {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

// Check if a plan file was written (look for plans/ in tool output)
const toolResults = input?.tool_results || [];
const planWritten = toolResults.some(r => {
  const fp = r?.file_path || r?.tool_input?.file_path || '';
  return fp.includes('plans/') && fp.endsWith('.md');
});

if (planWritten) {
  const message = 'Plan complete. Run `/cook` or say "implement the plan" to start building.';
  process.stdout.write(JSON.stringify({ continue: true, stdout: message }));
} else {
  process.stdout.write(JSON.stringify({ continue: true }));
}

process.exit(0);
