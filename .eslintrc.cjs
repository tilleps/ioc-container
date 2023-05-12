module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  rules: {
    "no-console": ["warn"],
    "no-unreachable": ["warn"],
    "no-unused-vars": ["warn", { args: "none" }],
    "@typescript-eslint/no-empty-function": ["off"],
    "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
  },
};
