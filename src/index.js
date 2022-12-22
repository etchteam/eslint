module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:storybook/recommended',
    'plugin:security/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  plugins: ['unused-imports'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'off',
    'import/order': ['error', {
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc'
      },
      pathGroups: [{
        pattern: '@/**',
        group: 'parent'
      }]
    }],
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true
    },
    'prettier/prettier': {
      singleQuote: true,
    },
  }
};
