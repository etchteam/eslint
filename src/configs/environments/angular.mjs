import angular from 'angular-eslint';

import base from '../../base.mjs';
import json from '../json.mjs';
import storybook from '../storybook.mjs';
import yaml from '../yaml.mjs';

/**
 * Angular ESLint configuration.
 * Includes: base + JSON + YAML + Storybook + Angular rules
 *
 * Usage:
 * ```js
 * import angular from '@etchteam/eslint-config/angular';
 * export default angular;
 * ```
 */
export default [
  ...base,
  ...json,
  ...yaml,
  ...storybook,
  {
    files: ['**/*.ts'],
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
  },
];
