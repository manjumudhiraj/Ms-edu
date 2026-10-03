/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4fa',
          100: '#d9e2f0',
          200: '#b3c5e0',
          300: '#7a99c2',
          400: '#4a6b9a',
          500: '#2d4a7a',
          600: '#1e3a5f',
          700: '#162d4a',
          800: '#0f1f33',
          900: '#0a1525',
        },
        edu: {
          blue: '#2563eb',
          cyan: '#06b6d4',
          lightblue: '#38bdf8',
          green: '#16a34a',
          lightgreen: '#4ade80',
          amber: '#f59e0b',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'edu': '0 2px 8px rgba(15, 31, 51, 0.08)',
        'edu-lg': '0 8px 30px rgba(15, 31, 51, 0.12)',
        'card': '0 1px 3px rgba(15, 31, 51, 0.06), 0 1px 2px rgba(15, 31, 51, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
