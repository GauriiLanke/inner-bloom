/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bloom: {
          lavender: '#A78BFA',
          purple: '#7C3AED',
          pink: '#FBCFE8',
          blush: '#FCE7F3',
          mist: '#F7F2FF',
          ink: '#2B1B3A',
        },
      },
      boxShadow: {
        bloom: '0 14px 40px rgba(124,58,237,0.14)',
      },
      backgroundImage: {
        'bloom-gradient':
          'radial-gradient(900px 480px at 12% 10%, rgba(251,207,232,0.55) 0%, rgba(255,255,255,0) 60%), radial-gradient(900px 520px at 85% 20%, rgba(167,139,250,0.40) 0%, rgba(255,255,255,0) 62%), linear-gradient(180deg, #FFFFFF 0%, #FAF7FF 48%, #FFFFFF 100%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(167,139,250,0.22) 0%, rgba(251,207,232,0.28) 55%, rgba(255,255,255,0.9) 100%)',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        floaty: 'floaty 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

