import nestjs from '@darraghor/eslint-plugin-nestjs-typed';
import globals from 'globals';

import base from '../../base.mjs';
import json from '../json.mjs';
import yaml from '../yaml.mjs';

/**
 * NestJS ESLint configuration.
 * Includes: base + JSON + YAML + NestJS rules + Node.js/Jest globals
 *
 * Usage:
 * ```js
 * import nestjs from '@etchteam/eslint-config/nestjs';
 * export default nestjs;
 * ```
 */
export default [
  ...base,
  ...json,
  ...yaml,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  nestjs.configs.flatRecommended,
];
