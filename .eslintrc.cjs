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
    'no-unused-vars': 'warn',
    // "max-len": ["error", { code: 94, ignoreUrls: true }],
    'no-mixed-operators': 'off',
    'no-unexpected-multiline': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
