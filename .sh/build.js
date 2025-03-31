const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const ncp = require('ncp').ncp;

// 目标目录
const outputDir = path.resolve(__dirname, '../');
const zipFileName = '蕃茄.zip';
const distDir = path.resolve(__dirname, '../dist');

// 确保目标目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 创建 dist 目录
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 创建输出文件流，用于打包成 zip 文件
const output = fs.createWriteStream(path.join(outputDir, zipFileName));

// 创建归档文件
const archive = archiver('zip', {
  zlib: { level: 9 } // 设置压缩级别
});

// 监听归档过程中的事件
archive.on('error', (err) => {
  throw err;
});

// 将输出流连接到归档流
archive.pipe(output);

// 要打包的目录或文件
const directoriesToZip = ['../pages', '../image', '../js', '../css'];

// 添加要打包的目录到 zip
directoriesToZip.forEach((dir) => {
  const dirPath = path.resolve(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    archive.directory(dirPath, path.basename(dir));  // 添加目录
  }
});

// 添加 HTML 文件（如 index.html）到 zip
const htmlFile = path.resolve(__dirname, '../index.html');
if (fs.existsSync(htmlFile)) {
  archive.file(htmlFile, { name: 'index.html' });  // 添加单个文件
}

// 完成归档
archive.finalize();

// 将目录和文件复制到 dist 目录
directoriesToZip.forEach((dir) => {
  const dirPath = path.resolve(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    ncp(dirPath, path.join(distDir, path.basename(dir)), (err) => {
      if (err) {
        return console.error(`复制 ${dir} 失败:`, err);
      }
      console.log(`成功复制 ${dir} 到 dist 目录`);
    });
  }
});

// 复制 index.html 文件到 dist
const htmlFileForDist = path.resolve(__dirname, '../index.html');
if (fs.existsSync(htmlFileForDist)) {
  fs.copyFile(htmlFileForDist, path.join(distDir, 'index.html'), (err) => {
    if (err) {
      return console.error('复制 index.html 失败:', err);
    }
    console.log('成功复制 index.html 到 dist 目录');
  });
}
