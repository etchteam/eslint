import lit from 'eslint-plugin-lit';

import base from '../../base.mjs';
import json from '../json.mjs';
import storybook from '../storybook.mjs';
import yaml from '../yaml.mjs';

/**
 * Web Components (Lit) ESLint configuration.
 * Includes: base + JSON + YAML + Storybook + Lit rules
 *
 * Usage:
 * ```js
 * import webComponents from '@etchteam/eslint-config/web-components';
 * export default webComponents;
 * ```
 */
export default [
  ...base,
  ...json,
  ...yaml,
  ...storybook,
  lit.configs['flat/recommended'],
];
