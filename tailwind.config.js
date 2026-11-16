/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: {
            DEFAULT: '#E91E63',
            hover: '#D81B60',
            dark: '#C2185B',
            light: '#FCE4EC',
            50: '#FDF2F8',
            100: '#FCE7F3',
            500: '#E91E63',
            600: '#D81B60',
            700: '#BE185D',
          },
          marigold: {
            DEFAULT: '#FFB400',
            hover: '#E5A200',
            light: '#FFF8E1',
            50: '#FFFBEB',
            100: '#FEF3C7',
            500: '#FFB400',
            600: '#E5A200',
          },
          teal: {
            DEFAULT: '#00A8A8',
            hover: '#008E8E',
            light: '#E0F2F1',
            50: '#F0FDFA',
            100: '#CCFBF1',
            500: '#00A8A8',
            600: '#008E8E',
          },
          ink: {
            DEFAULT: '#2B2B3A',
            light: '#4A4A5A',
            muted: '#6B6B7F',
            subtle: '#9A9AA8',
          },
          cream: {
            DEFAULT: '#FFF8F0',
            50: '#FFFAF5',
            100: '#FFF4E8',
            200: '#FFE8D0',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(43, 43, 58, 0.05)',
        'card': '0 4px 16px -2px rgba(43, 43, 58, 0.06), 0 2px 4px -2px rgba(43, 43, 58, 0.04)',
        'card-hover': '0 12px 28px -4px rgba(43, 43, 58, 0.1), 0 4px 10px -2px rgba(233, 30, 99, 0.08)',
        'modal': '0 24px 48px -12px rgba(43, 43, 58, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
