import base from '../../base.mjs';
import json from '../json.mjs';
import react from '../react.mjs';
import storybook from '../storybook.mjs';
import yaml from '../yaml.mjs';

/**
 * Preact ESLint configuration.
 * Includes: base + JSON + YAML + Storybook + React (modified for Preact)
 *
 * Usage:
 * ```js
 * import preact from '@etchteam/eslint-config/preact';
 * export default preact;
 * ```
 */
export default [
  ...base,
  ...json,
  ...yaml,
  ...storybook,
  ...react,
  {
    settings: {
      react: {
        pragma: 'h',
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
];
