const js = require("@eslint/js");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");

module.exports = [
  js.configs.recommended, // Base JS rules
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

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
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
    },
  },
];
