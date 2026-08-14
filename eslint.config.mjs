import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptConfig from "eslint-config-next/typescript";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "the designs and prototypes/**"] },
  ...coreWebVitals,
  ...typescriptConfig,
];

export default eslintConfig;
