/**
 * 初始化轮播图
 * @param {Object} options 配置选项
 * @param {string} options.trackId 轨道元素ID
 * @param {string} [options.carouselId] 轮播容器ID（用于鼠标悬停暂停）
 * @param {number} [options.duration=1500] 轮播间隔时间(毫秒)
 * @param {boolean} [options.infinite=true] 是否无缝轮播
 * @param {string} [options.dotsClass='dot'] 指示点类名
 * @param {string} [options.nextBtnId='next'] 下一张按钮ID
 * @param {string} [options.prevBtnId='prev'] 上一张按钮ID
 */
function initCarousel(options) {
    const {
        trackId,
        carouselId,
        duration = 1500,
        infinite = true,
        dotsClass = 'dot',
        nextBtnId = 'next',
        prevBtnId = 'prev'
    } = options;

    if (!trackId) {
        console.error('trackId[轨道元素ID,轮播容器里用于放图片的容器] not found');
        return
    }
    if (!carouselId) {
        console.error('carouselId[轮播容器ID] not found');
        return
    }
    const track = document.getElementById(trackId);
    if (!track) {
        console.error('track not found');
        return
    }

    const slides = track.children;
    const total = slides.length;
    if (total === 0) return;

    const width = 100;
    let index = 1; // 从真实第1张开始

    // 初始位置
    track.style.transform = `translateX(-${width}%)`;

    // 获取相关元素
    const dots = document.querySelectorAll(`.${dotsClass}`);
    const nextBtn = document.getElementById(nextBtnId);
    const prevBtn = document.getElementById(prevBtnId);
    const carousel = carouselId ? document.getElementById(carouselId) : null;

    /* 更新圆点高亮 */
    const updateDots = i => {
        if (!dots || !dots.length) return;

        dots.forEach((d, idx) => {
            const isActive = idx === (i - 1 + dots.length) % dots.length;
            d.classList.toggle('opacity-100', isActive);
            d.classList.toggle('opacity-60', !isActive);
        });
    };
    updateDots(index);

    /* 下一张 */
    const next = () => {
        if (!infinite && index >= total - 1) return;

        index++;
        if (infinite && index === total - 1) {
            index = 1;
        }

        track.style.transition = 'transform .6s ease';
        track.style.transform = `translateX(-${index * width}%)`;

        if (infinite) {
            track.addEventListener('transitionend', function handler() {
                if (index === total - 1) {
                    track.style.transition = 'none';
                    index = 1;
                    track.style.transform = `translateX(-${width}%)`;
                }
                updateDots(index);
                track.removeEventListener('transitionend', handler);
            });
        } else {
            updateDots(index);
        }
    };

    /* 上一张 */
    const prev = () => {
        if (!infinite && index <= 0) return;

        index--;
        if (infinite && index < 0) {
            index = total - 2;
        }

        track.style.transition = 'transform .6s ease';
        track.style.transform = `translateX(-${index * width}%)`;

        if (infinite) {
            track.addEventListener('transitionend', function handler() {
                if (index === 0) {
                    track.style.transition = 'none';
                    index = total - 2;
                    track.style.transform = `translateX(-${index * width}%)`;
                }
                updateDots(index);
                track.removeEventListener('transitionend', handler);
            });
        } else {
            updateDots(index);
        }
    };

    /* 跳转到指定幻灯片 */
    const go = (i) => {
        if (i < 0 || i >= total) return;
        index = i;
        track.style.transition = 'transform .6s ease';
        track.style.transform = `translateX(-${index * width}%)`;
        updateDots(index);
    };

    // 绑定事件
    if (dots && dots.length) {
        dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.index + 1)));
    }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    /* 自动轮播 */
    let timer = null;
    const startAutoPlay = () => {
        if (timer) clearInterval(timer);
        timer = setInterval(next, duration);
    };

    const stopAutoPlay = () => {
        if (timer) clearInterval(timer);
        timer = null;
    };

    startAutoPlay();

    // 鼠标悬停暂停
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
}