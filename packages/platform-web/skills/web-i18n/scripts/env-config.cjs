/**
 * env-config.cjs — Read i18n config from .epost-kit.json
 *
 * Config source priority (highest wins):
 *   1. process.env  — CI / shell overrides
 *   2. .env.local   — GOOGLE_SERVICE_ACCOUNT_KEY only (not committed)
 *   3. .epost-kit.json `i18n` section — committed project defaults
 *
 * All i18n settings live in .epost-kit.json. Only the service account key
 * (a secret) belongs in .env.local.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Load the `i18n` section from .epost-kit.json in cwd.
 * Returns an empty object if the file or section is absent.
 *
 * @param {string} cwd
 * @returns {Record<string, unknown>}
 */
function loadEpostKitI18n(cwd) {
  const configPath = path.join(cwd, '.epost-kit.json');
  if (!fs.existsSync(configPath)) return {};
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return raw.i18n || {};
  } catch {
    return {};
  }
}

/**
 * Parse a .env file into a key/value map.
 * Used only to read GOOGLE_SERVICE_ACCOUNT_KEY from .env.local.
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
 * Parse localeMap — accepts string ("en:en,de_CH:de") or object ({ en: 'en' }).
 *
 * @param {string|object|undefined} raw
 * @returns {Record<string, string>}
 */
function parseLocaleMap(raw) {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  return Object.fromEntries(
    raw.split(',').map((pair) => {
      const [col, file] = pair.trim().split(':');
      return [col.trim(), file.trim()];
    })
  );
}

/**
 * Load i18n configuration.
 *
 * @param {string} [cwd] - Project root. Defaults to process.cwd()
 * @returns {object} Config object
 */
function loadConfig(cwd) {
  const projectRoot = cwd || process.cwd();
  const kit = loadEpostKitI18n(projectRoot);

  // Only read the service account key from .env.local / process.env
  const envFile = parseEnvFile(path.join(projectRoot, '.env.local'));
  const serviceAccountKeyPath =
    process.env['GOOGLE_SERVICE_ACCOUNT_KEY'] ||
    envFile['GOOGLE_SERVICE_ACCOUNT_KEY'] ||
    kit.serviceAccountKeyPath ||
    '';

  // Locales: accept array or comma-string
  const localesRaw = kit.locales;
  const locales = Array.isArray(localesRaw)
    ? localesRaw
    : (localesRaw || '').split(',').map((l) => l.trim()).filter(Boolean);

  return {
    // Required
    googleSheetId: kit.googleSheetId || '',
    messagesDir: kit.messagesDir || '',
    locales,
    serviceAccountKeyPath,

    // Sheet structure
    resultSheetTab: kit.resultSheetTab || 'Result',
    keySeparator: kit.keySeparator || '::',
    localeMap: parseLocaleMap(kit.localeMap),

    // Sheet mode
    sheetMode: kit.sheetMode || 'tabs',
    fallbackSheetTab: kit.fallbackSheetTab || 'Common',
    sheetTab: kit.sheetTab || '',
    projectColumn: kit.projectColumn || '',
    projectValue: kit.projectValue || '',
  };
}

/**
 * Validate that required config fields are present.
 * Throws with a descriptive message listing all missing fields.
 *
 * @param {object} config - From loadConfig()
 * @throws {Error} If required fields are missing
 */
function validateConfig(config) {
  const missing = [];

  if (!config.googleSheetId) missing.push('i18n.googleSheetId');
  if (!config.messagesDir) missing.push('i18n.messagesDir');
  if (!config.locales.length) missing.push('i18n.locales');
  // serviceAccountKeyPath only required for --push (write ops)

  if (config.sheetMode === 'single') {
    if (!config.sheetTab) missing.push('i18n.sheetTab');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required i18n config in .epost-kit.json:\n${missing.map((v) => `  - ${v}`).join('\n')}\n\nSet these fields in the "i18n" section of .epost-kit.json at the project root.\nHint: "messagesDir" is repo-specific — e.g. "apps/my-app/messages".`
    );
  }
}

module.exports = { loadConfig, validateConfig };
