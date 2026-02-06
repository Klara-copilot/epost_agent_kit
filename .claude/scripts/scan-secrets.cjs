#!/usr/bin/env node
/**
 * Secret Pattern Detector
 * Scans staged files for potential secret leaks
 * Exits with code 1 if secrets detected
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Secret detection patterns
const PATTERNS = [
  {
    name: 'API Key',
    regex: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][a-zA-Z0-9_\-]{16,}['"]/gi,
  },
  {
    name: 'AWS Key',
    regex: /AKIA[0-9A-Z]{16}/g,
  },
  {
    name: 'GitHub Token',
    regex: /gh[pousr]_[A-Za-z0-9_]{36,}/g,
  },
  {
    name: 'Generic Secret',
    regex: /(?:secret|password|passwd|pwd)\s*[:=]\s*['"][\w\-@.+]{8,100}['"]/gi,
  },
  {
    name: 'Private Key',
    regex: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g,
  },
  {
    name: 'JWT Token',
    regex: /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g,
  },
  {
    name: 'Database URL',
    regex: /(?:postgres|mysql|mongodb):\/\/[^\s'"]{10,}/gi,
  },
  {
    name: 'Bearer Token',
    regex: /bearer\s+[a-zA-Z0-9_\-\.]{20,}/gi,
  },
];

// Whitelist patterns (files to skip)
const WHITELIST = [
  /\.test\.(ts|js|tsx|jsx)$/,
  /\.spec\.(ts|js|tsx|jsx)$/,
  /__tests__\//,
  /\.example\./,
  /\.sample\./,
  /\.template\./,
  /README\.md$/i,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /pnpm-lock\.yaml$/,
];

// Safe placeholder values (ignore these)
const SAFE_PLACEHOLDERS = [
  'your-api-key',
  'your_api_key',
  'example-key',
  'placeholder',
  'secret-key-here',
  'change-me',
  'replace-this',
  'xxxxxxxx',
];

/**
 * Get staged files from git
 */
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return output.trim().split('\n').filter(Boolean);
  } catch {
    // No staged files or not a git repo
    return [];
  }
}

/**
 * Check if file should be whitelisted
 */
function isWhitelisted(filePath) {
  return WHITELIST.some((pattern) => pattern.test(filePath));
}

/**
 * Check if matched value is a safe placeholder
 */
function isSafePlaceholder(value) {
  const normalized = value.toLowerCase().replace(/['"]/g, '');
  return SAFE_PLACEHOLDERS.some((placeholder) => normalized.includes(placeholder));
}

/**
 * Scan file content for secrets
 */
function scanFile(filePath) {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const findings = [];

  for (const pattern of PATTERNS) {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);

    while ((match = regex.exec(content)) !== null) {
      const matchedValue = match[0];

      // Skip safe placeholders
      if (isSafePlaceholder(matchedValue)) continue;

      // Find line number
      const lineNumber = content.substring(0, match.index).split('\n').length;
      const lineContent = lines[lineNumber - 1]?.trim() || '';

      findings.push({
        file: filePath,
        line: lineNumber,
        type: pattern.name,
        content: lineContent.substring(0, 80), // Truncate long lines
      });
    }
  }

  return findings;
}

/**
 * Main execution
 */
function main() {
  console.log('🔐 Scanning for secrets in staged files...\n');

  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log('ℹ️  No staged files to scan');
    process.exit(0);
  }

  console.log(`📂 Scanning ${stagedFiles.length} file(s)...\n`);

  let allFindings = [];

  for (const file of stagedFiles) {
    if (isWhitelisted(file)) {
      console.log(`⚪ Skipped: ${file} (whitelisted)`);
      continue;
    }

    const findings = scanFile(file);
    if (findings.length > 0) {
      allFindings = allFindings.concat(findings);
      console.log(`🔴 ${file}: ${findings.length} potential secret(s)`);
    } else {
      console.log(`✓ ${file}: clean`);
    }
  }

  console.log('');

  if (allFindings.length > 0) {
    console.error('❌ SECRETS DETECTED\n');
    console.error('Potential secrets found in staged files:\n');

    for (const finding of allFindings) {
      console.error(`  ${finding.file}:${finding.line}`);
      console.error(`  Type: ${finding.type}`);
      console.error(`  Line: ${finding.content}`);
      console.error('');
    }

    console.error('⚠️  Action required:');
    console.error('  1. Remove secrets from code');
    console.error('  2. Use environment variables instead');
    console.error('  3. Add to .gitignore if necessary\n');

    process.exit(1);
  }

  console.log('✅ No secrets detected\n');
  process.exit(0);
}

main();
