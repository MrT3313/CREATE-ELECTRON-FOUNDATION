import rootConfig from '../prettier.config.mjs'

/** @type {import("prettier").Config} */
const config = {
  ...rootConfig,
  // Add any CLI-specific overrides here
}

export default config
