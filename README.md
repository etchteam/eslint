# @etchteam/eslint

The eslint config that we use at [Etch](https://etch.co)

**⚠️ Version 1.0.0+ requires ESLint 9** - See [migration guide](#migrating-from-eslint-8) below for upgrading.

## Install

```bash
npm i -D eslint@^9.0.0 prettier @etchteam/eslint-config
```

## Usage

Create an `eslint.config.js` file in your project root:

```javascript
import etchConfig from '@etchteam/eslint-config';

export default etchConfig;
```

## Environment-Specific Configs

For projects that don't need the full config, use environment-specific imports to reduce dependencies:

### Next.js

```javascript
import nextjs from '@etchteam/eslint-config/nextjs';

export default nextjs;
```

### Node.js / Express

```javascript
import nodejs from '@etchteam/eslint-config/nodejs';

export default nodejs;
```

### Angular

```javascript
import angular from '@etchteam/eslint-config/angular';

export default angular;
```

### Preact

```javascript
import preact from '@etchteam/eslint-config/preact';

export default preact;
```

### Web Components (Lit)

```javascript
import webComponents from '@etchteam/eslint-config/web-components';

export default webComponents;
```

### NestJS

```javascript
import nestjs from '@etchteam/eslint-config/nestjs';

export default nestjs;
```

## Composable Configs

Build custom configs by combining individual modules:

```javascript
import { base, json, yaml, react } from '@etchteam/eslint-config';

export default [
  ...base,
  ...json,
  ...yaml,
  ...react,
  {
    // Your custom overrides
    rules: {
      'react/prefer-read-only-props': 'warn',
    },
  },
];
```

### Available Modules

| Module | Description |
|--------|-------------|
| `base` | Core rules: JS, TypeScript, security, imports, prettier |
| `json` | JSON file linting |
| `yaml` | YAML file linting |
| `storybook` | Storybook best practices |
| `react` | React + JSX accessibility |

### Environment Configs (Self-Contained)

| Config | Includes |
|--------|----------|
| `nextjs` | base + json + yaml + storybook + react + Next.js rules |
| `nodejs` | base + json + yaml + Node.js globals |
| `angular` | base + json + yaml + storybook + Angular rules |
| `preact` | base + json + yaml + storybook + react (Preact settings) |
| `web-components` | base + json + yaml + storybook + Lit rules |
| `nestjs` | base + json + yaml + NestJS rules + Jest globals |

## With lint-staged

### New project

Run the following:

```bash
npm i -D husky lint-staged

echo "module.exports = { '*.{ts,tsx,js,jsx,yml,yaml,json}': 'eslint --fix' };" > lint-staged.config.cjs

npx husky init

echo "npx --no-install -- lint-staged" > .husky/pre-commit

```

### Existing project with husky and lint staged

Add the following to your lint-staged config:

`'*.{ts,tsx,js,jsx,yml,yaml,json}': 'eslint --fix'`

## Usage with VSCode

### New project with no VSCode config

Run the following:

```bash
mkdir .vscode

echo "{ \"editor.formatOnSave\": false, \"editor.codeActionsOnSave\": { \"source.fixAll.eslint\": \"explicit\" } }" > .vscode/settings.json

# The VSCode prettier extension doesn't read the eslint config, so specific
# prettier overrides need to go in a prettier config for format on save
echo "export default { singleQuote: true };" > prettier.config.js

```

### Exisiting project with VSCode config

Add the following to `.vscode/settings.json`:

```json
"editor.formatOnSave": false,
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": "explicit"
}
```

Run the following:

```bash
# The VSCode prettier extension doesn't read the eslint config, so specific
# prettier overrides need to go in a prettier config for format on save
echo "export default { singleQuote: true };" > prettier.config.js
```

## Migrating from ESLint 8

If you're upgrading from ESLint 8, follow these steps:

### 1. Update Dependencies

```bash
npm install eslint@^9.0.0 @etchteam/eslint-config@^1.0.0
```

### 2. Replace Configuration

Remove your old `.eslintrc.*` files and create a new `eslint.config.js`:

```javascript
import etchConfig from '@etchteam/eslint-config';

export default etchConfig;
```

### 3. Update Scripts (if needed)

ESLint 9 uses flat config by default, so your existing npm scripts should work without changes.

### What's Changed

- **Flat config format** - More explicit and performant
- **ESLint 9 compatibility** - Latest features and fixes
- **Updated plugins** - All plugins updated to latest versions
- **Modular configs** - Import only what you need for your environment
