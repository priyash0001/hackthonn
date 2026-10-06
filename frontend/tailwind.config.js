/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F28C00',
          'orange-hover': '#FF9A24',
          'orange-light': '#FFF0E2',
          'orange-subtle': '#FFFCF8',
          dark: '#20202D',
          gray: '#626C78',
          'gray-light': '#F6F8FA',
          border: '#E1E5EA',
          'border-focus': '#F28C00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'saas-card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'saas-hover': '0 8px 24px rgba(242, 140, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'saas-dropdown': '0 10px 30px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'saas': '12px',
        'saas-lg': '16px',
        'saas-xl': '20px',
      }
    },
  },
  plugins: [],
}
