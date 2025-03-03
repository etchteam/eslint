module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:storybook/recommended',
    'plugin:security/recommended-legacy',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/strict',
    'plugin:json/recommended-legacy',
    'plugin:you-dont-need-lodash-underscore/compatible',
    'plugin:yml/standard',
    'plugin:yml/prettier',
  ],
  plugins: ['unused-imports'],
  parser: '@typescript-eslint/parser',
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
  },
};
