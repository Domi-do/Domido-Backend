import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      js,
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [["@", "./"]],
          extensions: [".js"],
        },
      },
    },
    rules: {
      ...importPlugin.configs.recommended.rules,

      "no-unused-vars": "error",
      "no-undef": "error",
      "no-console": "off",
      "eqeqeq": ["error", "always"],
      "prefer-const": "warn",
      "require-await": "warn",
      "no-return-await": "error",
      "no-eval": "error",
      "no-implied-eval": "error",

      "import/order": [
        "warn",
        {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
        },
      ],
      "import/newline-after-import": "warn",
      "import/no-duplicates": "warn",
    },
  },
]);
