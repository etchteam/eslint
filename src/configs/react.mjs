import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';

import { fixupPluginRules } from '../utils/fixup.mjs';

/**
 * React and JSX accessibility linting configuration.
 */
export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
    plugins: {
      react: fixupPluginRules(react),
      'jsx-a11y': fixupPluginRules(jsxA11y),
    },
    rules: {
      'jsx-a11y/anchor-ambiguous-text': 'error',
      'jsx-a11y/no-aria-hidden-on-focusable': 'error',
      'react/forbid-elements': [
        'error',
        {
          forbid: [
            { element: 'b', message: 'Do not use HTML for styling' },
            { element: 'i', message: 'Do not use HTML for styling' },
          ],
        },
      ],
      'react/jsx-no-useless-fragment': [
        'error',
        {
          allowExpressions: true,
        },
      ],
      'react/prefer-read-only-props': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
