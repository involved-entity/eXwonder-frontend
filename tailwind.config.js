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
    extend: {},
  },
  plugins: [flowbite, preline],
};
