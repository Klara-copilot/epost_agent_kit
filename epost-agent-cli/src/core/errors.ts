/**
 * Custom error classes for epost-kit CLI
 * Each error includes an exit code for consistent CLI behavior
 */

export class EpostKitError extends Error {
  public readonly exitCode: number;

  constructor(message: string, exitCode: number = 1) {
    super(message);
    this.name = 'EpostKitError';
    this.exitCode = exitCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConfigError extends EpostKitError {
  constructor(message: string) {
    super(message, 78); // EX_CONFIG from sysexits.h
    this.name = 'ConfigError';
  }
}

export class NetworkError extends EpostKitError {
  constructor(message: string) {
    super(message, 69); // EX_UNAVAILABLE from sysexits.h
    this.name = 'NetworkError';
  }
}

export class FileOwnershipError extends EpostKitError {
  constructor(message: string) {
    super(message, 73); // EX_CANTCREAT from sysexits.h
    this.name = 'FileOwnershipError';
  }
}

export class UserCancelledError extends EpostKitError {
  constructor(message: string = 'Operation cancelled by user') {
    super(message, 130); // SIGINT exit code
    this.name = 'UserCancelledError';
  }
}
