/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171512',
        panel: '#1f1c18',
        panelLight: '#2a251f',
        parchment: '#efe6d8',
        hitesh: {
          DEFAULT: '#c9762c',
          soft: '#e0a15f',
          dim: '#5a3d20',
        },
        piyush: {
          DEFAULT: '#3d7fd6',
          soft: '#7fabe8',
          dim: '#22354f',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        steam: {
          '0%, 100%': { transform: 'translateY(0) scaleX(1)', opacity: '0.5' },
          '50%': { transform: 'translateY(-6px) scaleX(1.15)', opacity: '0.9' },
        },
        blink: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        steam: 'steam 1.8s ease-in-out infinite',
        blink: 'blink 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
