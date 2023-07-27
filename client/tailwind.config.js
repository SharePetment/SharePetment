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
        yellow: '#EAE784',
      },
    },
    keyframes: {
      fadeInUp: {
        from: { opacity: 0, transform: 'translate3d(0, 30%, 0)' },
        to: { opacity: 1, transform: 'translateZ(0)' },
      },
      smoothAppear: {
        '0%': { opacity: 0, transform: 'translateY(-5%)' },
        '50%': { opacity: 1, transform: 'translateY(0)' },
        '100%': { opacity: 0, transform: 'translateY(-5%)' },
      },
      spin: {
        from: {
          transform: 'rotate(0deg)',
        },
        to: {
          transform: 'rotate(360deg)',
        },
      },
    },
    animation: {
      fadeInUp: 'fadeInUp 0.4s ease-in-out',
      smoothAppear: 'smoothAppear 1.5s ease-in-out',
      spin: 'spin 1s linear infinite',
    },
  },
  plugins: [],
};
