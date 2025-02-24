(function (doc, win) {
  // 获取文档的根元素
  const docEl = doc.documentElement;

  // 判断是否支持 orientationchange 事件，否则使用 resize 事件
  const resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';

  // 设计图的基准宽度（通常以 iPhone 6/7/8 的设计图宽度 750px 为准）
  const designWidth = 750;

  // 最大宽度限制（可选）
  const maxWidth = 1200;

  // 最小宽度限制（可选，确保字体不会过小）
  const minWidth = 375;

  // 动态计算并设置根元素的字体大小
  const recalc = () => {
    // 获取当前设备的宽度
    let clientWidth = docEl.clientWidth;

    // 如果宽度为 0，直接返回
    if (!clientWidth) return;

    // 限制最大宽度（可选）
    if (clientWidth > maxWidth) {
      clientWidth = maxWidth;
    }

    // 使用 Math.max 保证 clientWidth 至少为 minWidth
    clientWidth = Math.max(clientWidth, minWidth);

    // 计算根元素的字体大小
    const rem = clientWidth / designWidth;

    // 设置根元素的字体大小
    docEl.style.fontSize = `${rem * 100}px`; // 乘以 100 以适应常规 rem 计算

    // 设置 data-dpr 属性（用于处理高 DPR 设备）
    const dpr = win.devicePixelRatio || 1;
    docEl.setAttribute('data-dpr', dpr);
  };

  // 如果浏览器不支持 addEventListener，直接返回
  if (!doc.addEventListener) return;

  // 监听窗口大小变化事件
  win.addEventListener(resizeEvt, recalc, false);

  // 监听 DOM 加载完成事件
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
