import globals from 'globals';

import webcPlugin from '../plugins/webc-processor.mjs';

/**
 * WebC template linting configuration.
 * Provides a processor for extracting and linting inline JavaScript in .webc files.
 *
 * Usage:
 * ```js
 * import { webc } from '@etchteam/eslint-config';
 * export default [...base, ...webc];
 * ```
 */
export default [
  {
    files: ['**/*.webc'],
    processor: webcPlugin.processors.webc,
  },
  {
    files: ['**/*.webc/*.js'],
    languageOptions: {
      globals: globals.browser,
    },
  },
];
