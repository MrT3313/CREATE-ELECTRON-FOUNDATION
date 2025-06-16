import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // Vitest configuration options
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
