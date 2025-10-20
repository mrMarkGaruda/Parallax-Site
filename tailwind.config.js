/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2D5016',
          secondary: '#7CB342',
          accent: '#FF6B6B',
          cream: '#F8F6F0',
          text: {
            dark: '#2C3E25',
            light: '#6B8E63',
          },
          fog: '#EEF2E6',
          charcoal: '#1F2B1A',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        accent: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        glow: '0 24px 80px rgba(45, 80, 22, 0.22)',
        glass: '0 18px 45px rgba(14, 40, 10, 0.25)',
        soft: '0 20px 50px rgba(10, 28, 8, 0.12)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(160deg, #F8F6F0 0%, #ffffff 45%, #E6F2E1 100%)',
        'pricing-gradient': 'linear-gradient(135deg, rgba(124, 179, 66, 0.08), rgba(45, 80, 22, 0.1))',
      },
      maxWidth: {
        wide: '1200px',
        content: '1100px',
      },
      spacing: {
        18: '4.5rem',
      },
      borderRadius: {
        xl: '1.5rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
      },
    },
  },
  plugins: [],
}

