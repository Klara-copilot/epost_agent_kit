#!/usr/bin/env node
/**
 * Daily "Did You Know?" Slack poster
 * Picks today's rotating tip and posts it to Slack
 *
 * Usage:
 *   node didyouknow-slack.cjs
 *
 * Schedule via cron (e.g., 9am Mon–Fri):
 *   0 9 * * 1-5 cd /path/to/epost_agent_kit && node packages/kit/hooks/didyouknow-slack.cjs
 *
 * Requires:
 *   SLACK_WEBHOOK_URL set in process.env, ~/.claude/.env, or .claude/.env
 */
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const TIPS_PATH = path.join(__dirname, '../../core/skills/didyouknow/references/tips.md');

// ---------------------------------------------------------------------------
// Env loader (cascade: process.env > ~/.claude/.env > .claude/.env)
// ---------------------------------------------------------------------------

function parseEnvContent(content) {
  const result = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      const ci = value.indexOf('#');
      if (ci !== -1) value = value.slice(0, ci).trim();
    }
    if (key) result[key] = value;
  }
  return result;
}

function loadEnv(cwd = process.cwd()) {
  const files = [
    path.join(cwd, '.claude', '.env'),
    path.join(os.homedir(), '.claude', '.env'),
  ];
  let merged = {};
  for (const f of files) {
    try {
      if (fs.existsSync(f)) merged = { ...merged, ...parseEnvContent(fs.readFileSync(f, 'utf8')) };
    } catch (_) { /* ignore */ }
  }
  return { ...merged, ...process.env };
}

// ---------------------------------------------------------------------------
// HTTP sender
// ---------------------------------------------------------------------------

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 120)}`);
  }
}

// ---------------------------------------------------------------------------
// Tip parser
// ---------------------------------------------------------------------------

function parseTips(content) {
  const tips = [];
  let currentCategory = '';
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ') && !line.startsWith('## Kit')) {
      currentCategory = line.slice(3).trim();
      i++;
      continue;
    }

    if (line.startsWith('### TIP-')) {
      const match = line.match(/^### (TIP-\d+): (.+)$/);
      if (!match) { i++; continue; }

      const id = match[1];
      const title = match[2];
      i++;

      let tags = [];
      if (i < lines.length && lines[i].startsWith('tags:')) {
        tags = lines[i].slice(5).trim().split(',').map(t => t.trim());
        i++;
      }
      if (i < lines.length && lines[i].trim() === '') i++;

      const bodyLines = [];
      while (
        i < lines.length &&
        !lines[i].startsWith('Example:') &&
        !lines[i].startsWith('Related:') &&
        lines[i].trim() !== '---'
      ) {
        bodyLines.push(lines[i]);
        i++;
      }
      while (bodyLines.length > 0 && bodyLines[bodyLines.length - 1].trim() === '') bodyLines.pop();

      const exampleLines = [];
      if (i < lines.length && lines[i].startsWith('Example:')) {
        i++;
        while (i < lines.length && !lines[i].startsWith('Related:') && lines[i].trim() !== '---') {
          exampleLines.push(lines[i]);
          i++;
        }
        while (exampleLines.length > 0 && exampleLines[exampleLines.length - 1].trim() === '') exampleLines.pop();
      }

      let related = '';
      if (i < lines.length && lines[i].startsWith('Related:')) {
        related = lines[i].slice(8).trim();
        i++;
      }

      tips.push({
        id,
        title,
        category: currentCategory,
        tags,
        body: bodyLines.join('\n').trim(),
        example: exampleLines.map(l => l.replace(/^  /, '')).join('\n').trim(),
        related,
      });
      continue;
    }

    i++;
  }

  return tips;
}

// ---------------------------------------------------------------------------
// Day-of-year for deterministic daily rotation
// ---------------------------------------------------------------------------

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// Slack Block Kit payload
// ---------------------------------------------------------------------------

function buildSlackPayload(tip) {
  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `💡 Did You Know? — ${tip.title}` }
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: tip.body }
    }
  ];

  if (tip.example) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Example:*\n\`\`\`\n${tip.example}\n\`\`\`` }
    });
  }

  blocks.push({ type: 'divider' });

  const contextLines = [];
  if (tip.related) contextLines.push(`*Related:* ${tip.related}`);
  contextLines.push(
    `\`${tip.id}\` · _${tip.category}_   |   \`/didyouknow <topic>\` to search   |   \`/didyouknow --all\` to browse`
  );

  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: contextLines.join('\n') }]
  });

  return {
    text: `💡 Did You Know? — ${tip.title}`,
    blocks,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const env = loadEnv(process.cwd());

  if (!env.SLACK_WEBHOOK_URL) {
    console.error('[didyouknow-slack] SLACK_WEBHOOK_URL not set — skipping');
    process.exit(0);
  }

  let tipsContent;
  try {
    tipsContent = fs.readFileSync(TIPS_PATH, 'utf8');
  } catch (err) {
    console.error(`[didyouknow-slack] Failed to read tips file: ${err.message}`);
    process.exit(1);
  }

  const tips = parseTips(tipsContent);
  if (tips.length === 0) {
    console.error('[didyouknow-slack] No tips found in tips.md');
    process.exit(1);
  }

  const dayIndex = getDayOfYear() % tips.length;
  const tip = tips[dayIndex];

  console.error(`[didyouknow-slack] Posting tip ${tip.id}: "${tip.title}" (day slot ${dayIndex}/${tips.length})`);

  try {
    await postJson(env.SLACK_WEBHOOK_URL, buildSlackPayload(tip));
    console.error('[didyouknow-slack] Posted successfully');
  } catch (err) {
    console.error(`[didyouknow-slack] Failed: ${err.message}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(`[didyouknow-slack] Fatal: ${err.message}`);
  process.exit(1);
});
