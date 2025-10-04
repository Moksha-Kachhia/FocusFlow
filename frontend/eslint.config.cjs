const js = require("@eslint/js");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");

module.exports = [
  js.configs.recommended, // base JS rules
  {
    files: ["frontend/**/*.js", "frontend/**/*.jsx", "frontend/**/*.ts", "frontend/**/*.tsx"],

    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
    },

    rules: {
      "react/jsx-uses-react": "off", // Not needed in React 18+
      "react/react-in-jsx-scope": "off", // Not needed in React 18+
      "react-hooks/rules-of-hooks": "error", // Checks rules of hooks
      "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
    },
  },
];
