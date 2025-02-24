const fs = require('fs');
const path = require('path');

// 文件路径配置
const metaFilePath = path.join(__dirname, 'meta.html');  // 样板文件路径
const targetDir = path.join(__dirname, '../pages');  // 目标文件夹路径

// 读取样板文件(meta.html)的内容
fs.readFile(metaFilePath, 'utf8', (err, metaContent) => {
    if (err) {
        console.error('读取 meta 文件失败:', err);
        return;
    }

    // 使用正则匹配 meta 标签
    const metaTagsMatch = metaContent.match(/<meta[^>]*>/g);
    if (!metaTagsMatch) {
        console.error('在 meta.html 文件中未找到 <meta> 标签');
        return;
    }

    // 目标文件列表，包括 index.html 和 pages 文件夹中的所有 .html 文件
    const targetFiles = [
        path.join(__dirname, '../index.html'),  // 目标主页文件
    ];

    // 检查目标文件夹是否存在
    if (fs.existsSync(targetDir)) {
        // 如果目录存在，继续添加 /pages 下的所有 .html 文件
        const pageFiles = fs.readdirSync(targetDir).filter(file => file.endsWith('.html')).map(file => path.join(targetDir, file));
        targetFiles.push(...pageFiles);
    } else {
        console.log(`目标目录 ${targetDir} 不存在，跳过该目录的操作.`);
    }

    // 遍历目标文件，插入 <meta> 标签
    targetFiles.forEach((targetFilePath) => {
        // 读取目标 HTML 文件
        fs.readFile(targetFilePath, 'utf8', (err, targetHtml) => {
            if (err) {
                console.error(`读取目标文件 ${targetFilePath} 失败:`, err);
                return;
            }

            // 删除已存在的 <meta> 标签
            const cleanHtml = targetHtml.replace(/<meta[^>]*>/g, '');

            // 使用正则匹配目标文件中的 <head> 标签，并插入 <meta> 标签
            const updatedHtml = cleanHtml.replace(
                /(<head[^>]*>)/i,
                (match) => {
                    return match + '\n' + metaTagsMatch.join('\n') + '\n';
                }
            );

            // 写入修改后的目标文件
            fs.writeFile(targetFilePath, updatedHtml, 'utf8', (err) => {
                if (err) {
                    console.error(`写入目标文件 ${targetFilePath} 失败:`, err);
                } else {
                    console.log(`成功将 <meta> 标签插入到 ${targetFilePath} 的 <head> 部分`);
                }
            });
        });
    });
});
