/**
 * Command: epost-kit doctor
 * Verify installation and environment health
 */

import pc from 'picocolors';
import { runAllChecks, type CheckResult, type CheckStatus } from '../core/health-checks.js';
import { logger } from '../core/logger.js';
import type { DoctorOptions } from '../types/command-options.js';

/**
 * Get status icon and color for display
 */
function formatStatus(status: CheckStatus): string {
  switch (status) {
    case 'pass':
      return pc.green('[PASS]');
    case 'warn':
      return pc.yellow('[WARN]');
    case 'fail':
      return pc.red('[FAIL]');
  }
}

/**
 * Generate JSON report of all check results
 */
function generateReport(results: CheckResult[]): string {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      passed: results.filter((r) => r.status === 'pass').length,
      warnings: results.filter((r) => r.status === 'warn').length,
      failures: results.filter((r) => r.status === 'fail').length,
    },
    checks: results.map((r) => ({
      status: r.status,
      message: r.message,
      fixable: r.fixable,
    })),
  };

  return JSON.stringify(report, null, 2);
}

/**
 * Determine exit code based on worst result
 */
function getExitCode(results: CheckResult[]): number {
  const hasFailures = results.some((r) => r.status === 'fail');
  const hasWarnings = results.some((r) => r.status === 'warn');

  if (hasFailures) return 1; // Failure
  if (hasWarnings) return 2; // Warnings
  return 0; // All pass
}

export async function runDoctor(opts: DoctorOptions): Promise<void> {
  const cwd = process.cwd();
  const shouldFix = opts.fix ?? false;
  const shouldReport = opts.report ?? false;

  // Run all health checks
  const spinner = logger.spinner('Running health checks...');
  spinner.start();

  const results = await runAllChecks(cwd);
  spinner.stop();

  // If report mode, output JSON and exit
  if (shouldReport) {
    console.log(generateReport(results));
    process.exit(getExitCode(results));
  }

  // Display results
  console.log('');
  console.log(pc.bold('Health Check Results:'));
  console.log('');

  for (const result of results) {
    const statusText = formatStatus(result.status);
    console.log(`${statusText} ${result.message}`);
  }

  console.log('');

  // Summary
  const passed = results.filter((r) => r.status === 'pass').length;
  const warnings = results.filter((r) => r.status === 'warn').length;
  const failures = results.filter((r) => r.status === 'fail').length;

  console.log(pc.bold('Summary:'));
  console.log(`  ${pc.green('✓')} ${passed} passed`);
  if (warnings > 0) {
    console.log(`  ${pc.yellow('⚠')} ${warnings} warnings`);
  }
  if (failures > 0) {
    console.log(`  ${pc.red('✗')} ${failures} failures`);
  }
  console.log('');

  // Auto-fix if requested
  if (shouldFix) {
    const fixable = results.filter((r) => r.fixable && r.fix);

    if (fixable.length === 0) {
      logger.info('No fixable issues found.');
    } else {
      logger.info(`Attempting to fix ${fixable.length} issue(s)...`);
      console.log('');

      for (const result of fixable) {
        try {
          await result.fix!();
          logger.success(`Fixed: ${result.message}`);
        } catch (error) {
          logger.error(`Failed to fix: ${result.message}`);
          logger.debug(error instanceof Error ? error.message : String(error));
        }
      }

      console.log('');
      logger.info('Re-run doctor to verify fixes.');
    }
  } else if (results.some((r) => r.fixable)) {
    logger.info('Some issues can be auto-fixed. Run with --fix to attempt repairs.');
  }

  process.exit(getExitCode(results));
}
