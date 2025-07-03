/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
colors: {
        primary: '#6B46C1',
        secondary: '#EC4899',
        accent: '#F59E0B',
        surface: '#FAFBFC',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        chart: {
          primary: '#6B46C1',
          secondary: '#EC4899',
          accent: '#F59E0B',
          neutral: '#6B7280',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
animation: {
        'streak-glow': 'streak-glow 2s ease-in-out infinite alternate',
        'swipe-trail': 'swipe-trail 0.3s ease-out',
        'pulse-reminder': 'pulse-reminder 2s ease-in-out infinite',
        'chart-fade-in': 'chart-fade-in 0.8s ease-out',
        'progress-fill': 'progress-fill 1.5s ease-out',
      },
keyframes: {
        'streak-glow': {
          '0%': { filter: 'brightness(1)' },
          '100%': { filter: 'brightness(1.2)' },
        },
        'swipe-trail': {
          '0%': { transform: 'translateX(0) scale(1)', opacity: 1 },
          '100%': { transform: 'translateX(100px) scale(0.8)', opacity: 0 },
        },
        'pulse-reminder': {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.05)', opacity: 0.8 },
        },
        'chart-fade-in': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'progress-fill': {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
      },
    },
  },
  plugins: [],
};