const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const watch = require('gulp-watch');

// 引入模板文件并处理
gulp.task('html', () => {
  return gulp.src('src/**/*.html') // 监控所有 HTML 文件
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' })) // 引入模板的标记，如 @@include('header.html')
    .pipe(gulp.dest('pages')); // 输出到 dist 文件夹
});

// 实时监控文件变化
gulp.task('watch', () => {
  gulp.watch('src/**/*.html', gulp.series('html')); // 监控所有 HTML 文件的变化，并执行 html 任务
});

// 默认任务
gulp.task('default', gulp.series('html', 'watch'));
