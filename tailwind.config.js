export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Red - Primary Brand (GIỮ NGUYÊN)
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ef4444',
          600: '#dc2626',  // Primary red
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        primary: {
          DEFAULT: '#dc2626', // Red for primary CTA
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Blue - Secondary for text/assets (MỚI)
        blue: {
          50: '#E6F7FC',
          100: '#CCF0F9',
          200: '#99E1F3',
          300: '#66D2ED',
          400: '#33C3E7',
          500: '#01AAD3',  // Main blue
          600: '#018AB0',
          700: '#016A8C',
          800: '#014A68',
          900: '#002A44',
        },
        secondary: {
          DEFAULT: '#01AAD3', // Blue for secondary elements
          50: '#E6F7FC',
          100: '#CCF0F9',
          200: '#99E1F3',
          300: '#66D2ED',
          400: '#33C3E7',
          500: '#01AAD3',
          600: '#018AB0',
          700: '#016A8C',
          800: '#014A68',
          900: '#002A44',
        },
        // Gray - Neutral for cards (MỚI)
        neutral: {
          50: '#F7F7F7',
          100: '#EFEFEF',
          200: '#DFDFDF',
          300: '#CFCFCF',
          400: '#BFBFBF',  // Main gray
          500: '#9F9F9F',
          600: '#7F7F7F',
          700: '#5F5F5F',
          800: '#3F3F3F',
          900: '#1F1F1F',
        },
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      fontFamily: {
        sans: [
          'Roboto',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
        ],
      },
    },
  },
  plugins: [],
};
