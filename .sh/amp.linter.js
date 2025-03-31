const fs = require('fs');
const path = require('path');
const amphtmlValidator = require('amphtml-validator');

// 获取当前目录中的所有 .amp.html 文件
const getAmpHtmlFiles = (dir) => {
  return fs.readdirSync(dir).filter(file => file.endsWith('.amp.html'));
};

const directoryPath = './pages/article';  // 设置为你想要检测的目录路径
const ampHtmlFiles = [...getAmpHtmlFiles(directoryPath), './'];

// 如果没有找到任何 .amp.html 文件，退出
if (ampHtmlFiles.length === 0) {
  console.log('No .amp.html files found!');
  process.exit(1);
}

// 遍历每个 .amp.html 文件并进行 AMP 验证
amphtmlValidator.getInstance().then(validator => {
  ampHtmlFiles.forEach(file => {
    const htmlContent = fs.readFileSync(path.join(directoryPath, file), 'utf8');
    const result = validator.validateString(htmlContent);

    console.log(`Validating ${file}:`);

    if (result.status === 'PASS') {
      console.log(`${file} is a valid AMP page!`);
    } else {
      console.log(`${file} has errors:`);
      result.errors.forEach(error => {
        console.log(`- ${error.message}`);
      });
    }
    console.log('------------------------');
  });
});
