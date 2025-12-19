import js from '@eslint/js'; 
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import parser from '@babel/eslint-parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        React: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        confirm: 'readonly',
        jest: 'readonly',
        it: 'readonly',
        console: 'readonly'
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      'no-unused-vars': ['warn', {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^(React|App)$',
      }],
      'react/react-in-jsx-scope': 'error',
      'react/prop-types': 'warn',
      'react/jsx-no-target-blank': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.test.js', '**/*.test.jsx'],
    languageOptions: {
      globals: {
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
        vi: 'readonly',
      },
    },
  },
  {
    files: ['tests/__mocks__/**/*.js'],
    languageOptions: {
      globals: {
        module: 'readonly',
        exports: 'readonly',
        require: 'readonly',
      },
    },
  },
];
