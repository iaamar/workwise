/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // Tailwind CSS theme configuration
  theme: {
    colors: {
      primary: {
        100: "#edf2ff",
        200: "#bac8ff",
        300: "#91a7ff",
        400: "#748ffc",
        500: "#5c7cfa",
        600: "#4c6ef5",
        700: "#4263eb",
        800: "#3b5bdb",
        900: "#364fc7",
      },
      secondary: {
        100: "#c3fae8",
        200: "#96f2d7",
        300: "#63e6be",
        400: "#38d9a9",
        500: "#20c997",
        600: "#12b886",
        700: "#0ca678",
        800: "#099268",
        900: "#087f5b",
      },
      error: {
        100: "#fff5f5",
        200: "#ffc9c9",
        300: "#ffa8a8",
        400: "#ff8787",
        500: "#ff6b6b",
        600: "#fa5252",
        700: "#f03e3e",
        800: "#e03131",
        900: "#c92a2a",
      },
      grey: {
        100: "#f1f3f5",
        200: "#e9ecef",
        300: "#dee2e6",
        400: "#ced4da",
        500: "#adb5bd",
        600: "#868e96",
        700: "#495057",
        800: "#343a40",
        900: "#212529",
      },
      dark: {
        100: "#444",
        200: "#3d3d3d",
        300: "#333",
        400: "#2d2d2d",
        500: "#222",
      },
      "success-main": "#00875A",
      "success-light": "#00a16b",
      "warn-main": "#FFAB00",
      white: "#ffffff",
      black: "#000000",
      transparent: "transparent",
      label: "#5e6c84",
      inputborder: "#0052cc",
    },
  },

  // Tailwind CSS plugins
  plugins: [
    require("tailwindcss-radix")(),
    plugin(({ addUtilities }) =>
      addUtilities({
        ".flex-center": {
          "justify-content": "center",
          "align-items": "center",
        },
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      })
    ),
  ],
};
