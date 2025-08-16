/* 点击箭头 → 平滑滚动到指定位置 */
document.addEventListener('DOMContentLoaded', () => {
    const scrollHints = document.querySelectorAll('.scroll-hint');
    scrollHints.forEach(hint => {
        hint.addEventListener('click', () => {
            console.log("333")
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
