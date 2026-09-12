import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#2E7D32',
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
          950: '#0D3B12',
        },
        secondary: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
        },
        accent: {
          DEFAULT: '#8BC34A',
          light: '#AED581',
          dark: '#689F38',
        },
        dark: {
          DEFAULT: '#1B4332',
          deep: '#0D3B12',
          card: '#1a2e1c',
        },
        surface: {
          DEFAULT: '#F8FFF5',
          dark: '#f0f9f0',
        },
        // Glassmorphism
        glass: {
          white: 'rgba(255,255,255,0.1)',
          dark: 'rgba(0,0,0,0.15)',
          green: 'rgba(46,125,50,0.15)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        '10xl': ['10rem', { lineHeight: '1' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0,0,0,0.12)',
        'soft-xl': '0 20px 60px -15px rgba(0,0,0,0.15)',
        'green': '0 4px 20px rgba(46,125,50,0.3)',
        'green-lg': '0 8px 40px rgba(46,125,50,0.4)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
        'glass': '0 8px 32px rgba(0,0,0,0.12)',
        'glow': '0 0 20px rgba(76,175,80,0.5)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1B4332 0%, #2E7D32 50%, #4CAF50 100%)',
        'gradient-light': 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e9 50%, #f8fff5 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, #2E7D32 0px, transparent 50%), radial-gradient(at 80% 0%, #4CAF50 0px, transparent 50%), radial-gradient(at 0% 50%, #1B4332 0px, transparent 50%), radial-gradient(at 80% 50%, #8BC34A 0px, transparent 50%), radial-gradient(at 0% 100%, #2E7D32 0px, transparent 50%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(27,67,50,0.95) 0%, rgba(46,125,50,0.8) 50%, rgba(27,67,50,0.95) 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(232,245,233,0.8))',
        'gradient-dark-card': 'linear-gradient(145deg, rgba(27,67,50,0.8), rgba(13,59,18,0.9))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 8s ease infinite',
        'slide-up': 'slideUp 0.5s ease forwards',
        'slide-down': 'slideDown 0.5s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
        'leaf-fall': 'leafFall 8s linear infinite',
        'rotate-slow': 'rotate 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        leafFall: {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
};

export default config;
