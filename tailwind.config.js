/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      zIndex: {
        max: 9999,
      },
    },
  },
  plugins: [],
};
