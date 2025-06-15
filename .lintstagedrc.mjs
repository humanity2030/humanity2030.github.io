/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */

export default {
  "**/*.(ts|tsx)": () => "yarn lint:tsc",
  "*": ["biome check --no-errors-on-unmatched --files-ignore-unknown=true"],
};
