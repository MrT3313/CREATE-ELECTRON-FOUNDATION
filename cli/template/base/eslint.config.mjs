import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'dist-electron/',
      'node_modules/',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      '**/package.json',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [...tseslint.configs.recommended, eslintPluginPrettierRecommended],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Add any specific ESLint rules here
      // Example: '@typescript-eslint/no-unused-vars': 'warn'
    },
  }
)
