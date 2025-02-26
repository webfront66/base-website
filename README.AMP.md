
### amp 在线校验

[在线校验地址](https://validator.ampproject.org/)

<br />

[在线测试](https://search.google.com/test/amp)

### amp本地校验。

如果不想使用线上的校验。

可使用 `amphtml-validator` 对代码 做校验。

1.  安装 AMP Linter
```bash
npm install -g amphtml-validator

```

2. 使用 AMP Linter 校验 HTML 文件
```bash
amphtml-validator index.amp.html
```

3. 将 AMP Linter 集成到开发流程

### amp 检验的相关规则。



1. 自定义样式只允许存在一个 `amp-custom`
2. 所有的非按钮元素上，如果有交互，例如点击，需要加 `role` `tabindex` 属性。例如： `role="button" tabindex="0"`
	- `tabindex` 属性是保证交互元素可通过键盘进行导航的重要属性
	-	`role` 因为div它本身是一个非语义化的元素，不会自动在屏幕下方阅读器它的功能。role属性帮助定义该元素的语义，特别是在它充当按钮、链接等交互性元素时。他的值可以是 `link`, `button`, `document`,

3. `amp-img`元素上不能存在 `decoding`
4. `a` 标签的href属性只能使用有效的 URL 协议（例如http://、https://）。使用javascript:协议会导致 AMP 验证失败。
	- 如果不需要跳转，可以删除 href, 例如：`<a on="tap:someAction">点击我</a>`

5. `a` 标签不需要 `alt` 属性。对于`<a>`标签，AMP 并不允许使用alt属性，因为它没有需要描述的图像内容。




### 获取useAge

1. 必须在头部加一个meta: `<meta name="amp-script-src" content="sha384-AyqUpxrf0kBDOgIwJYBIea7n5wsTaa2g9QRN6qE62WIujdJ4h-H6XC2IYr0bPCj9">`

2. 


### 自定义js相关 1

[参考链接1，展示了amp-script与script的交互](https://amp.dev/documentation/guides-and-tutorials/develop/interactivity_guide/)

[参考链接1的 playground](https://playground.amp.dev/?url=https%3A%2F%2Fpreview.amp.dev%2Fdocumentation%2Fguides-and-tutorials%2Fdevelop%2Finteractivity_guide%2Findex.example.3.html%3Fformat%3Dwebsites&mode=iPhone+6%2F7%2F8+Plus)


核心代码。
这部分代码是有点问题的，他没有正确 设置 `setState`,  `setState` 应该是一个 json 数据。
```html
<amp-script width="200" height="100" script="hello-world" [class]="scriptStyle">
  <button>Hello amp-script!</button>
</amp-script>
<script id="hello-world" type="text/plain" target="amp-script">
  const btn = document.querySelector('button');
  btn.addEventListener('click', () => {
    document.body.textContent = 'Hello World!';
    AMP.setState({ scriptStyle: "clickedButton" })
  });
</script>
```

%s: &quot;%s&quot; is not a valid result for [class]. amp-bind null