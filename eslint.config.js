// Flat ESLint config: TypeScript + Angular templates.
//
// No new installs allowed in this workspace: the TS parser below is a minimal
// `parseForESLint` shim composed from the pre-installed
// @typescript-eslint/{typescript-estree,scope-manager,visitor-keys} v8
// packages. Only non-type-aware rules are enabled, so no `project` service
// (and no @typescript-eslint/parser package) is required.
const tsPlugin = require('@angular-eslint/eslint-plugin');
const templatePlugin = require('@angular-eslint/eslint-plugin-template');
const templateParser = require('@angular-eslint/template-parser');
const { parse } = require('@typescript-eslint/typescript-estree');
const { analyze } = require('@typescript-eslint/scope-manager');
const { visitorKeys } = require('@typescript-eslint/visitor-keys');

const tsParser = {
  meta: { name: 'local-ts-shim', version: '1.0.0' },
  parseForESLint(code, options = {}) {
    const ast = parse(code, {
      loc: true,
      range: true,
      comment: true,
      tokens: true,
      ...options,
    });
    const scopeManager = analyze(ast, {
      sourceType: options.sourceType ?? 'module',
      ecmaVersion: options.ecmaVersion ?? 2022,
    });
    return { ast, scopeManager, visitorKeys };
  },
};

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**', 'out-tsc/**', '.angular/**'],
  },
  // TypeScript sources — @angular-eslint recommended (non-type-aware subset).
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
    plugins: { '@angular-eslint': tsPlugin },
    rules: {
      '@angular-eslint/contextual-lifecycle': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-inputs-metadata-property': 'error',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/no-outputs-metadata-property': 'error',
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error',
      '@angular-eslint/use-lifecycle-interface': 'warn',
    },
  },
  // Angular templates (external .html + inline templates extracted below).
  {
    files: ['**/*.html'],
    languageOptions: { parser: templateParser },
    plugins: { '@angular-eslint/template': templatePlugin },
    rules: {
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
    },
  },
  // Inline `template:` strings inside .ts components.
  {
    files: ['**/*.component.ts', '**/app.ts', 'src/app/shared/*.ts'],
    plugins: { '@angular-eslint/template': templatePlugin },
    processor: templatePlugin.processors['extract-inline-html'],
  },
];
