import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import json from 'eslint-plugin-json';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import security from 'eslint-plugin-security';
import storybook from 'eslint-plugin-storybook';
import unusedImports from 'eslint-plugin-unused-imports';
import yml from 'eslint-plugin-yml';
import youDontNeedLodash from 'eslint-plugin-you-dont-need-lodash-underscore';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,
  ...yml.configs['flat/recommended'],
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.json'],
    ...json.configs.recommended,
  },
  {
    plugins: {
      // Plugins with native flat config support
      'unused-imports': unusedImports,

      // Plugins requiring compatibility layer
      import: fixupPluginRules(importPlugin),
      'jsx-a11y': fixupPluginRules(jsxA11y),
      'you-dont-need-lodash-underscore': fixupPluginRules(youDontNeedLodash),
      react: fixupPluginRules(react),
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // Migrate existing rules from src/index.js
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
          },
          pathGroups: [
            {
              pattern: '@/**',
              group: 'parent',
            },
          ],
        },
      ],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
        },
      ],
      'jsx-a11y/anchor-ambiguous-text': 'error',
      'jsx-a11y/no-aria-hidden-on-focusable': 'error',
      'security/detect-object-injection': 'off',
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
      'spaced-comment': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
      react: {
        version: 'detect',
      },
    },
  },
  prettier, // Prettier recommended config
];
