/**
 * env-config.cjs — Read and validate I18N_* env vars
 *
 * Reads from .env.local in cwd (or provided path), then falls back to process.env.
 * Returns a typed config object for all i18n settings.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Parse a .env file into a key/value map.
 * Handles quoted values, ignores comments and blank lines.
 *
 * @param {string} filePath
 * @returns {Record<string, string>}
 */
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const result = {};

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

/**
 * Load I18N_* configuration from .env.local (or provided path) + process.env.
 *
 * @param {string} [envPath] - Path to env file. Defaults to cwd/.env.local
 * @returns {object} Merged config with I18N_* values
 */
function loadConfig(envPath) {
  const envFile = envPath || path.join(process.cwd(), '.env.local');
  const fileVars = parseEnvFile(envFile);

  // process.env takes priority (CI / shell overrides)
  const merged = { ...fileVars, ...process.env };

  /**
   * Parse I18N_LOCALE_MAP="en:en,de:de,fr:fr,it:it"
   * → { en: 'en', de: 'de', fr: 'fr', it: 'it' }
   */
  function parseLocaleMap(raw) {
    if (!raw) return {};
    return Object.fromEntries(
      raw.split(',').map((pair) => {
        const [col, file] = pair.trim().split(':');
        return [col.trim(), file.trim()];
      })
    );
  }

  return {
    // Required
    googleSheetId: merged['I18N_GOOGLE_SHEET_ID'] || '',
    messagesDir: merged['I18N_MESSAGES_DIR'] || '',
    locales: (merged['I18N_LOCALES'] || '').split(',').map((l) => l.trim()).filter(Boolean),
    serviceAccountKeyPath: merged['GOOGLE_SERVICE_ACCOUNT_KEY'] || '',

    // Sheet structure
    resultSheetTab: merged['I18N_RESULT_SHEET_TAB'] || 'Result',
    keySeparator: merged['I18N_KEY_SEPARATOR'] || '::',
    localeMap: parseLocaleMap(merged['I18N_LOCALE_MAP']),

    // Sheet mode
    sheetMode: merged['I18N_SHEET_MODE'] || 'tabs',
    fallbackSheetTab: merged['I18N_FALLBACK_SHEET_TAB'] || 'Common',
    sheetTab: merged['I18N_SHEET_TAB'] || '',
    projectColumn: merged['I18N_PROJECT_COLUMN'] || '',
    projectValue: merged['I18N_PROJECT_VALUE'] || '',
  };
}

/**
 * Validate that required config fields are present.
 * Throws with a descriptive message listing all missing vars.
 *
 * @param {object} config - From loadConfig()
 * @throws {Error} If required vars are missing
 */
function validateConfig(config) {
  const missing = [];

  if (!config.googleSheetId) missing.push('I18N_GOOGLE_SHEET_ID');
  if (!config.messagesDir) missing.push('I18N_MESSAGES_DIR');
  if (!config.locales.length) missing.push('I18N_LOCALES');
  if (!config.serviceAccountKeyPath) missing.push('GOOGLE_SERVICE_ACCOUNT_KEY');

  if (config.sheetMode === 'single') {
    if (!config.sheetTab) missing.push('I18N_SHEET_TAB');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required i18n config vars:\n${missing.map((v) => `  - ${v}`).join('\n')}\n\nSet these in .env.local or as environment variables.`
    );
  }
}

module.exports = { loadConfig, validateConfig };
