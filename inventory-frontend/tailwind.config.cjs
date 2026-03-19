/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbff',
          100: '#d7f4ff',
          200: '#b5ebff',
          300: '#83ddff',
          400: '#48c7ff',
          500: '#1da6ff',
          600: '#0487f0',
          700: '#076bcc',
          800: '#0d58a5',
          900: '#114a86'
        }
      },
      boxShadow: {
        glow: '0 20px 45px rgba(29, 166, 255, 0.16)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(16, 185, 129, 0.18), transparent 30%), radial-gradient(circle at top right, rgba(14, 165, 233, 0.14), transparent 28%), linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(12, 18, 30, 0.98))'
      },
      fontFamily: {
        sans: ['Manrope', 'Segoe UI', 'sans-serif']
      }
    }
  },
  plugins: []
};
