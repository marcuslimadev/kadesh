/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Open Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Paleta principal Kadesh
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FCF8E8',
          100: '#F9F0D1',
          200: '#F2E0A3',
          300: '#EBD075',
          400: '#E4C047',
          500: '#D4AF37',
          600: '#B8960C',
          700: '#8A7009',
          800: '#5C4A06',
          900: '#2E2503',
        },
        graphite: {
          DEFAULT: '#1A1A1A',
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#808080',
          500: '#4D4D4D',
          600: '#333333',
          700: '#2D2D2D',
          800: '#242424',
          900: '#1A1A1A',
        },
        // Cores de status
        success: {
          DEFAULT: '#22C55E',
          50: '#F0FDF4',
          500: '#22C55E',
          600: '#16A34A',
        },
        warning: {
          DEFAULT: '#EAB308',
          50: '#FEFCE8',
          500: '#EAB308',
          600: '#CA8A04',
        },
        error: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        },
        // Aliases para compatibilidade
        primary: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#808080',
          500: '#4D4D4D',
          600: '#333333',
          700: '#2D2D2D',
          800: '#242424',
          900: '#1A1A1A',
        },
        accent: {
          50: '#FCF8E8',
          100: '#F9F0D1',
          200: '#F2E0A3',
          300: '#EBD075',
          400: '#E4C047',
          500: '#D4AF37',
          600: '#B8960C',
          700: '#8A7009',
          800: '#5C4A06',
          900: '#2E2503',
        },
      },
    },
  },
  plugins: [],
}
