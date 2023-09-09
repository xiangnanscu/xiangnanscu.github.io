/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  globals: {
    document: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  env: {
    node: true,
    amd: true
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': ['warn', { ignorePattern: '^_' }],
    'prefer-const': ['error', { destructuring: 'all', ignoreReadBeforeAssign: false }],
    'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', argsIgnorePattern: '^_' }],
    // "max-len": ["error", { code: 94, ignoreUrls: true }],
    'no-mixed-operators': 'off',
    'no-unexpected-multiline': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
