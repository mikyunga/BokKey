/Users/jangseohyeon/Documents/projects/BokKey/FE/tailwind.config.js/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard'],
      },
      colors: {
        main: {
          DEFAULT: 'rgb(var(--color-main) / <alpha-value>)',
          _10: 'rgba(149, 215, 105, 0.1)',
          _30: 'rgba(149, 215, 105, 0.3)',
          selectedText: 'rgba(149, 215, 105, 0.7)',
          unselectedText: 'rgba(149, 215, 105, 0.3)',
        },
        filter: {
          DEFAULT: 'rgb(var(--color-filter) / <alpha-value>)',
        },
        star: {
          DEFAULT: 'rgb(var(--color-star) / <alpha-value>)',
        },
        black: {
          DEFAULT: 'rgb(var(--color-black) / <alpha-value>)',
          buttonStroke: 'rgba(0,0,0, 0.05)',
          buttonFill: 'rgba(149, 215, 105, 0.1)',
          _01: 'rgba(0, 0, 0, 0.01)',
          _02: 'rgba(0, 0, 0, 0.02)',
          _03: 'rgba(0, 0, 0, 0.03)',
          _04: 'rgba(0, 0, 0, 0.04)',
          _05: 'rgba(0, 0, 0, 0.05)',
          _06: 'rgba(0, 0, 0, 0.06)',
          _07: 'rgba(0, 0, 0, 0.07)',
          _10: 'rgba(0, 0, 0, 0.1)',
          _30: 'rgba(0, 0, 0, 0.3)',
          _50: 'rgba(0, 0, 0, 0.5)',
          _60: 'rgba(0, 0, 0, 0.6)',
          _70: 'rgba(0, 0, 0, 0.7)',
        },
        gray: {
          DEFAULT: 'rgb(var(--color-gray) / <alpha-value>)',
          stroke01: 'rgba(0, 0, 0, 0.01)',
          stroke02: 'rgba(0, 0, 0, 0.02)',
          stroke03: 'rgba(0, 0, 0, 0.03)',
          stroke04: 'rgba(0, 0, 0, 0.04)',
          stroke05: 'rgba(0, 0, 0, 0.05)',
          stroke07: 'rgba(0, 0, 0, 0.07)',
          stroke08: 'rgba(0, 0, 0, 0.08)',
          stroke10: 'rgba(0, 0, 0, 0.1)',
          stroke15: 'rgba(0, 0, 0, 0.15)',
          stroke20: 'rgba(0, 0, 0, 0.2)',
          stroke30: 'rgba(0, 0, 0, 0.3)',
          stroke50: 'rgba(0, 0, 0, 0.5)',
          stroke60: 'rgba(0, 0, 0, 0.6)',
          stroke70: 'rgba(0, 0, 0, 0.7)',
          dropdownBottomBorder: 'rgba(221, 221, 221, 1)',
          selectedText: 'rgba(0, 0, 0, 0.7)',
          unselectedText: 'rgba(0, 0, 0, 0.3)',
        },
        white: {
          DEFAULT: 'rgb(var(--color-white) / <alpha-value>)',
          _05: 'rgba(255,255,255,0.5)',
          _100: 'rgba(255,255,255,1)',
        },
        border: {
          DEFAULT: 'rgba(221, 221, 221, <alpha-value>)',
        },
        rederror: {
          DEFAULT: 'rgba(255,88,88,1)',
        },
        orange: {
          DEFAULT: 'rgb(var(--color-orange) / <alpha-value>)',
        },
        _80: 'rgba(255, 146, 56, 0.8)',
        _05: 'rgba(255, 146, 56, 0.05)',
      },
      boxShadow: {
        'custom-drop': '0px 0px 40px 0px rgba(0, 0, 0, 0.1)',
        card: '0px 1px 10px rgba(0, 0, 0, 0.03)',
        modal: '0px 30px 80px 0px rgba(0,0,0,0.15)',
        custom: '0px 1px 4px 0px rgba(0,0,0,0.1)',
        dropDown: '0px 0px 10px 0px rgba(0,0,0,0.03)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'opacity-pulse': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        typing: 'typing 1s steps(16) alternate, blink .4s infinite',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        modalIn: 'modalIn 0.3s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
        'opacity-pulse': 'opacity-pulse 1.2s ease-in-out infinite',
        blinkFade: 'blinkFade 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  experimental: {
    classRegex: [
      ['className="([^"]+)"', 1],
      ['className={`([^`]+)`', 1],
    ],
  },
};
