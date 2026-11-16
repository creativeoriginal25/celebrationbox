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
            hover: '#F5A600',
            light: '#FFF8E1',
            50: '#FFFBEB',
            100: '#FEF3C7',
            500: '#FFB400',
            600: '#F5A600',
          },
          teal: {
            DEFAULT: '#00A8A8',
            hover: '#009494',
            light: '#E0F2F1',
            50: '#F0FDFA',
            100: '#CCFBF1',
            500: '#00A8A8',
            600: '#0D9488',
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
            100: '#FFF3E6',
            200: '#FFE7CC',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 14px 40px 0 rgba(233, 30, 99, 0.12)',
        'glass-card': '0 10px 30px -5px rgba(43, 43, 58, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.6) inset',
        'subtle': '0 4px 20px -2px rgba(43, 43, 58, 0.05)',
        'float': '0 20px 40px -15px rgba(233, 30, 99, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}

