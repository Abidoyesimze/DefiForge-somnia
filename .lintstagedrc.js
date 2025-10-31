const path = require("path");

const buildNextEslintCommand = (filenames) =>
  `cd frontend && npm run lint --fix --file ${filenames
    .map((f) => path.relative("frontend", f))
    .join(" --file ")}`;

const checkTypesNextCommand = () => "cd frontend && npm run check-types";

const buildHardhatEslintCommand = (filenames) =>
  `cd smartcontract && npm run lint-staged --fix ${filenames
    .map((f) => path.relative("smartcontract", f))
    .join(" ")}`;

module.exports = {
  "frontend/**/*.{ts,tsx}": [
    buildNextEslintCommand,
    checkTypesNextCommand,
  ],
  "smartcontract/**/*.{ts,tsx}": [buildHardhatEslintCommand],
};
