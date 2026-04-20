import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier/recommended';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unusedImports from 'eslint-plugin-unused-imports';
import youDontNeedLodash from 'eslint-plugin-you-dont-need-lodash-underscore';
import tseslint from 'typescript-eslint';

import { fixupPluginRules } from './utils/fixup.mjs';

const JS_FILES = ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'];

/**
 * Catch some common sonar issues locally, this is JS/TS only and not a 1:1 mirror
 * of Sonar's web-UI Quality Profile. Everything is downgraded to 'warn' because it
 * doesn't recognise when issues have been marked as safe in the Sonar web UI.
 *
 * Rule updates:
 * - `file-header` is off because we never us a header template and it warns on every file.
 * - `sonarjs/arrow-function-convention` is off because it conflicts with prettier.
 */
const sonarConfig = {
  ...sonarjs.configs.recommended,
  files: JS_FILES,
  rules: {
    ...Object.fromEntries(
      Object.keys(sonarjs.configs.recommended.rules).map((r) => [r, 'warn']),
    ),
    'sonarjs/file-header': 'off',
    'sonarjs/arrow-function-convention': 'off',
    'sonarjs/declarations-in-global-scope': 'off',
  },
};

/**
 * Base ESLint configuration for all projects.
 * Includes: JavaScript, TypeScript, security, import ordering, prettier, and common rules.
 * Does NOT include: React, JSX accessibility, JSON, YAML, or Storybook configs.
 */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,
  sonarConfig,
  {
    files: JS_FILES,
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
      curly: 'error',
      'dot-notation': 'warn',
      'no-implicit-coercion': 'error',
      'no-restricted-globals': [
        'error',
        {
          name: 'parseInt',
          message: 'Use Number.parseInt instead.',
        },
        {
          name: 'parseFloat',
          message: 'Use Number.parseFloat instead.',
        },
      ],
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
