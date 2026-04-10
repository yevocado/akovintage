/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./views/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ako: {
          bg:           "#FAF7F2",
          card:         "#FFFFFF",
          primary:      "#8B7355",
          primaryLight: "#C4A882",
          text:         "#3D3427",
          textLight:    "#7A6E64",
          border:       "#E8E0D5",
          accent:       "#D4B896",
          success:      "#6B8F71",
          warning:      "#C4925A",
          error:        "#B06060",
          tableHeader:  "#F7F3EE",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "Apple SD Gothic Neo", "sans-serif"],
      },
    },
  },
  plugins: [],
}
