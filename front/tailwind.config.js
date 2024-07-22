module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['KCC-Hanbit', 'sans-serif'],
        'custom': ['KCC-Hanbit', 'sans-serif'],
      },
      height: {
        maxHeight: '500px'
      },
      padding: {
        s: '4px',
        top: '5px'
      },
      fontSize: {
        xxs: '0.7rem'
      },
      colors: {
        'signature': '#9747ff',
      },
      animation: {
        fade: 'fadeIn 0.4s ease',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    function({ addComponents, theme }) {
      addComponents({
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#dbdbdb',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#9747ff',
            borderRadius: '12px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#ffffff',
            border: '2px solid #9747ff',
          },
        }
      });
    },
  ],
};
