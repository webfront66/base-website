/**
 * 这里有个问题。会多次添加。
 */

const fs = require('fs');
const path = require('path');

// 定义 CSS 文件路径
const cssDir = path.join(__dirname, '../css');
const tailwindCssPath = path.join(cssDir, '../css/tailwind.min.css');
const familyCssPath = path.join(cssDir, '../css/family.css');

// 定义目标 HTML 文件路径
const targetFiles = [
    path.join(__dirname, '../index.amp.html'), // 检测 index.amp.html
    ...fs.readdirSync(path.join(__dirname, '../pages')) // 检测 pages/*.amp.html
        .filter(file => file.endsWith('.amp.html'))
        .map(file => path.join(__dirname, '../pages', file))
];

// 读取 CSS 文件内容
const tailwindCss = fs.readFileSync(tailwindCssPath, 'utf8');
const familyCss = fs.readFileSync(familyCssPath, 'utf8');
const combinedCss = tailwindCss + '\n' + familyCss; // 合并 CSS 内容

// 处理目标 HTML 文件
targetFiles.forEach(targetFilePath => {
    if (!fs.existsSync(targetFilePath)) {
        console.log(`文件 ${targetFilePath} 不存在，跳过处理。`);
        return;
    }

    // 读取 HTML 文件内容
    let htmlContent = fs.readFileSync(targetFilePath, 'utf8');

    // 检查是否存在 <style amp-custom> 标签
    const styleTagRegex = /<style[^>]*amp-custom[^>]*>([\s\S]*?)<\/style>/i;
    const styleTagMatch = htmlContent.match(styleTagRegex);

    if (styleTagMatch) {
        // 如果存在 <style amp-custom> 标签，将 CSS 内容插入到标签的最前面
        const updatedStyleContent = `<style amp-custom>${combinedCss}\n${styleTagMatch[1]}</style>`;
        htmlContent = htmlContent.replace(styleTagRegex, updatedStyleContent);
    } else {
        // 如果不存在 <style amp-custom> 标签，创建一个新的标签并插入到 <title> 标签下方
        const newStyleTag = `\n    <style amp-custom>${combinedCss}</style>`;
        htmlContent = htmlContent.replace(/(<title>[^<]*<\/title>)/i, (match) => {
            return `${match}${newStyleTag}`;
        });
    }

    // 将修改后的内容写回文件
    fs.writeFileSync(targetFilePath, htmlContent, 'utf8');
    console.log(`成功更新文件：${targetFilePath}`);
});