/** @type {import('tailwindcss').Config} */
// Keeps brand parity with the marketing site (https://christopherlist-lab.github.io/AVLcopilot/).

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#D4FF00",
        surface: "#09090B",
        "surface-container-lowest": "#050507",
        "surface-container-low": "#111113",
        "surface-container-high": "#18181b",
        "surface-container-highest": "#27272a",
        "on-surface": "#E5E1E4",
        "on-surface-variant": "#A1A1AA",
        "outline-variant": "#27272a",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        headline: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: "0px",
        sm: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        full: "9999px",
      },
      maxWidth: {
        content: "1400px",
      },
    },
  },
  plugins: [],
};
