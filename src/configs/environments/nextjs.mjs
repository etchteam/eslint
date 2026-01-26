import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';

import base from '../../base.mjs';
import json from '../json.mjs';
import react from '../react.mjs';
import storybook from '../storybook.mjs';
import yaml from '../yaml.mjs';

/**
 * Next.js ESLint configuration.
 * Includes: base + JSON + YAML + Storybook + React + Next.js rules
 *
 * Usage:
 * ```js
 * import nextjs from '@etchteam/eslint-config/nextjs';
 * export default nextjs;
 * ```
 */
export default [
  ...base,
  ...json,
  ...yaml,
  ...storybook,
  ...react,
  {
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactHooks.configs.recommended.rules,
      'import/no-anonymous-default-export': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
];
