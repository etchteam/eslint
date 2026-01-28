import { fixupPluginRules } from '@eslint/compat';

/**
 * Wraps plugins that don't yet support ESLint 9 flat config natively.
 * This provides a centralized place to manage compatibility wrappers.
 */
export { fixupPluginRules };

/**
 * Helper to wrap multiple plugins at once
 * @param {Record<string, object>} plugins - Object mapping plugin names to plugin modules
 * @returns {Record<string, object>} - Object with wrapped plugins
 */
export function fixupPlugins(plugins) {
  return Object.fromEntries(
    Object.entries(plugins).map(([name, plugin]) => [
      name,
      fixupPluginRules(plugin),
    ]),
  );
}
