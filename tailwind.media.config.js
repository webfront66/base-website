module.exports = {
  content: [
    "./pages/media-accel-list/*.amp.html",
    "./src/media-accel-list/tpl/*.ejs",
    "./src/media-accel-list/*.amp.html",
    "./templates/htmlTpl/*.ejs",
    "./templates/ampTpl/*.ejs"
  ],

	safelist: [],
  theme: {
    extend: {
      screens: {
        'xs': '520px', // 480px 以下的设备
      },
      colors: {
      },
    },
  },
  plugins: [],
}
