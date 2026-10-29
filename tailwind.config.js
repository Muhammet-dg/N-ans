/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nocturne: {
          bg: '#0A0D14',
          mesh: '#0F172A',
          surface: '#111827',
        },
        ivory: {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
        },
        amber: {
          accent: '#F59E0B',
          soft: '#FDE68A',
        },
        sage: {
          accent: '#10B981',
          soft: '#6EE7B7',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cinzel"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 25px 50px -12px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'glow-amber': '0 0 35px -5px rgba(245, 158, 11, 0.35), 0 0 0 1px rgba(253, 230, 138, 0.35)',
        'glow-sage': '0 0 35px -5px rgba(16, 185, 129, 0.35), 0 0 0 1px rgba(110, 231, 183, 0.35)',
      }
    },
  },
  plugins: [],
}

