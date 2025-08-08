document.addEventListener('DOMContentLoaded', function () {
	// 缓存 DOM 元素
	const showSubMenuBtn = document.getElementById("show_sub_menu");
	const subMenu = document.getElementById("sub_menu_3");
	const parentElement = showSubMenuBtn.parentElement;  // 缓存父元素
	const anchorLink = parentElement.querySelector("a"); // 获取父元素中的 <a> 标签

	// 切换子菜单显示状态的函数
	const toggleSubMenu = () => {
			const isVisible = subMenu.classList.contains("show");
			
			// 根据当前状态切换显示和按钮颜色
			subMenu.classList.toggle("show", !isVisible);
			parentElement.classList.toggle('text-red-400', !isVisible);
			
			// 切换父元素中的 <a> 标签的类
			if (anchorLink) {
					anchorLink.classList.toggle('text-red-400', !isVisible); // 修改 <a> 标签的类
			}
	};

	// 为按钮添加点击事件
	showSubMenuBtn.addEventListener('click', toggleSubMenu);

	// 监听窗口大小变化，关闭子菜单
	window.addEventListener('resize', function () {
			if (window.innerWidth < 1024) {
					closeSubMenu();
			}
	});

	// 关闭子菜单的函数
	function closeSubMenu() {
			subMenu.classList.remove("show");
			parentElement.classList.remove('text-red-400');
			
			// 确保在窗口缩小时也移除 <a> 标签的样式
			if (anchorLink) {
					anchorLink.classList.remove('text-red-400');
			}
	}
});
