// 获取系统语言
const systemLang = navigator.language.toLowerCase().replace(/[-_]/, '');
const lang = translationsLang(systemLang); // 默认为英语


// 获取当前页面路径
const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'index';

function translationsLang(lang) {
    if (lang.includes('zh')) {
        return 'zh';
    }
    if (lang.includes('en')) {
        return 'en';
    }
    if (lang.includes('ja')) {
        return 'ja';
    }
    debugger
    return lang;
}

// 从缓存中加载翻译内容
function loadTranslationsFromCache(lang, page) {
    page = page || window.location.pathname || 'index';
    return JSON.parse(sessionStorage.getItem(`translations-${lang}-${page}`));
}

// 保存翻译内容到缓存
function saveTranslationsToCache(lang, page, translations) {
    sessionStorage.setItem(`translations-${lang}-${page}`, JSON.stringify(translations));
}

// 加载翻译文件
async function loadTranslations(lang, page) {
    let translations = loadTranslationsFromCache(lang, page);
    if (!translations) {
        try {
            const response = await fetch(`./locale/${page}.${lang}.json`);
            translations = await response.json();
            saveTranslationsToCache(lang, page, translations);
        } catch (error) {
            console.error('加载翻译文件失败:', error);
        }
    }
    return translations;
}

// 应用翻译
function applyTranslations(translations) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = translations[key];
        if (element.tagName === 'IMG') {
            element.alt = value;
        } else {
            element.textContent = value;
        }
    });
}

// 初始化
(async () => {
    const translations = await loadTranslations(lang, currentPage);
    console.log('translations', translations, lang);
    if (translations) {
        applyTranslations(translations);
    }
})();


// 语言切换
const languageSelectorDom = document.getElementById('language-selector');
if (languageSelectorDom) {
    languageSelectorDom.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('language-option')) {
            const newLang = target.getAttribute('data-lang');
            loadTranslations(newLang, currentPage).then(translations => {
                if (translations) {
                    applyTranslations(translations);
                }
            });
        }
    });
}