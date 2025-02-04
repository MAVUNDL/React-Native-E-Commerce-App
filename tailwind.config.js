/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
         white : "#fff",
         black : "#000",
         dark : "#626262",
         primaryColor : "#1F41BB",
         gray : "#ECECEC",
         lightBlue : "#f1f4ff",
      }
    },
  },
  plugins: [],
}