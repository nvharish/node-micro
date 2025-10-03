// eslint.config.js
const eslintPluginNode = require('eslint-plugin-n'); // "eslint-plugin-node" was renamed to "eslint-plugin-n"
const eslintPluginImport = require('eslint-plugin-import');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      n: eslintPluginNode,
      import: eslintPluginImport,
    },
    rules: {
      // --- Core JS rules ---
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],

      // --- Node.js specific ---
      'n/no-missing-require': 'error',
      'n/no-unsupported-features/es-syntax': 'off', // allow ES2021 syntax in Node
      'n/no-deprecated-api': 'warn',

      // --- Import rules ---
      'import/order': ['warn', {
        groups: [['builtin', 'external', 'internal']],
        'newlines-between': 'always',
      }],
    },
  },
];
