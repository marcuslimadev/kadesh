/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de cinzas com melhor contraste
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Preto e branco puros
        black: '#000000',
        white: '#ffffff',
        // Cores semânticas (tons de cinza escuro/claro)
        primary: {
          DEFAULT: '#171717', // gray-900
          light: '#404040',   // gray-700
          dark: '#0a0a0a',    // gray-950
        },
        success: {
          DEFAULT: '#525252', // gray-600
          light: '#737373',   // gray-500
          dark: '#404040',    // gray-700
        },
        warning: {
          DEFAULT: '#737373', // gray-500
          light: '#a3a3a3',   // gray-400
          dark: '#525252',    // gray-600
        },
        danger: {
          DEFAULT: '#404040', // gray-700
          light: '#525252',   // gray-600
          dark: '#262626',    // gray-800
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
