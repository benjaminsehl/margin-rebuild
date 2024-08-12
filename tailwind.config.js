/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Tomato', 'sans-serif'],
        heading: ['ROM', 'sans-serif'],
        body: ['ROM', 'sans-serif'],
        fine: ['ROM Mono', 'monospace'],
      },
      colors: {
        foreground: 'rgb(var(--color-text) / <alpha-value>)',
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        light: 'var(--color-light)',
        dark: 'var(--color-dark)',
      },
      fontSize: {
        fine: [
          '0.625rem',
          {
            lineHeight: '0.75rem',
            fontWeight: '300',
          },
        ],
        body: [
          '1rem',
          {
            lineHeight: '1.5rem',
            fontWeight: '400',
          },
        ],
        heading: [
          '0.75rem',
          {
            lineHeight: '1rem',
            letterSpacing: '0.03em',
            fontWeight: '400',
          },
        ],
      },
      zIndex: {
        max: 9999,
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
