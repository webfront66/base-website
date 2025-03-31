const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * 计算哈希值的函数
 * 需要注意的是, 通过 node 拿到的js内容，包含了回车行 \r , amp可能为了统一，他把 \r 回车行去除了，所以，我们也需要去除。
 */
function generateCSPHash(scriptContent) {

    const normalizedContent = scriptContent.replace(/\r/g, '');

    const hash = crypto.createHash('sha384');
    const data = hash.update(normalizedContent, 'utf8');
    return (
        'sha384-' +
        data
        .digest('base64')
        .replace(/=/g, '') // 移除等号
        .replace(/\+/g, '-') // 将 + 替换为 -
        .replace(/\//g, '_') // 将 / 替换为 _
    );

}

// 提取 HTML 文件中的 <script> 标签内容
function extractScriptContentFromFile(scriptFilePath) {
    try {
        // 读取脚本文件内容
        const fileContent = fs.readFileSync(scriptFilePath, 'utf8');

        // fileContent  = fileContent.replace(/<!--[\s\S]*?-->/g, '');

        // 正则表达式匹配 <script> 标签的内容
        const scriptRegex = /<script[^>]*target="amp-script"[^>]*>([\s\S]*?)<\/script>/gi;
        // 匹配所有脚本标签，忽略注释部分
        // const scriptRegex = /<(?!\s*!--)(script[^>]*target="amp-script"[^>]*)([\s\S]*?)<\/script>/gi;

        const scriptMatches = [...fileContent.matchAll(scriptRegex)];

        // 如果找到了符合的 <script> 标签，返回第一个匹配的内容
        if (scriptMatches.length > 0) {
            return scriptMatches[0][1]; // 匹配到的第一个 <script> 标签的内容
        }
        return ''; // 如果没有找到 <script> 标签，则返回空字符串
    } catch (err) {
        console.error(`读取文件时出错：${scriptFilePath}`, err);
        return ''; // 返回空字符串，表示没有获取到内容
    }
}

// 提取并替换 HTML 文件中 <meta name="amp-script-src"> 标签的 content 属性
function extractAndReplaceMetaTagContentInHead(htmlContent, scriptFilePath) {
    const headRegex = /<head[^>]*>(.*?)<\/head>/is; // 匹配 <head> 部分的内容
    const headContentMatch = htmlContent.match(headRegex);

    if (headContentMatch) {
        const headContent = headContentMatch[1]; // 提取 <head> 内容
        const metaRegex = /<meta\s+name=["']amp-script-src["'][^>]*\s+content=["']([^"']+)["'][^>]*\s*\/?>/i;
        const metaMatch = headContent.match(metaRegex);

        if (metaMatch) {
            // 获取 script 标签的内容
            const scriptContent = extractScriptContentFromFile(scriptFilePath);

            // 如果没有提取到 <script> 标签的内容，返回原 HTML 内容
            if (!scriptContent) {
                console.error(`未找到有效的 <script> 标签内容：${scriptFilePath}`);
                return htmlContent; // 如果没有脚本内容，返回原 HTML 内容
            }

            // 清理 <script> 标签中的 JavaScript 内容
            const cleanedScriptContent = scriptContent.replace(/<script.*?>|<\/script>/gi, '');

            // 计算该内容的哈希值
            const hash = generateCSPHash(cleanedScriptContent);

            // 替换 <meta name="amp-script-src"> 标签中的 content 属性为哈希值
            const updatedHeadContent = headContent.replace(
                /<meta\s+name=["']amp-script-src["'][^>]*\s+content=["'][^"']+["'][^>]*\s*\/?>/i,
                `<meta name="amp-script-src" content="${hash}" />`
            );

            // 用更新后的 <head> 内容替换原 HTML 内容中的 <head> 部分
            const updatedHtmlContent = htmlContent.replace(headContent, updatedHeadContent);
            return updatedHtmlContent;
        }
    }

    return htmlContent; // 如果没有找到 <meta> 标签，返回原 HTML 内容
}

// 处理 HTML 文件并替换 <meta> 标签的 content 属性
function processHTMLFile(htmlFilePath) {
    try {
        // 读取 HTML 文件内容
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

        // 提取并替换 <meta> 标签的 content 属性
        const updatedHtmlContent = extractAndReplaceMetaTagContentInHead(htmlContent, htmlFilePath);

        // 将更新后的 HTML 文件保存
        fs.writeFileSync(htmlFilePath, updatedHtmlContent, 'utf8');
        console.log(`成功更新：${htmlFilePath}`);
    } catch (err) {
        console.error(`处理文件时出错：${htmlFilePath}`, err);
    }
}

// 在命令行中执行
const htmlFilePath = process.argv[2]; // 从命令行获取 HTML 文件路径
if (!htmlFilePath) {
    console.log('请提供 HTML 文件路径作为参数');
    process.exit(1);
}

processHTMLFile(htmlFilePath);