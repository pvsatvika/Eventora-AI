/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF8F4',
        canvas: '#FAF8F4',
        white: '#FFFFFF',
        charcoal: '#252B28',
        dark: '#252B28',
        muted: '#69716B',
        stoneborder: '#E8E7E1',
        border: '#E8E7E1',
        sage: {
          50: '#F4F6F4',
          100: '#E7ECE7',
          200: '#D2DBD3',
          300: '#B0C1B2',
          400: '#90A893',
          500: '#748C78', // Sage green
          600: '#607664',
          700: '#526B57', // Dark sage
          800: '#3D5041',
          900: '#2A362C',
        },
        blush: {
          50: '#FAF4F3',
          100: '#F5E7E4',
          200: '#E9C9C3', // Muted blush
          300: '#DBAAA2',
          400: '#CB8C82',
          500: '#B56E63',
          600: '#99584E',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(37, 43, 40, 0.04), 0 1px 2px -1px rgba(37, 43, 40, 0.03)',
        'card': '0 2px 8px -2px rgba(37, 43, 40, 0.05), 0 1px 3px 0 rgba(37, 43, 40, 0.03)',
        'hover': '0 8px 24px -4px rgba(37, 43, 40, 0.08), 0 2px 6px -2px rgba(37, 43, 40, 0.04)',
        'dropdown': '0 12px 32px -4px rgba(37, 43, 40, 0.12), 0 4px 12px -2px rgba(37, 43, 40, 0.06)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
