module.exports = {
  content: [
    "./pages/home/*.html",
    "./src/home/**/*.{html,ejs}",
    "./src/home/**.html",
    "./templates/htmlTpl/*.ejs",
    "./templates/ampTpl/*.ejs"
  ],

	safelist: [],
  theme: {
    extend: {
      colors: {
      },
    },
  },
  plugins: [],
}
