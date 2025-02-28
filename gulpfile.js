const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const prettify = require('gulp-prettify');
const path = require('path');
const fs = require('fs'); // 使用 Node.js 的 fs 模块

const paths = {
  templates: path.resolve(__dirname, 'templates'),  // 模板文件所在路径
  src: path.resolve(__dirname, 'src')               // HTML 文件所在路径
};
// 处理模板并输出到 pages 目录，且格式化 HTML
gulp.task('html', () => {
  const basePath = path.resolve(__dirname, ''); // 'src' 为存放模板文件的目录，您可以根据需要修改
  console.log("absePath", basePath)
  return gulp.src('src/**/*.html') // 匹配 src 目录下的所有 .html 文件
    .pipe(fileInclude({
      prefix: '@@',             // 模板标记
      basepath: basePath,        // 基础路径设置为当前文件
    
    })) // 引入模板的标记，如 @@include('_header.html')
    .pipe(prettify({
      indent_size: 4,           // 缩进大小，单位为空格
      indent_char: ' ',         // 缩进字符，默认为空格
      max_preserve_newlines: 1, // 最大的保留换行数
      preserve_newlines: true,  // 保留换行
      indent_inner_html: true,  // 格式化嵌套标签
      unformatted: ['code', 'pre', 'textarea'], // 不格式化的标签
    }))
    .pipe(gulp.dest('pages'));
});


// 实时监控模板文件和其他源文件的变化
gulp.task('watch', () => {
  gulp.watch('js/**/*.js', gulp.series('html')); // 监控 src 目录下所有的 .html 文件
  // gulp.watch('css/**/*.css', gulp.series('html')); // 监控 src 目录下所有的 .html 文件
  gulp.watch('src/**/*.js', gulp.series('html')); // 监控 src 目录下所有的 .html 文件
  gulp.watch('src/**/*.ejs', gulp.series('html')); // 监控 src 目录下所有的 .html 文件
  gulp.watch('src/**/*.css', gulp.series('html')); // 监控 src 目录下所有的 .html 文件
  gulp.watch('src/**/*.tpl', gulp.series('html')); // 监控 src 目录下所有的 .html 文件
  gulp.watch('src/**/*.html', gulp.series('html')); // 监控 src 目录下所有的 .html 文件
});

// 默认任务
gulp.task('default', gulp.series('html', 'watch'));
