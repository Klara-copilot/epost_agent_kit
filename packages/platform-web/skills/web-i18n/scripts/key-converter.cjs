/**
 * key-converter.cjs — Flatten and unflatten translation key objects
 *
 * separator default: '::'
 * flatten:   { A: { B: { C: 'value' } } } → { 'A::B::C': 'value' }
 * unflatten: { 'A::B::C': 'value' }       → { A: { B: { C: 'value' } } }
 */

'use strict';

/**
 * Flatten a nested object into dot-separated keys.
 * Arrays are preserved as-is (not recursed into).
 * Null and empty-string values are kept.
 *
 * @param {object} obj
 * @param {string} [separator='::']
 * @param {string} [prefix='']
 * @returns {Record<string, string>}
 */
function flatten(obj, separator = '::', prefix = '') {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}${separator}${key}` : key;

    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      Object.assign(result, flatten(value, separator, fullKey));
    } else {
      // Preserve null, empty string, arrays, primitives
      result[fullKey] = value;
    }
  }

  return result;
}

/**
 * Unflatten dot-separated keys back into a nested object.
 *
 * @param {Record<string, string>} flat
 * @param {string} [separator='::']
 * @returns {object}
 */
function unflatten(flat, separator = '::') {
  const result = {};

  for (const [flatKey, value] of Object.entries(flat)) {
    const parts = flatKey.split(separator);
    let cursor = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (cursor[part] === undefined || typeof cursor[part] !== 'object') {
        cursor[part] = {};
      }
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
  }

  return result;
}

module.exports = { flatten, unflatten };
