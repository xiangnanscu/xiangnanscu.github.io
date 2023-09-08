module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  // https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  // plugins: ['prettier'], // seems place prettier at the last
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
  },
  globals: {
    $nuxt: true,
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        printWidth: 80,
        semi: true,
        trailingComma: "all",
        arrowParens: "yes",
        bracketSpacing: true,
        endOfLine: "lf",
        htmlWhitespaceSensitivity: "css",
        insertPragma: false,
        singleAttributePerLine: false,
        bracketSameLine: false,
        jsxBracketSameLine: false,
        jsxSingleQuote: false,
        proseWrap: "preserve",
        quoteProps: "as-needed",
        requirePragma: false,
        singleQuote: false,
        tabWidth: 2,
        useTabs: false,
        embeddedLanguageFormatting: "auto",
        vueIndentScriptAndStyle: false,
        filepath: "/root/xiangnanscu.github.io/src/main.js",
        parser: "babel",
      },
    ],
    "max-len": ["error", { code: 80, ignoreUrls: true }],
    "no-mixed-operators": "warn",
    "no-unexpected-multiline": "warn",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
};
