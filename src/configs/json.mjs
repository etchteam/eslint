import json from 'eslint-plugin-json';

/**
 * JSON file linting configuration.
 */
export default [
  {
    files: ['**/*.json'],
    ...json.configs.recommended,
  },
];
