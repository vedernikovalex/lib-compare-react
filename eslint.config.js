import eslintPluginReact from "eslint-plugin-react";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    files: ["apps/*/src/**/*.{ts,tsx}"],
    ignores: ["**/dist/**", "**/node_modules/**"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: true,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      react: eslintPluginReact,
      "@typescript-eslint": tseslint
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      // TS pravidla:
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
];
