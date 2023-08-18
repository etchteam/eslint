module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:storybook/recommended',
    'plugin:security/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/strict',
  ],
  plugins: ['unused-imports'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
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
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
