#!/usr/bin/env node
/**
 * Agent Profiler - Track agent execution timing
 *
 * Usage:
 *   const profiler = require('./agent-profiler.cjs');
 *   profiler.startTimer('agent-name');
 *   // ... agent work ...
 *   profiler.endTimer('agent-name');
 *   console.log(profiler.report());
 *
 * Storage: /tmp/epost-agent-timing-{sessionId}.json
 * Format: { agentName: { start: timestamp, end: timestamp, duration: ms } }
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Get session-specific timing file path
 */
function getTimingFilePath() {
  const sessionId = process.env.CK_SESSION_ID || 'default';
  return path.join(os.tmpdir(), `epost-agent-timing-${sessionId}.json`);
}

/**
 * Read current timing data
 */
function readTimingData() {
  const filePath = getTimingFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    // Corrupted or invalid, start fresh
  }
  return {};
}

/**
 * Write timing data atomically with file locking
 */
function writeTimingData(data) {
  const filePath = getTimingFilePath();
  const tmpPath = `${filePath}.tmp`;
  const lockPath = `${filePath}.lock`;

  // Acquire lock (spin-wait max 5s)
  const lockStart = Date.now();
  while (fs.existsSync(lockPath)) {
    if (Date.now() - lockStart > 5000) throw new Error('Lock timeout');
    // Busy-wait 10ms
    const end = Date.now() + 10;
    while (Date.now() < end);
  }

  try {
    fs.writeFileSync(lockPath, process.pid.toString(), 'utf-8');
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpPath, filePath);
  } finally {
    if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
  }
}

/**
 * Start timing an agent
 */
function startTimer(agentName) {
  const data = readTimingData();
  data[agentName] = {
    start: Date.now(),
    end: null,
    duration: null
  };
  writeTimingData(data);
}

/**
 * End timing an agent
 */
function endTimer(agentName) {
  const data = readTimingData();
  if (data[agentName] && data[agentName].start) {
    const end = Date.now();
    data[agentName].end = end;
    data[agentName].duration = end - data[agentName].start;
    writeTimingData(data);
  }
}

/**
 * Generate timing report
 */
function report() {
  const data = readTimingData();
  const agents = Object.keys(data).sort();

  if (agents.length === 0) {
    return 'No agent timing data available';
  }

  const lines = ['Agent Execution Timing:', ''];
  let totalDuration = 0;

  for (const agent of agents) {
    const timing = data[agent];
    if (timing.duration !== null) {
      const seconds = (timing.duration / 1000).toFixed(2);
      lines.push(`  ${agent}: ${seconds}s`);
      totalDuration += timing.duration;
    } else {
      lines.push(`  ${agent}: (in progress)`);
    }
  }

  if (totalDuration > 0) {
    const totalSeconds = (totalDuration / 1000).toFixed(2);
    lines.push('', `Total: ${totalSeconds}s`);
  }

  return lines.join('\n');
}

/**
 * Clear timing data for current session
 */
function clear() {
  const filePath = getTimingFilePath();
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = {
  startTimer,
  endTimer,
  report,
  clear
};
