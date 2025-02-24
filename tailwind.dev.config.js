module.exports = {
  content: [
    "./index.html",
  ],
  corePlugins: {
    preflight: true,  // 启用基础样式
  },
  safelist: [],
	purge: {
    enabled: true,
    content: ['./index.html'],
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
