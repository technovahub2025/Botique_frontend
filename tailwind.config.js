/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#faf7f3',
        cream: '#f8f4ec',
        charcoal: '#2d2d2d',
        'deep-brown': '#4a2b1f',
        burgundy: '#7a4d5c',
        gold: '#c9a66b',
        'gold-light': '#e6d3a7',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 24px rgba(45, 45, 45, 0.04)',
        'gold': '0 4px 24px rgba(201, 166, 107, 0.12)',
      },
      letterSpacing: {
        'wide': '0.04em',
        'wider': '0.06em',
      },
    },
  },
  plugins: [],
}
