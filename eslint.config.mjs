// @ts-check
import eslint from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  sonarjs.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  eslintPluginAstro.configs.recommended,
  {
    ignores: [
      "**/build/**",
      "**/dist/**",
      "**/coverage/**",
      "scripts/**",
      ".astro/**",
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        // Browser globals for client-side code
        window: "readonly",
        document: "readonly",
        console: "readonly",
        alert: "readonly",
        confirm: "readonly",
        prompt: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true },
      ],
      "sonarjs/no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.astro"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-misused-promises": "off",
      "sonarjs/prefer-read-only-props": "off",
      // Allow more flexible typing in Astro files
      "jsx-a11y/label-has-associated-control": "off",
    },
  },
);
