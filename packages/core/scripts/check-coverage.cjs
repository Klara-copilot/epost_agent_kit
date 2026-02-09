#!/usr/bin/env node
/**
 * Coverage Threshold Checker
 * Enforces minimum code coverage requirements
 * Exits with code 1 if coverage is below threshold
 */

const fs = require('fs');
const path = require('path');

// Default threshold (overridable via env var)
const THRESHOLD = parseInt(process.env.COVERAGE_THRESHOLD || '80', 10);
const CORE_LOGIC_THRESHOLD = parseInt(process.env.CORE_COVERAGE_THRESHOLD || '85', 10);

/**
 * Parse LCOV format coverage file
 */
function parseLcov(content) {
  const lines = content.split('\n');
  let totalLines = 0;
  let coveredLines = 0;
  let totalFunctions = 0;
  let coveredFunctions = 0;
  let totalBranches = 0;
  let coveredBranches = 0;

  for (const line of lines) {
    if (line.startsWith('LF:')) totalLines += parseInt(line.split(':')[1], 10);
    if (line.startsWith('LH:')) coveredLines += parseInt(line.split(':')[1], 10);
    if (line.startsWith('FNF:')) totalFunctions += parseInt(line.split(':')[1], 10);
    if (line.startsWith('FNH:')) coveredFunctions += parseInt(line.split(':')[1], 10);
    if (line.startsWith('BRF:')) totalBranches += parseInt(line.split(':')[1], 10);
    if (line.startsWith('BRH:')) coveredBranches += parseInt(line.split(':')[1], 10);
  }

  return {
    lines: totalLines > 0 ? (coveredLines / totalLines) * 100 : 0,
    functions: totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0,
    branches: totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0,
  };
}

/**
 * Parse Jest/Vitest/Bun JSON coverage summary
 */
function parseJsonSummary(content) {
  const data = JSON.parse(content);

  // Bun/istanbul format (coverage-final.json)
  if (!data.total && typeof data === 'object') {
    let totalLines = 0, coveredLines = 0, totalFns = 0, coveredFns = 0, totalBranches = 0, coveredBranches = 0;

    for (const file of Object.values(data)) {
      const { s, f, b } = file;
      if (s) { totalLines += Object.keys(s).length; coveredLines += Object.values(s).filter(x => x > 0).length; }
      if (f) { totalFns += Object.keys(f).length; coveredFns += Object.values(f).filter(x => x > 0).length; }
      if (b) { totalBranches += Object.keys(b).length; coveredBranches += Object.values(b).flat().filter(x => x > 0).length; }
    }

    return {
      lines: totalLines > 0 ? (coveredLines / totalLines) * 100 : 0,
      functions: totalFns > 0 ? (coveredFns / totalFns) * 100 : 0,
      branches: totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0,
    };
  }

  // Jest/Vitest format
  const total = data.total || {};
  return {
    lines: total.lines?.pct || 0,
    functions: total.functions?.pct || 0,
    branches: total.branches?.pct || 0,
  };
}

/**
 * Find coverage report in common locations
 */
function findCoverageReport() {
  const locations = [
    'coverage/lcov.info',
    'coverage/coverage-summary.json',
    '.coverage/lcov.info',
    '.coverage/coverage-summary.json',
  ];

  for (const loc of locations) {
    const fullPath = path.join(process.cwd(), loc);
    if (fs.existsSync(fullPath)) {
      return { path: fullPath, format: loc.endsWith('.json') ? 'json' : 'lcov' };
    }
  }

  return null;
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Checking code coverage...\n');

  const report = findCoverageReport();
  if (!report) {
    console.error('❌ No coverage report found.');
    console.error('Expected: coverage/lcov.info or coverage/coverage-summary.json');
    console.error('Run tests with coverage first: npm test --coverage');
    process.exit(1);
  }

  console.log(`📊 Reading: ${report.path}`);
  const content = fs.readFileSync(report.path, 'utf-8');

  const coverage = report.format === 'json'
    ? parseJsonSummary(content)
    : parseLcov(content);

  console.log('\n📈 Coverage Results:');
  console.log(`   Lines:     ${coverage.lines.toFixed(2)}%`);
  console.log(`   Functions: ${coverage.functions.toFixed(2)}%`);
  console.log(`   Branches:  ${coverage.branches.toFixed(2)}%\n`);

  console.log(`✓ Threshold: ${THRESHOLD}%`);

  const overallCoverage = (coverage.lines + coverage.functions + coverage.branches) / 3;

  if (overallCoverage < THRESHOLD) {
    console.error(`\n❌ COVERAGE BELOW THRESHOLD`);
    console.error(`   Required: ${THRESHOLD}%`);
    console.error(`   Current:  ${overallCoverage.toFixed(2)}%`);
    console.error(`   Gap:      ${(THRESHOLD - overallCoverage).toFixed(2)}%\n`);
    process.exit(1);
  }

  if (coverage.lines < CORE_LOGIC_THRESHOLD) {
    console.warn(`\n⚠️  Warning: Line coverage below core logic threshold`);
    console.warn(`   Target:  ${CORE_LOGIC_THRESHOLD}%`);
    console.warn(`   Current: ${coverage.lines.toFixed(2)}%\n`);
  }

  console.log('✅ Coverage check passed!\n');
  process.exit(0);
}

main();
