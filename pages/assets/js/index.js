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