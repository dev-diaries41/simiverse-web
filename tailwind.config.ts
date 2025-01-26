import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'beige-sand': '#d2b48c',
      },
      textColor: {
        'primary': '#047857',
        // Additional colors
        'secondary': '#1e3a8a', // Blue
        'accent': '#e11d48', // Red
        'light-gray': '#d1d5db', // Light gray for text
      },
      borderColor: {
        'primary': '#047857',
        // Additional border colors
        'secondary': '#1e3a8a',
      },
      // Adding custom font family (if needed)
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  safelist: [
    'text-blue-600', 
    'text-green-600', 
    'text-purple-600', 
    'text-primary',
    'text-secondary',
    'bg-primary',
    'bg-secondary',
    'border-primary',
    'border-secondary',
  ],
  plugins: [],
}

export default config
