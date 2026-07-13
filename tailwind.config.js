/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#5B5CEB',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#00C2FF',
          foreground: '#FFFFFF',
        },
        success: '#16C784',
        warning: '#F59E0B',
        danger: '#EF4444',
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#16181D',
        }
      },
      fontFamily: {
        sans: ['Inter Variable', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'dark-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'aurora': "linear-gradient(135deg, rgba(91,92,235,0.05) 0%, rgba(124,58,237,0.05) 50%, rgba(0,194,255,0.05) 100%)",
        'aurora-dark': "linear-gradient(135deg, rgba(91,92,235,0.1) 0%, rgba(124,58,237,0.1) 50%, rgba(0,194,255,0.1) 100%)",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
