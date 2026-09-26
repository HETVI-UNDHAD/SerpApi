/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0A0A0F 0%, #0F172A 50%, #1e1b4b 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 40%, rgba(10,10,15,0.95) 100%)',
        'card-gradient-light': 'linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.85) 100%)',
      },
      boxShadow: {
        'glow-cyan':   '0 0 40px rgba(6,182,212,0.25)',
        'glow-indigo': '0 0 40px rgba(99,102,241,0.25)',
        'glow-violet': '0 0 40px rgba(139,92,246,0.25)',
        'luxury':      '0 1px 3px rgba(15,23,42,0.04), 0 8px 24px -4px rgba(15,23,42,0.08)',
        'luxury-dark': '0 4px 24px -4px rgba(0,0,0,0.5)',
        'card-hover':  '0 20px 60px -10px rgba(15,23,42,0.15)',
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':       'float 6s ease-in-out infinite',
        'fade-up':     'fadeUp 0.6s ease-out forwards',
        'fade-in':     'fadeIn 0.4s ease-out forwards',
        'scale-in':    'scaleIn 0.3s ease-out forwards',
        'shimmer':     'shimmer 1.8s infinite',
        'spin-slow':   'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '105': '1.05',
        '108': '1.08',
      },
    },
  },
  plugins: [],
}
