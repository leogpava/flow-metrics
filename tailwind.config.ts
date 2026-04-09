import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './types/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        flow: {
          bg: '#dde8f8',
          blue: '#a8c8f8',
          purple: '#c4b5f4',
          pink: '#f0c4e8',
          white: '#ffffff',
          'white-80': 'rgba(255,255,255,0.80)',
          'white-60': 'rgba(255,255,255,0.60)',
          'white-20': 'rgba(255,255,255,0.20)',
          text: '#1a1a2e',
          'text-soft': '#4a4a6a',
          'text-muted': '#7a7a9a',
          accent: '#6c63ff',
          'accent-light': '#ede9ff',
          success: '#2dd4a0',
          warning: '#f5a623',
          danger: '#f06292'
        }
      },
      fontFamily: {
        sans: ['var(--font-lexend-deca)', 'sans-serif']
      },
      boxShadow: {
        glow: '0 24px 60px rgba(76, 69, 138, 0.12)',
        glass: '0 12px 40px rgba(76, 69, 138, 0.12)'
      },
      animation: {
        particle: 'particle-burst 1s ease-out forwards',
        pulseSoft: 'pulse-soft 2s ease-in-out infinite'
      },
      keyframes: {
        'particle-burst': {
          '0%': { opacity: '0', transform: 'translate(0, 0) scale(0.4)' },
          '15%': { opacity: '1', transform: 'translate(0, 0) scale(1)' },
          '100%': { opacity: '0', transform: 'translate(var(--x), var(--y)) scale(0.2)' }
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.92' },
          '50%': { transform: 'scale(1.03)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
};

export default config;
