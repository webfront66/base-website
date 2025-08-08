function changeTab() {
    const vipTabs = document.querySelectorAll('.vip-tab');

    vipTabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            vipTabs.forEach(tab => tab.classList.remove('active'));
            tab.classList.add("active")
            // 获取当前点击的 tab 的 data-target-id 属性值
            const targetId = tab.getAttribute('data-target-id');
            
            // 根据 data-target-id 找到对应的内容元素
            const targetContent = document.getElementById(targetId);

            if (targetContent) {
                // 移除所有内容元素的 active 类并添加 hidden 类
                document.querySelectorAll('.vip-tab-content').forEach(content => {
                    content.classList.remove('active');
					content.classList.remove('tab1-exit');
					content.classList.remove('tab2-exit');
                    content.classList.add('hidden');
                });

                // 给当前点击的 tab 对应的内容元素添加 active 类并移除 hidden 类
                targetContent.classList.add('active');
                targetContent.classList.remove('hidden');
            }
        });
    });
}

// 调用函数以绑定事件
changeTab();