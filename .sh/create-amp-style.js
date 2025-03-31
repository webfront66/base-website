const fs = require('fs');
const path = require('path');

// 定义 CSS 文件路径
const cssDir = path.join(__dirname, '../css');
const tailwindCssPath = path.join(cssDir, 'tailwind.min.css');
const familyCssPath = path.join(cssDir, 'family.css');
const comPagePath = path.join(cssDir, 'com.page.css');

// 定义目标 HTML 文件路径
const targetFiles = [
    path.join(__dirname, '../index.amp.html'), // 检测 index.amp.html
    ...fs.readdirSync(path.join(__dirname, '../pages/down')) // 检测 pages/*.amp.html
        .filter(file => file.endsWith('.amp.html'))
        .map(file => path.join(__dirname, '../pages/down', file))
];

// 读取 CSS 文件内容
const tailwindCss = fs.readFileSync(tailwindCssPath, 'utf8');
const familyCss = fs.readFileSync(familyCssPath, 'utf8');
const comPageCss = fs.readFileSync(comPagePath, 'utf8');

// 处理目标 HTML 文件
targetFiles.forEach(targetFilePath => {
    if (!fs.existsSync(targetFilePath)) {
        console.log(`文件 ${targetFilePath} 不存在，跳过处理。`);
        return;
    }

    // 获取同名 .html 文件路径
    const htmlFilePath = targetFilePath.replace('.amp.html', '.html');
    if (!fs.existsSync(htmlFilePath)) {
        console.log(`同名 HTML 文件 ${htmlFilePath} 不存在，跳过处理。`);
        return;
    }

    // 读取同名 .html 文件内容
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

    // 提取内联样式（<style> 标签中的内容）
    const inlineStyles = [];
    const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    while ((styleMatch = styleTagRegex.exec(htmlContent)) !== null) {
        inlineStyles.push(styleMatch[1].trim()); // 提取样式内容并去除空白
    }

    // 合并所有 CSS 内容（按顺序：tailwind.css -> family.css -> 内联样式）
    const combinedCss = [tailwindCss, familyCss, comPageCss, ...inlineStyles].join('\n');

    // 读取目标 .amp.html 文件内容
    let ampHtmlContent = fs.readFileSync(targetFilePath, 'utf8');

    // 删除原有的 <style amp-custom> 标签
    ampHtmlContent = ampHtmlContent.replace(/<style[^>]*amp-custom[^>]*>[\s\S]*?<\/style>/gi, '');

    // 创建新的 <style amp-custom> 标签并插入到 <title> 标签下方
    const newStyleTag = `\n    <style amp-custom>${combinedCss}</style>`;
    ampHtmlContent = ampHtmlContent.replace(/(<title>[^<]*<\/title>)/i, (match) => {
        return `${match}${newStyleTag}`;
    });

    // 将修改后的内容写回文件
    fs.writeFileSync(targetFilePath, ampHtmlContent, 'utf8');
    console.log(`成功更新文件：${targetFilePath}`);
});