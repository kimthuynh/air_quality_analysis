import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#040101',
        primary: '#3AC8FF',
        'primary-hover': '#1FA8C9',
        card: '#2D3748',
        'text-primary': '#F0F4F8',
        'text-secondary': '#A0B0C0',
      },
    },
  },
} satisfies Config;
