# @etchteam/eslint

The eslint config that we use at [Etch](https://etch.co)

## Install

```bash
npm i -D eslint prettier @etchteam/eslint-config
```

## Usage

```bash
echo "module.exports = { extends: ['@etchteam'] };" > .eslintrc.js
```

### With lint-staged

#### New project

Run the following:

```bash
npm i -D husky lint-staged

echo "module.exports = { '*.{ts,tsx,js,jsx,yml,yaml,json}': 'eslint --fix' };" > lint-staged.config.js

npx husky install

npx husky set .husky/pre-commit "npx --no-install -- lint-staged"

```

#### Existing project with husky and lint staged

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
echo "module.exports = { singleQuote: true };" > prettier.config.js

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
echo "module.exports = { singleQuote: true };" > prettier.config.js
```
