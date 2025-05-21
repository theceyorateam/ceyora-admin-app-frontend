/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ceyora-clay': '#D96F32',
        'palm-green': '#3B6B4E',
        'sun-gold': '#F6C145',
        'ceylon-cream': '#FFF9F4',
        'teakwood-brown': '#3E3229',
        'ocean-mist': '#77867F',
        'soft-cream': '#F9F5F0',
      },
    },
  },
  plugins: [],
};