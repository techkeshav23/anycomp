/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-dark': '#1d4ed8',
        secondary: '#64748b',
        surface: '#f8fafc',
        'navy': '#0b3a74',
        'navy-dark': '#0f172a',
        // Requirement #7: Font-Color: #222222
        gray: {
          900: '#222222', // Overriding default gray-900 to ensure strict compliance
          ...require('tailwindcss/colors').gray,
        }
      },
      fontFamily: {
        sans: ['var(--font-red-hat-display)', 'Proxima Nova', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

