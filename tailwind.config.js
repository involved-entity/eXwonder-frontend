/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite/plugin";
import preline from 'preline/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue, js, ts, jsx, tsx}",
    "./node_modules/flowbite/**/*.js",
    './node_modules/preline/preline.js'
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          100: '#f9e5b0',
          200: '#f4d27b',
          300: '#f0c24e',
          400: '#e6b32b',
          500: '#d9a500', // Основной золотой цвет
          600: '#b88a00',
          700: '#8f6b00',
          800: '#6b4d00',
          900: '#4a3a00',
        },
      },
    },
  },
  plugins: [flowbite, preline],
};
