document.addEventListener('DOMContentLoaded', function () {
	// 缓存 DOM 元素
	var navMenuDiv = document.getElementById("nav-content");
	var navMenu = document.getElementById("nav-toggle");

	// 使用事件委托添加点击事件
	document.addEventListener("click", function (e) {
			var target = e.target;

			// 检查点击目标是否在菜单内
			if (!checkParent(target, navMenuDiv)) {
					// 点击了 nav-toggle 链接
					if (checkParent(target, navMenu)) {
							toggleMenu();
					} else {
							// 点击了菜单外部，隐藏菜单1
							navMenuDiv.classList.add("hidden");
					}
			}
	});

	// 切换菜单显示状态
	function toggleMenu() {
			navMenuDiv.classList.toggle("hidden");
	}

	// 检查目标是否在元素的父级中
	function checkParent(target, element) {
			while (target) {
					if (target === element) {
							return true;
					}
					target = target.parentElement;
			}
			return false;
	}
});
