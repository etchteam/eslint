import base from '../../base.mjs';
import json from '../json.mjs';
import storybook from '../storybook.mjs';
import webc from '../webc.mjs';
import yaml from '../yaml.mjs';

/**
 * WebC ESLint configuration.
 * Includes: base + JSON + YAML + Storybook + WebC processor
 *
 * Usage:
 * ```js
 * import webc from '@etchteam/eslint-config/webc';
 * export default webc;
 * ```
 */
export default [...base, ...json, ...yaml, ...storybook, ...webc];
