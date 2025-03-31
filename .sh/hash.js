const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * 计算哈希值的函数
 * 需要注意的是, 通过 node 拿到的js内容，包含了回车行 \r , amp可能为了统一，他把 \r 回车行去除了，所以，我们也需要去除。
 */
function generateCSPHash(scriptContent) {
    const normalizedContent = scriptContent.replace(/\r/g, '');
    const hash = crypto.createHash('sha384').update(normalizedContent, 'utf8');
    return 'sha384-' + hash.digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// 提取 HTML 文件中的 <script> 标签内容
function extractScriptContentFromFile(scriptFilePath) {
    try {
        const fileContent = fs.readFileSync(scriptFilePath, 'utf8');
        const scriptRegex = /<script[^>]*target="amp-script"[^>]*>([\s\S]*?)<\/script>/gi;
        const scriptMatches = [...fileContent.matchAll(scriptRegex)];
        return scriptMatches.length > 0 ? scriptMatches[0][1] : '';
    } catch (err) {
        console.error(`读取文件时出错：${scriptFilePath}`, err);
        return '';
    }
}

// 提取并替换 HTML 文件中 <meta name="amp-script-src"> 标签的 content 属性
function extractAndReplaceMetaTagContentInHead(htmlContent, scriptFilePath) {
    const headRegex = /<head[^>]*>(.*?)<\/head>/is;
    const headContentMatch = htmlContent.match(headRegex);

    if (headContentMatch) {
        const headContent = headContentMatch[1];
        const metaRegex = /<meta\s+name=["']amp-script-src["'][^>]*\s+content=["']([^"']+)["'][^>]*\s*\/?>/i;
        const metaMatch = headContent.match(metaRegex);

        if (metaMatch) {
            const scriptContent = extractScriptContentFromFile(scriptFilePath);
            if (!scriptContent) {
                console.error(`未找到有效的 <script> 标签内容：${scriptFilePath}`);
                return htmlContent;
            }

            const cleanedScriptContent = scriptContent.replace(/<script.*?>|<\/script>/gi, '');
            const hash = generateCSPHash(cleanedScriptContent);
            const updatedHeadContent = headContent.replace(
                /<meta\s+name=["']amp-script-src["'][^>]*\s+content=["'][^"']+["'][^>]*\s*\/?>/i,
                `<meta name="amp-script-src" content="${hash}" />`
            );

            return htmlContent.replace(headContent, updatedHeadContent);
        }
    }
    return htmlContent;
}

// 处理 HTML 文件并替换 <meta> 标签的 content 属性
function processHTMLFile(htmlFilePath) {
    try {
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        const updatedHtmlContent = extractAndReplaceMetaTagContentInHead(htmlContent, htmlFilePath);
        fs.writeFileSync(htmlFilePath, updatedHtmlContent, 'utf8');
        console.log(`成功更新：${htmlFilePath}`);
    } catch (err) {
        console.error(`处理文件时出错：${htmlFilePath}`, err);
    }
}

// 递归查找指定目录下的所有 *.amp.html 文件
function findAmpHtmlFiles(directory) {
    let ampHtmlFiles = [];
    const items = fs.readdirSync(directory);

    for (const item of items) {
        const fullPath = path.join(directory, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            if (item === 'src') {
                continue; // 跳过 src 目录
            }
            ampHtmlFiles = ampHtmlFiles.concat(findAmpHtmlFiles(fullPath));
        } else if (stats.isFile() && fullPath.endsWith('.amp.html')) {
            ampHtmlFiles.push(fullPath);
        }
    }
    return ampHtmlFiles;
}

// 处理所有符合条件的 .amp.html 文件
function processAllAmpHtmlFiles() {
    const baseDir = path.resolve(__dirname, '../'); // 上一级目录
    const pagesDir = path.join(baseDir, 'pages'); // pages 目录

    let ampHtmlFiles = [];
    if (fs.existsSync(baseDir)) {
        ampHtmlFiles = ampHtmlFiles.concat(findAmpHtmlFiles(baseDir));
    }
    if (fs.existsSync(pagesDir)) {
        ampHtmlFiles = ampHtmlFiles.concat(findAmpHtmlFiles(pagesDir));
    }

    if (ampHtmlFiles.length === 0) {
        console.log('未找到任何 .amp.html 文件');
        return;
    }

    console.log(`找到 ${ampHtmlFiles.length} 个 .amp.html 文件，开始处理...`);
    ampHtmlFiles.forEach(processHTMLFile);
}

// 执行主逻辑
processAllAmpHtmlFiles();
