module.exports = {
  extends: ["plugin:astro/recommended", "plugin:vue/vue3-recommended"],
  rules: {
    "vue/multi-word-component-names": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
    {
      files: ["*.ts", "*.tsx", "*.d.ts"],
      extends: ["plugin:@typescript-eslint/recommended", "eslint:recommended"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/triple-slash-reference": "off",
      },
    },
  ],
};
