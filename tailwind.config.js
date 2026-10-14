/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F3EFE6',
          300: '#E8E2D5',
        },
        charcoal: {
          50: '#F6F6F7',
          100: '#E8E9EC',
          200: '#D1D3D8',
          400: '#757985',
          600: '#464953',
          800: '#26282E',
          900: '#17181C',
        },
        accent: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

