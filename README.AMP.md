### amp 检验的相关规则。

1. 自定义样式只允许存在一个 `amp-custom`
2. 所有的非按钮元素上，如果有交互，例如点击，需要加 `role` `tabindex` 属性。例如： `role="button" tabindex="0"`
	- `tabindex` 属性是保证交互元素可通过键盘进行导航的重要属性
	-	`role` 因为div它本身是一个非语义化的元素，不会自动在屏幕下方阅读器它的功能。role属性帮助定义该元素的语义，特别是在它充当按钮、链接等交互性元素时。他的值可以是 `link`, `button`, `document`,

3. `amp-img`元素上不能存在 `decoding`
4. `a` 标签的href属性只能使用有效的 URL 协议（例如http://、https://）。使用javascript:协议会导致 AMP 验证失败。
	- 如果不需要跳转，可以删除 href, 例如：`<a on="tap:someAction">点击我</a>`

5. `a` 标签不需要 `alt` 属性。对于`<a>`标签，AMP 并不允许使用alt属性，因为它没有需要描述的图像内容。
