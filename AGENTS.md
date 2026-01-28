# AGENTS.md

This file provides guidance to AI Agents when working with code in this repository.

## Project Overview

This is `@etchteam/eslint-config`, a shareable ESLint configuration package used by [Etch](https://etch.co). It provides modular, composable ESLint configurations for JavaScript, TypeScript, React, Angular, Next.js, Preact, Web Components, Node.js, and NestJS projects using ESLint 9's flat config format.

## Development Commands

### Linting
```bash
# Lint the source code
npx eslint src

# Lint with auto-fix
npx eslint src --fix

# Test the config against test files (should produce errors)
npx eslint test-files/
```

### Release
```bash
# Create a new release (runs semantic-release)
npm run release
```

Note: There are no unit tests in this project. Testing is done by running ESLint against the `test-files/` directory, which should intentionally produce linting errors to verify the config rules work.

## Architecture

### Modular Config Structure

The configuration is split into composable modules:

```
src/
├── index.mjs                    # Default export (full config) + named exports
├── base.mjs                     # Core: JS, TS, security, imports, prettier
├── configs/
│   ├── json.mjs                 # JSON file linting
│   ├── yaml.mjs                 # YAML file linting
│   ├── storybook.mjs            # Storybook linting
│   ├── react.mjs                # React + jsx-a11y
│   └── environments/
│       ├── nextjs.mjs           # Next.js (base + react + Next.js rules)
│       ├── nodejs.mjs           # Node.js (base, no React)
│       ├── angular.mjs          # Angular (base + angular-eslint)
│       ├── preact.mjs           # Preact (base + react modified)
│       ├── web-components.mjs   # Lit/Web Components
│       └── nestjs.mjs           # NestJS (base + nestjs rules)
├── utils/
│   └── fixup.mjs                # Shared fixupPluginRules helper
└── types.d.ts                   # TypeScript definitions
```

### Config Composition

**Default export** (`src/index.mjs`): Backwards-compatible full config = `base + json + yaml + storybook + react`

**Named exports** for composition:
- `base`, `json`, `yaml`, `storybook`, `react` - Individual modules
- `nodejs`, `nextjs`, `preact`, `angular`, `webComponents`, `nestjs` - Self-contained environment configs

**Package.json exports map** provides direct imports:
- `@etchteam/eslint-config` - Default (full config)
- `@etchteam/eslint-config/base` - Base only
- `@etchteam/eslint-config/nextjs` - Next.js environment
- etc.

### ESLint 9 Flat Config

This config uses ESLint 9's flat config format exclusively:

- **Compatibility layer**: `src/utils/fixup.mjs` wraps plugins that don't support flat config yet (import, jsx-a11y, you-dont-need-lodash-underscore, react)
- **Native flat config plugins**: unused-imports, typescript-eslint, security, yml, storybook, json
- **Parser configuration**: TypeScript ESLint parser in `languageOptions`

### Dependencies

**Core dependencies** (always installed):
- `@eslint/compat`, `@eslint/js`, `typescript-eslint`
- `eslint-plugin-security`, `eslint-plugin-import`, `eslint-plugin-unused-imports`
- `eslint-plugin-prettier`, `eslint-config-prettier`
- `eslint-plugin-json`, `eslint-plugin-yml`, `eslint-plugin-storybook`
- `eslint-import-resolver-typescript`, `globals`

**Optional dependencies** (for environment-specific configs):
- `eslint-plugin-react`, `eslint-plugin-jsx-a11y` - React/Preact/Next.js
- `@next/eslint-plugin-next`, `eslint-plugin-react-hooks` - Next.js
- `angular-eslint` - Angular
- `eslint-plugin-lit` - Web Components
- `@darraghor/eslint-plugin-nestjs-typed` - NestJS

### Key Rules

- **Unused imports**: Enforced via `eslint-plugin-unused-imports`
- **Import ordering**: Alphabetical with newlines between groups, `@/` paths treated as parent group
- **TypeScript**: `no-explicit-any` is warning (not error), unused vars are errors
- **React**: Forbids `<b>` and `<i>` elements, enforces read-only props, no useless fragments
- **Accessibility**: Includes extended jsx-a11y rules beyond the preset
- **Security**: Uses recommended config with `detect-object-injection` disabled
- **Prettier**: Single quotes enforced, integrated via `eslint-plugin-prettier`

## Git Workflow

### Commit Messages

This repo uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint:
- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Validated by husky pre-commit hook running commitlint

### Semantic Release

- Automatic versioning and publishing via semantic-release
- Runs on push to `main` branch via `.github/workflows/publish.yml`
- Release configuration in `release.config.js`
- Generates CHANGELOG.md automatically
- Publishes to npm with provenance

### Git Hooks

Husky hooks are configured in `.husky/`:
- **pre-commit**: Runs `lint-staged` which executes `eslint --fix` on staged files matching `*.{ts,tsx,js,jsx,yml,yaml,json}`
- **commit-msg**: Validates commit messages with commitlint

Note: `HUSKY=0` environment variable disables hooks in CI.

## CI/CD

### CI Pipeline (`.github/workflows/ci.yml`)
- Runs on pull requests
- Tests against Node.js 18, 20, 22
- Lints source code with `npx eslint src`
- Validates config against `test-files/` (expects violations to prove rules work)

### Publish Pipeline (`.github/workflows/publish.yml`)
- Runs on push to `main`
- Uses semantic-release to determine version, generate changelog, and publish
- Requires `NPM_TOKEN` secret for publishing

## Test Strategy

This package uses a unique testing approach:
- `test-files/` directory contains intentionally badly-formatted code
- CI runs ESLint against these files and expects failures
- If ESLint passes on test files, the CI fails (proves rules aren't working)
- This validates that the config actually enforces the expected rules

## Mergify Configuration

Auto-merge is configured in `.github/mergify.yml` for Dependabot PRs that pass CI.
