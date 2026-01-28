import globals from 'globals';

import base from '../../base.mjs';
import json from '../json.mjs';
import yaml from '../yaml.mjs';

/**
 * Node.js backend ESLint configuration.
 * Includes: base + JSON + YAML + Node.js globals
 * Does NOT include: React, Storybook
 *
 * Usage:
 * ```js
 * import nodejs from '@etchteam/eslint-config/nodejs';
 * export default nodejs;
 * ```
 */
export default [
  ...base,
  ...json,
  ...yaml,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
];
