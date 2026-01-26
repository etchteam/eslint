import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier/recommended';
import security from 'eslint-plugin-security';
import unusedImports from 'eslint-plugin-unused-imports';
import youDontNeedLodash from 'eslint-plugin-you-dont-need-lodash-underscore';
import tseslint from 'typescript-eslint';

import { fixupPluginRules } from './utils/fixup.mjs';

/**
 * Base ESLint configuration for all projects.
 * Includes: JavaScript, TypeScript, security, import ordering, prettier, and common rules.
 * Does NOT include: React, JSX accessibility, JSON, YAML, or Storybook configs.
 */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
      import: fixupPluginRules(importPlugin),
      'you-dont-need-lodash-underscore': fixupPluginRules(youDontNeedLodash),
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
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
      'security/detect-object-injection': 'off',
      'spaced-comment': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
  prettier,
];
