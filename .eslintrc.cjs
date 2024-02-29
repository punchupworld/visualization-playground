module.exports = {
  extends: ["plugin:astro/recommended", "plugin:vue/vue3-recommended"],
  rules: {
    "vue/multi-word-component-names": "off",
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
  ],
};
