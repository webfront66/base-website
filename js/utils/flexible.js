(function (doc, win) {
  // 获取文档的根元素
  const docEl = doc.documentElement;

  // 判断是否支持 orientationchange 事件，否则使用 resize 事件
  const resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';

  // 设计图的基准宽度（通常以 iPhone 6/7/8 的设计图宽度 750px 为准）
  const designWidth = 750;

  const minWidth = 375;

  // 最大宽度限制（可选）
  const maxWidth = 1200;
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

    // const screenWidth  = Math.max(minWidth, clientWidth)

    // 计算根元素的字体大小
    // 将页面宽度分为 10 份，每份为 1rem
    // const rem = (clientWidth / designWidth) * 100;
    // const rem = clientWidth / 100;

    const rem = (clientWidth / designWidth) ;
    console.log("rem", rem, clientWidth)

    // 设置根元素的字体大小
    docEl.style.fontSize = `${rem}px`;

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