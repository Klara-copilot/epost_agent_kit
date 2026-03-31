/**
 * tab-resolver.cjs — Resolve a translation key to a sheet tab (tabs mode)
 *
 * In "tabs" mode, each key is prefixed with its namespace (e.g., "Inbox::title").
 * The namespace maps to a sheet tab of the same name.
 * Falls back to fallbackTab if no matching tab exists.
 */

'use strict';

/**
 * Extract namespace from a flattened key.
 * "Inbox::Messages::title" → "Inbox"
 *
 * @param {string} key - Flattened key with separator
 * @param {string} separator - Key separator (e.g., '::')
 * @returns {string} First segment (namespace), or full key if no separator
 */
function extractNamespace(key, separator) {
  const idx = key.indexOf(separator);
  if (idx === -1) return key;
  return key.slice(0, idx);
}

/**
 * Resolve which sheet tab a key should be written to.
 *
 * @param {string} key - Flattened translation key
 * @param {string} separator - Key separator (e.g., '::')
 * @param {string[]} availableTabs - List of existing tab names in the sheet
 * @param {string} fallbackTab - Tab to use if namespace has no matching tab
 * @returns {string} Resolved tab name
 */
function resolveTab(key, separator, availableTabs, fallbackTab) {
  const namespace = extractNamespace(key, separator);
  if (availableTabs.includes(namespace)) {
    return namespace;
  }
  return fallbackTab;
}

module.exports = { resolveTab, extractNamespace };
