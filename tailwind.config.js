/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        inputlogin: "#E9EAEB",
        tabbar: "#FF6347",
      },
      fontFamily: {
        light: ["Quicksand-Light"],
        regular: ["Quicksand-Regular"],
        medium: ["Quicksand-Medium"],
        semibold: ["Quicksand-SemiBold"],
        bold: ["Quicksand-Bold"],
      },
    },
  },
  plugins: [],
}