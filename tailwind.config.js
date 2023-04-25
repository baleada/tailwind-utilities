// @ts-check
const { plugin: utilities } = require('./lib/index.cjs')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html', 'tests/stubs/app/src/**/*.ts'],
  plugins: [
    utilities
  ]
}
