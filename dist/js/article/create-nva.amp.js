(async function () {
    function getPageInfo() {
        const navId = "list-page-container";
        const navContainer = document.getElementById(navId);
        if (!navContainer) {
            console.warn("⚠️ 没有找到分页的元素：" + navId);
            return {
                category: "",
                page: 1,
                total: 1,
                navContainer: null
            };
        }
        // 在amp中，location是一个WorkerLocation，最好的方式是不从url上读取参数。
        // 使用 getAttribute 读取 data 属性
        const total = parseInt(navContainer.getAttribute("data-max-page") || 1, 10);
        const dataUrl = navContainer.getAttribute("data-url")
        if (!dataUrl) {
            AMP.setState({
                pageData: {
                    total: total
                }
            })
            return
        }
        const finalUrl = dataUrl.endsWith('/') ? dataUrl : `${dataUrl}/`
        AMP.setState({
            pageData: {
                url: finalUrl,
                total: total
            }
        })
        
    }
    getPageInfo()
})()