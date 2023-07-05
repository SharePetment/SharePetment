/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        defaultbg: '#fafafa',
        defaulttext: '#171717',
        deepgray: '#a1a1aa',
        lightgray: '#d4d4d8',
        deepgreen: '#69B783',
        lightgreen: '#CCE7C2',
        white: '#FFFFFF',
        popup: '#a1a1aa',
      },
    },
  },
  plugins: [],
};
