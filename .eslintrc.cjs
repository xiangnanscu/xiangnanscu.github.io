require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  env: {
    node: true,
    amd: true,
  },
  rules: {
    "no-constant-condition": 0,
    "no-empty": 0,
    "prettier/prettier": [
      "warn",
      {
        printWidth: 120,
      },
    ],
    "max-len": ["warn", { code: 120, ignoreComments: true, ignoreStrings: true }],
    "prefer-const": [
      "error",
      {
        destructuring: "all",
        ignoreReadBeforeAssign: false,
      },
    ],
    "vue/no-unused-vars": [
      "warn",
      {
        ignorePattern: "^_",
      },
    ],
    "no-unused-vars": ["warn", { vars: "all", args: "after-used", argsIgnorePattern: "^_" }],
    "vue/multi-word-component-names": "off",
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/eslint-config-prettier/skip-formatting"],
  parserOptions: {
    ecmaVersion: "latest",
    // parserOptions: { tsconfigRootDir: __dirname }
  },
};
