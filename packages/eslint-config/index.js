import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

/**
 * @param {{ tsconfigRootDir: string }} options
 */
export function createBaseConfig({ tsconfigRootDir }) {
  return tseslint.config(
    {
      ignores: [
        "dist/**",
        "**/.next/**",
        "**/coverage/**",
        "node_modules/**",
        "playwright-report/**",
        "test-results/**",
        "**/*.config.js",
        "**/*.config.cjs",
        "**/*.config.mjs",
        "**/eslint.config.js",
        ".dependency-cruiser.cjs",
        "commitlint.config.js",
        "packages/eslint-config/**",
      ],
    },
    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    unicorn.configs["flat/recommended"],
    eslintConfigPrettier,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
      plugins: {
        "import-x": importX,
      },
      rules: {
        "unicorn/prevent-abbreviations": "off",
        "unicorn/filename-case": "off",
        "unicorn/no-null": "off",
        "unicorn/no-array-reduce": "off",
        "@typescript-eslint/consistent-type-imports": [
          "error",
          { prefer: "type-imports", fixStyle: "inline-type-imports" },
        ],
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        "import-x/no-default-export": "error",
        "import-x/no-cycle": "error",
      },
    },
    {
      files: [
        "**/*.config.{js,ts,mjs,cjs}",
        "**/eslint.config.js",
        "**/playwright.config.ts",
        "**/vitest.config.ts",
        "**/next.config.ts",
        "**/src/app/**/{page,layout,loading,error,not-found,template,default}.{ts,tsx}",
      ],
      rules: {
        "import-x/no-default-export": "off",
      },
    },
  );
}
