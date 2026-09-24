/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: '#FAFAFB',
        surface: '#FFFFFF',
        'surface-2': '#F6F6F9',
        line: '#EAEAF0',
        'line-strong': '#DCDCE6',
        ink: '#14121C',
        'ink-2': '#3F3B52',
        muted: '#6B7280',
        faint: '#9AA0AE',
        brand: {
          50: '#F6F1FE',
          100: '#EDE4FD',
          200: '#DCCBFB',
          300: '#C2A6F6',
          400: '#A47AEE',
          500: '#8B5CF6',
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4A1D93',
          900: '#3B1873',
        },
        success: { soft: '#E7F6EE', DEFAULT: '#15925A', ink: '#0B5C39' },
        warning: { soft: '#FBF0DE', DEFAULT: '#B4791A', ink: '#7A5210' },
        danger: { soft: '#FBEAEA', DEFAULT: '#C4362F', ink: '#8B231E' },
        info: { soft: '#E7F0FB', DEFAULT: '#2563A8', ink: '#194671' },
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '26px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,18,28,0.04), 0 1px 3px rgba(20,18,28,0.03)',
        raise: '0 4px 12px rgba(20,18,28,0.06), 0 2px 4px rgba(20,18,28,0.04)',
        pop: '0 12px 34px -8px rgba(56,32,120,0.22), 0 4px 12px rgba(20,18,28,0.08)',
        glow: '0 0 0 1px rgba(109,40,217,0.10), 0 18px 40px -12px rgba(109,40,217,0.30)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'draw-orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'scale-in': 'scale-in 0.28s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right': 'slide-in-right 0.32s cubic-bezier(0.16,1,0.3,1) both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
