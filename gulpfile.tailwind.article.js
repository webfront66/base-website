const gulp = require('gulp');
const shell = require('gulp-shell');

// Tailwind构建任务
gulp.task('tailwind', () => {
  return gulp.src('./tailwind/input.css')
    .pipe(shell('npx tailwindcss -i ./tailwind/input.css -o ./css/tailwind.article.amp.css --config ./tailwind.article.config.js'));
});

// PostCSS优化任务
gulp.task('postcss', () => {
  return gulp.src('./css/tailwind.article.amp.css')
    .pipe(shell('npx postcss ./css/tailwind.article.amp.css -o ./css/tailwind.article.amp.css'));
});

// 默认任务，确保 tailwind -> postcss 顺序
gulp.task('default', gulp.series('tailwind', 'postcss'));
