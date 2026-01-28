import type { Linter } from 'eslint';

type FlatConfigArray = Linter.Config[];

/**
 * Base ESLint configuration for all projects.
 * Includes: JavaScript, TypeScript, security, import ordering, prettier, and common rules.
 */
export declare const base: FlatConfigArray;

/**
 * JSON file linting configuration.
 */
export declare const json: FlatConfigArray;

/**
 * YAML file linting configuration.
 */
export declare const yaml: FlatConfigArray;

/**
 * Storybook linting configuration.
 */
export declare const storybook: FlatConfigArray;

/**
 * React and JSX accessibility linting configuration.
 */
export declare const react: FlatConfigArray;

/**
 * Node.js backend ESLint configuration.
 * Includes: base + JSON + YAML + Node.js globals
 */
export declare const nodejs: FlatConfigArray;

/**
 * Next.js ESLint configuration.
 * Includes: base + JSON + YAML + Storybook + React + Next.js rules
 */
export declare const nextjs: FlatConfigArray;

/**
 * Preact ESLint configuration.
 * Includes: base + JSON + YAML + Storybook + React (modified for Preact)
 */
export declare const preact: FlatConfigArray;

/**
 * Angular ESLint configuration.
 * Includes: base + JSON + YAML + Storybook + Angular rules
 */
export declare const angular: FlatConfigArray;

/**
 * Web Components (Lit) ESLint configuration.
 * Includes: base + JSON + YAML + Storybook + Lit rules
 */
export declare const webComponents: FlatConfigArray;

/**
 * NestJS ESLint configuration.
 * Includes: base + JSON + YAML + NestJS rules + Node.js/Jest globals
 */
export declare const nestjs: FlatConfigArray;

/**
 * Default export - Full ESLint configuration (backwards compatible)
 * Includes: base + JSON + YAML + Storybook + React
 */
declare const config: FlatConfigArray;
export default config;
