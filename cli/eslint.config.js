import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'node_modules/',
      '*.config.js',
      '*.config.mjs',
      '**/package.json',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended, eslintPluginPrettierRecommended],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Add any specific ESLint rules here
      // Example: '@typescript-eslint/no-unused-vars': 'warn'
    },
  }
)
