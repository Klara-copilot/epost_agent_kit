/**
 * Centralized logging utility for the management UI
 * Provides structured logging with timestamps, log levels, and categories
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'parser' | 'loader' | 'graph' | 'api' | 'ui';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: unknown;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  /**
   * Log a message with context
   */
  private log(level: LogLevel, category: LogCategory, message: string, data?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
    };

    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output with emoji prefix
    const emoji = {
      debug: '🔍',
      info: '📘',
      warn: '⚠️',
      error: '❌',
    }[level];

    const prefix = `${emoji} [${category}]`;

    if (data !== undefined) {
      console[level === 'debug' ? 'log' : level](prefix, message, data);
    } else {
      console[level === 'debug' ? 'log' : level](prefix, message);
    }
  }

  debug(category: LogCategory, message: string, data?: unknown) {
    this.log('debug', category, message, data);
  }

  info(category: LogCategory, message: string, data?: unknown) {
    this.log('info', category, message, data);
  }

  warn(category: LogCategory, message: string, data?: unknown) {
    this.log('warn', category, message, data);
  }

  error(category: LogCategory, message: string, data?: unknown) {
    this.log('error', category, message, data);
  }

  /**
   * Get all logs (for debugging)
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level or category
   */
  getFilteredLogs(filters?: { level?: LogLevel; category?: LogCategory }): LogEntry[] {
    if (!filters) return this.getLogs();

    return this.logs.filter(log => {
      if (filters.level && log.level !== filters.level) return false;
      if (filters.category && log.category !== filters.category) return false;
      return true;
    });
  }

  /**
   * Clear all logs
   */
  clear() {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton instance
export const logger = new Logger();
