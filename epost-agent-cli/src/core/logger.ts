/**
 * Colored logger with verbosity control and spinner integration
 * Respects NO_COLOR and EPOST_KIT_VERBOSE environment variables
 */

import pc from 'picocolors';
import ora, { type Ora } from 'ora';

const isVerbose = process.env.EPOST_KIT_VERBOSE === 'true';
const noColor = process.env.NO_COLOR !== undefined;

export const logger = {
  info(message: string): void {
    console.log(noColor ? message : pc.blue('ℹ'), message);
  },

  success(message: string): void {
    console.log(noColor ? `✓ ${message}` : pc.green('✓'), message);
  },

  warn(message: string): void {
    console.warn(noColor ? `⚠ ${message}` : pc.yellow('⚠'), message);
  },

  error(message: string): void {
    console.error(noColor ? `✗ ${message}` : pc.red('✗'), message);
  },

  debug(message: string): void {
    if (isVerbose) {
      console.log(noColor ? `[DEBUG] ${message}` : pc.dim(`[DEBUG] ${message}`));
    }
  },

  spinner(text: string): Ora {
    return ora({
      text,
      color: noColor ? undefined : 'cyan',
      spinner: 'dots',
    });
  },
};
