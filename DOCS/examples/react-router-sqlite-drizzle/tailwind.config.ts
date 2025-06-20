/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './extras/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-start': '#667eea',
        'primary-end': '#764ba2',
        'btn-primary': '#4caf50',
        'btn-primary-hover': '#45a049',
        error: '#c33',
        'error-bg': '#fee',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}
