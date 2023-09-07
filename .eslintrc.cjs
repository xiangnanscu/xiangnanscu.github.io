module.exports = {
  root: true,
  env: {
    amd: true,
    node: true
  },
  plugins: ['eslint-plugin-prettier'],
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
