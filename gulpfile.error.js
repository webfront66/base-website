import gulp  from 'gulp';
import fileInclude  from 'gulp-file-include';
import prettify  from 'gulp-prettify';
import path  from 'path';
import fs  from 'fs';
import replace  from 'gulp-replace';
import crypto  from 'crypto';
import shell  from 'gulp-shell';  // 引入 gulp-shell 插件
import through2  from 'through2';  // 引入 through2 插件
import { exec }  from 'child_process';  // 使用 Node.js 的 child_process.exec 方法

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// 路径配置
const paths = {
  templates: path.resolve(__dirname, '/templates'),  // 模板文件所在路径
  src: path.resolve(__dirname, '/src')               // HTML 文件所在路径
};



// 处理模板并输出到 pages 目录，且格式化 HTML
gulp.task('html', () => {
  const basePath = path.resolve(__dirname, ''); // 'src' 为存放模板文件的目录，您可以根据需要修改
  console.log("basePath", basePath);
  
  return gulp.src('/src/**/*.html') // 匹配 src 目录下的所有 .html 文件
    .pipe(fileInclude({
      prefix: '@@',             // 模板标记
      basepath: basePath,       // 基础路径设置为当前文件
    })) // 引入模板的标记，如 @@include('_header.html')
    .pipe(prettify({
      indent_size: 4,           // 缩进大小，单位为空格
      indent_char: ' ',         // 缩进字符，默认为空格
      max_preserve_newlines: 1, // 最大的保留换行数
      preserve_newlines: false,  // 保留换行
      indent_inner_html: true,  // 格式化嵌套标签
      unformatted: ['code', 'pre', 'textarea'], // 不格式化的标签
    }))
    .pipe(replace(/<!--[\s\S]*?-->/g, ''))  // **去除所有 HTML 注释**
    .pipe(replace(/\n\s*\n+/g, '\n\n'))

    .pipe(gulp.dest('pages'))
    .pipe(through2.obj(function (file, enc, cb) {
      // 获取当前文件的路径
      const filePath = file.path;
      if (!filePath.includes('.amp.html')) {
        return cb()
      }
      console.log('当前处理的文件路径:', filePath);
      // 执行 node .sh/create-script-hash.js，并传递文件路径
      exec(`node .sh/create-script-hash.js ${filePath}`, (err, stdout, stderr) => {
        if (err) {
          console.error(`执行命令失败: ${err.message}`);
          return cb(err);  // 如果命令执行失败，返回错误
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        cb();  // 命令执行完毕，回调继续
      });
    }))
    // .pipe(shell('node .sh/hash.js'))  // 在输出完成后执行 node .sh/hash.js; // 输出到 pages 目录
});

// 实时监控模板文件和其他源文件的变化
gulp.task('watch', () => {
  gulp.watch('/src/**/*.js', gulp.series('html')); // 监听 .amp.html 文件
  gulp.watch('/src/**/*.css', gulp.series('html')); // 监听 .amp.html 文件
  gulp.watch('/src/**/*.ejs', gulp.series('html')); // 监听 .amp.html 文件
  gulp.watch('/src/**/*.amp.html', gulp.series('html')); // 监听 .amp.html 文件
  gulp.watch('/src/**/*.html', gulp.series('html')); // 监听其他 HTML 文件
});

// 默认任务
gulp.task('default', gulp.series('html'));
