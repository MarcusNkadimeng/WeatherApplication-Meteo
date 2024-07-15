/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,}"],
  theme: {
    extend: {
      colors: {
        customBlue: "#001021",
        cardItemGreen: "#034748",
        newColor: "#11B5E4",
        cardItemBorder: "#1481BA",
      },
    },
  },
  plugins: [],
};
