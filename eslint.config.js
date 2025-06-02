import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  { files: ["**/*.js"], plugins: { js }, extends: ["js/recommended"] },

  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-console": "off",
      "eqeqeq": ["error", "always"],
      "prefer-const": "warn",
      "require-await": "warn",
      "no-return-await": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
    },
  },
]);
