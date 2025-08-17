/* 点击箭头 → 平滑滚动到指定位置 */
document.addEventListener('DOMContentLoaded', () => {
    const scrollHints = document.querySelectorAll('.scroll-hint');
    scrollHints.forEach(hint => {
        hint.addEventListener('click', () => {
            scrollToSection();
        });
    });
});

function scrollToSection() {
    const targetElement = document.querySelector('.target-section'); // 目标元素的类名
    const offset = 64; // 距离顶部的偏移量（可以根据需要调整）

    if (targetElement) {
        const targetPosition = targetElement.offsetHeight - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });

    }
}


function createSwiperGallery(containerSelector, thumbsSelector, options = {}) {
    // 默认配置
    const defaultOptions = {
        spaceBetween: 10,
        slidesPerView: 4,
        loop: true,
        freeMode: true,
        loopedSlides: 5,
        watchSlidesProgress: true,
    };

    // 合并用户自定义配置
    const finalOptions = { ...defaultOptions, ...options };

    // 创建缩略图 Swiper
    const galleryThumbs = new Swiper(thumbsSelector, finalOptions);

    // 创建主图 Swiper
    const galleryTop = new Swiper(containerSelector, {
        spaceBetween: 10,
        loop: true,
        loopedSlides: finalOptions.loopedSlides,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs: {
            swiper: galleryThumbs,
        },
        autoplay: {
            delay: 3000, // 自动轮播间隔时间，单位毫秒（这里是1.5秒）
            disableOnInteraction: false, // 用户操作后是否停止自动轮播，false表示不停止
        },
    });

    return {
        galleryThumbs,
        galleryTop,
    };
}

// 使用示例
function showToast(options) {
    hideLoading()
    // 删除之前存在的 Toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // 创建新的 Toast 元素
    const toast = document.createElement('div');
    toast.className = `toast fixed inset-0 flex items-center justify-center p-4 rounded-lg shadow-lg z-50`;
    toast.style.transition = 'opacity 0.5s ease-in-out';
    toast.style.opacity = '1';
    toast.style.zIndex = '99999'; // 确保 z-index 是最大的
    toast.style.pointerEvents = 'none'; // 防止用户与 Toast 交互

    // 根据 type 设置背景色和图标
    let bgClass, iconSvg;
    if (options.type === 'success') {
        bgClass = 'bg-green-100 border border-green-300 text-green-800';
        iconSvg = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
        `;
    } else if (options.type === 'error') {
        bgClass = 'bg-red-100 border border-red-300 text-red-800';
        iconSvg = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        `;
    }

    // 创建 Toast 内容
    const toastContent = document.createElement('div');
    toastContent.className = `flex items-center space-x-4 p-4 ${bgClass}`;
    toastContent.innerHTML = `
        <div class="flex-shrink-0">${iconSvg}</div>
        <div class="flex-1">
            <p class="text-sm font-medium">${options.message}</p>
        </div>
    `;
    toast.appendChild(toastContent);

    // 将 Toast 插入到 body 中
    document.body.appendChild(toast);

    // 1500 毫秒后删除 Toast
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 500); // 等待过渡动画完成
    }, 1500);
}


function fetchWithTimeout(resource, options) {
    const { timeout = 10000 } = options; // 默认超时时间为 10000 毫秒

    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => controller.abort(), timeout);
    showLoading();
    const response = fetch(resource, { ...options, signal })
        .then(response => {
            clearTimeout(timeoutId);
            hideLoading()
            return response;
        })
        .catch(error => {
            clearTimeout(timeoutId);
            hideLoading()
            if (error.name === 'AbortError') {
                throw new Error('请求超时');
            }
            throw error;
        });

    return response;
}

function showLoading(options = {}) {
    hideLoading()
    // 默认配置
    const defaults = {
        message: 'Loading...',
        type: 'info', // 可选值：'info', 'success', 'error'
    };

    // 合并用户提供的选项和默认配置
    const config = { ...defaults, ...options };

    // 删除之前存在的 Loading
    const existingLoading = document.querySelector('.loading-overlay');
    if (existingLoading) {
        existingLoading.remove();
    }

    // 创建新的 Loading 元素
    const overlay = document.createElement('div');
    overlay.className = `loading-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`;
    overlay.style.zIndex = '99998'; // 确保遮罩在最上层

    const loadingContent = document.createElement('div');
    loadingContent.className = `loading-content p-4 rounded-lg shadow-lg z-50 bg-${config.type}-100 border border-${config.type}-300 text-${config.type}-800`;
    loadingContent.style.zIndex = '99999'; // 确保内容在遮罩上方

    // 创建加载图标
    const loadingIcon = document.createElement('div');
    loadingIcon.className = 'loading-icon animate-spin';
    loadingIcon.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="4"/>
        </svg>
    `;

    // 创建消息文本
    const messageText = document.createElement('p');
    messageText.className = 'text-sm font-medium mt-2';
    messageText.textContent = config.message;

    // 将图标和消息添加到内容中
    loadingContent.appendChild(loadingIcon);
    loadingContent.appendChild(messageText);

    // 将内容添加到遮罩中
    overlay.appendChild(loadingContent);

    // 将遮罩添加到 body 中
    document.body.appendChild(overlay);
}

function hideLoading() {
    // 删除存在的 Loading
    const existingLoading = document.querySelector('.loading-overlay');
    if (existingLoading) {
        existingLoading.remove();
    }
}