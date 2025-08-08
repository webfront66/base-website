document.addEventListener('DOMContentLoaded', function () {
    // 缓存 DOM 元素
    var header = document.getElementById("header");
    var navcontent = document.getElementById("nav-content");
    var toToggle = document.querySelectorAll(".toggleColour");

    // 标记是否已经为滚动事件添加了相应的类
    var scrollpos = window.scrollY;

    function updateHeaderClass() {
        // 判断是否滚动超过10
        if (scrollpos > 10) {
            // 添加或移除类
            header.classList.add("bg-white", "shadow");
            navcontent.classList.remove("bg-gray-100");
            navcontent.classList.add("bg-white");

            // 处理颜色切换
            toToggle.forEach(el => {
                el.classList.add("text-gray-800");
                el.classList.remove("text-white", "lg:text-white");
            });
        } else {
            header.classList.remove("bg-white", "shadow");
            // 不能直接这样去做。应该要判断 
            // if (window.innerWidth >= 1024) {
            //     navcontent.classList.remove("bg-white");
            // }
           
            // navcontent.classList.remove("bg-white")
            // navcontent.classList.add("bg-gray-100");

            // 处理颜色恢复
            toToggle.forEach(el => {
                el.classList.add("lg:text-white");
                el.classList.remove("text-gray-800", "text-black");
            });
        }
    }

    // 滚动事件监听
    document.addEventListener("scroll", function () {
        var currentScrollPos = window.scrollY;
        // 只有在 scrollpos 变化时才更新
        if (currentScrollPos !== scrollpos) {
            scrollpos = currentScrollPos;
            updateHeaderClass(); // 调用更新函数
        }
    });
    window.addEventListener('resize', function () {
        if (window.innerWidth < 1024) {
            updateHeaderClass();
        }
    });

    // 初始调用，以确保在加载页面时就应用合适的类
    updateHeaderClass();
});
