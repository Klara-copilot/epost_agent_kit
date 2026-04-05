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
  const raw = fs.readFileSync('/dev/stdin', 'utf-8');
  input = JSON.parse(raw);
} catch {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

// Only fire for epost-planner (SubagentStop uses agent_type field)
const agentType = input?.agent_type || '';
if (!agentType.toLowerCase().includes('plan')) {
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
  console.log(message);
}

process.stdout.write(JSON.stringify({ continue: true }));

process.exit(0);
