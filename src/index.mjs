import base from './base.mjs';
import json from './configs/json.mjs';
import reactConfig from './configs/react.mjs';
import storybook from './configs/storybook.mjs';
import yaml from './configs/yaml.mjs';

// Named exports for composable configs
export { default as base } from './base.mjs';
export { default as json } from './configs/json.mjs';
export { default as react } from './configs/react.mjs';
export { default as storybook } from './configs/storybook.mjs';
export { default as yaml } from './configs/yaml.mjs';

/**
 * Default export - Full ESLint configuration (backwards compatible)
 * Includes: base + JSON + YAML + Storybook + React
 *
 * Usage:
 * ```js
 * import etchConfig from '@etchteam/eslint-config';
 * export default etchConfig;
 * ```
 *
 * For environment-specific or composable usage, use named exports:
 * ```js
 * import { base, react } from '@etchteam/eslint-config';
 * export default [...base, ...react];
 * ```
 *
 * Or import specific environment configs:
 * ```js
 * import nextjs from '@etchteam/eslint-config/nextjs';
 * export default nextjs;
 * ```
 */
export default [...base, ...json, ...yaml, ...storybook, ...reactConfig];
