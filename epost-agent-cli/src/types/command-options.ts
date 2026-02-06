/**
 * Command-specific option types for Commander.js
 */

export interface GlobalOptions {
  verbose?: boolean;
  yes?: boolean;
}

export interface NewOptions extends GlobalOptions {
  kit?: string;
  dir?: string;
}

export interface InitOptions extends GlobalOptions {
  kit?: string;
  fresh?: boolean;
  dryRun?: boolean;
}

export interface DoctorOptions extends GlobalOptions {
  fix?: boolean;
  report?: boolean;
}

export interface VersionsOptions extends GlobalOptions {
  limit?: number;
  pre?: boolean;
}

export interface UpdateOptions extends GlobalOptions {
  check?: boolean;
}

export interface UninstallOptions extends GlobalOptions {
  keepCustom?: boolean;
  force?: boolean;
  dryRun?: boolean;
}
