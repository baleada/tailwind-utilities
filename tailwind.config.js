// @ts-check
const { plugin: utilities } = require('./lib/index.cjs')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html'],
  plugins: [
    utilities
  ]
}
