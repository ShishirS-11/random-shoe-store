import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        'brand-purple': '#6a0dad',
        'brand-dark': '#0c0c0f',
        'brand-light': '#f1f1f1',
        'brand-gray': '#1a1a1f',
      },
    },
  },
  plugins: [],
}
export default config