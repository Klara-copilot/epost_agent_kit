#!/usr/bin/env node
/**
 * Daily "Did You Know?" Slack poster
 * Picks today's rotating tip and posts it to Slack
 *
 * Usage:
 *   node didyouknow-slack.cjs
 *
 * Schedule via cron (e.g., 9am Mon–Fri):
 *   0 9 * * 1-5 cd /path/to/epost_agent_kit && node packages/core/hooks/notifications/didyouknow-slack.cjs
 *
 * Requires:
 *   SLACK_WEBHOOK_URL set in process.env, ~/.claude/.env, or .claude/.env
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { loadEnv } = require('./lib/env-loader.cjs');
const { send } = require('./lib/sender.cjs');

const TIPS_PATH = path.join(__dirname, '../../skills/didyouknow/references/tips.md');

/**
 * Parse tips from the tips.md markdown file
 * @param {string} content - File content
 * @returns {Array<{id, title, category, tags, body, example, related}>}
 */
function parseTips(content) {
  const tips = [];
  let currentCategory = '';
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Track h2 category headings
    if (line.startsWith('## ') && !line.startsWith('## Kit')) {
      currentCategory = line.slice(3).trim();
      i++;
      continue;
    }

    // Each tip starts with "### TIP-"
    if (line.startsWith('### TIP-')) {
      const match = line.match(/^### (TIP-\d+): (.+)$/);
      if (!match) { i++; continue; }

      const id = match[1];
      const title = match[2];
      i++;

      // Tags line
      let tags = [];
      if (i < lines.length && lines[i].startsWith('tags:')) {
        tags = lines[i].slice(5).trim().split(',').map(t => t.trim());
        i++;
      }

      // Skip blank line after tags
      if (i < lines.length && lines[i].trim() === '') i++;

      // Collect body lines until Example:, Related:, or ---
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
      while (bodyLines.length > 0 && bodyLines[bodyLines.length - 1].trim() === '') {
        bodyLines.pop();
      }

      // Collect example lines
      const exampleLines = [];
      if (i < lines.length && lines[i].startsWith('Example:')) {
        i++; // skip "Example:" header
        while (
          i < lines.length &&
          !lines[i].startsWith('Related:') &&
          lines[i].trim() !== '---'
        ) {
          exampleLines.push(lines[i]);
          i++;
        }
        while (exampleLines.length > 0 && exampleLines[exampleLines.length - 1].trim() === '') {
          exampleLines.pop();
        }
      }

      // Related line
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

/**
 * Day of year (1–365/366) for deterministic daily rotation
 */
function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Build Slack Block Kit payload for a tip
 * @param {Object} tip
 * @returns {Object} Slack payload
 */
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
  if (tip.related) {
    contextLines.push(`*Related:* ${tip.related}`);
  }
  contextLines.push(`\`${tip.id}\` · _${tip.category}_   |   \`/didyouknow <topic>\` to search   |   \`/didyouknow --all\` to browse`);

  blocks.push({
    type: 'context',
    elements: [
      { type: 'mrkdwn', text: contextLines.join('\n') }
    ]
  });

  return {
    text: `💡 Did You Know? — ${tip.title}`,
    blocks,
  };
}

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

  const payload = buildSlackPayload(tip);
  const result = await send('slack', env.SLACK_WEBHOOK_URL, payload);

  if (result.success) {
    console.error('[didyouknow-slack] Posted successfully');
  } else if (result.throttled) {
    console.error('[didyouknow-slack] Throttled — try again later');
    process.exit(1);
  } else {
    console.error(`[didyouknow-slack] Failed: ${result.error}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(`[didyouknow-slack] Fatal: ${err.message}`);
  process.exit(1);
});
