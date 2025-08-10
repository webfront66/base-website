document.addEventListener('DOMContentLoaded', () => {
    const DURATION = 1500 * 100;        // 2 秒轮播
    const track = document.getElementById('track');
    const slides = track.children;
    const dots = document.querySelectorAll('.dot');
    const total = slides.length;
    const width = 100;
    let index = 1;                // 从真实第 1 张开始

    /* 初始位置 */
    track.style.transform = `translateX(-${width}%)`;

    /* 更新圆点高亮 */
    const updateDots = i => {
        if (!dots && !dots.length) {
            return;
        }
        dots.forEach((d, idx) =>
            d.classList.toggle('opacity-100', idx === (i - 1 + 3) % 3) ||
            d.classList.toggle('opacity-60', idx !== (i - 1 + 3) % 3)
        );
    };
    updateDots(index);

    /* 下一张（无缝） */
    const next = () => {
        index++;
        track.style.transition = 'transform .6s ease';
        track.style.transform = `translateX(-${index * width}%)`;

        track.addEventListener('transitionend', function handler() {
            if (index === total - 1) {
                track.style.transition = 'none';
                index = 1;
                track.style.transform = `translateX(-${width}%)`;
            }
            updateDots(index);
            track.removeEventListener('transitionend', handler);
        });
    };

    /* 上一张（无缝） */
    const prev = () => {
        index--;
        track.style.transition = 'transform .6s ease';
        track.style.transform = `translateX(-${index * width}%)`;

        track.addEventListener('transitionend', function handler() {
            if (index === 0) {
                track.style.transition = 'none';
                index = total - 2;
                track.style.transform = `translateX(-${index * width}%)`;
            }
            updateDots(index);
            track.removeEventListener('transitionend', handler);
        });
    };

    /* 点击圆点/按钮 */
    dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.index + 1)));
    document.getElementById('next').addEventListener('click', next);
    document.getElementById('prev').addEventListener('click', prev);

    function go(i) {
        index = i;
        track.style.transition = 'transform .6s ease';
        track.style.transform = `translateX(-${index * width}%)`;
        updateDots(index);
    }
    /* 自动轮播 */
    function main() {
        let timer = setInterval(next, DURATION );
        const carousel = document.getElementById('carousel');
        carousel.addEventListener('mouseenter', () => clearInterval(timer));
        carousel.addEventListener('mouseleave', () => timer = setInterval(next, DURATION));
    }
    main()

})