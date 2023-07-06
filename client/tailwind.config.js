/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['IBMPlexSansKR-Regular', 'Arial', 'sans-serif'],
    },
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
    keyframes: {
      fadeInUp: {
        from: { opacity: 0, transform: 'translate3d(0, 30%, 0)' },
        to: { opacity: 1, transform: 'translateZ(0)' },
      },
    },
    animation: {
      fadeInUp: 'fadeInUp 0.4s ease-in-out',
    },
  },
  plugins: [],
};
