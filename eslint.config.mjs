import {defineConfig} from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      js,
      prettier: prettierPlugin,
    },
    rules: {
      'no-multi-spaces': 'error',
      'no-whitespace-before-property': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'never'],
      'prettier/prettier': [
        'error',
        {
          bracketSpacing: false,
        },
      ],
    },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  tseslint.configs.recommended,
  {
    ignores: ['dist/', 'node_modules/'],
  },
]);
