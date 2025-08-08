(async function () {
    /**
     * 获取当前页面的分类、页码和总页数信息。
     * - 从 URL 提取 category 和 page, 不从url上取，而是从。元素上取。
     * - 从 DOM 提取最大页数
     *
     * @returns {Object} 包含 category、page、total 的对象
     */
    function getPageInfo() {
        const defPage = 1; // 默认页码
        const navId = "list-page-container"; // 分页信息所在的 DOM 元素 ID
        const demoPath = '/category/影音加速器/page/4'
        const pathName = window.location.pathname;
        const path = pathName.includes('category') ? pathName : demoPath

        const navContainer = document.getElementById(navId);
        // 正则匹配 category 和 page
        const regex = /\/category\/([^\/]+)(?:\/page\/(\d+))?(?:\.html)?\/?$/;
        const matches = path.match(regex);

        

        let total = 1; // 默认总页数为当前页数

        try {
            // 获取分页信息的 DOM 元素

            if (navContainer) {
                // 读取 data-max-page 或 data-total 作为总页数
                const dataTotal =
                    navContainer.getAttribute("data-max-page") ||
                    navContainer.getAttribute("data-total");
                if (dataTotal) {
                    total = Number(dataTotal); // 确保转换为数字类型
                }
            } else {
                console.warn("⚠️ 没有找到分页的元素：" + navId);
            }
        } catch (error) {
            console.error("获取总页数失败：", error);
        }
        // 初始化返回的默认配置
        const retConfig = {
            category: "",
            page: defPage,
            total: total,
            navContainer
        };

        // 如果 URL 匹配失败，则返回默认配置
        if (!matches) {
            return retConfig;
        }

        // 提取分类名，并进行 URL 解码
        const category = decodeURIComponent(matches[1]);

        // 提取页码，如果未找到则默认为 1
        const page = matches[2] ? parseInt(matches[2], 10) : defPage;


        // 组装最终的返回数据
        return Object.assign(retConfig, {
            category,
            page,
            total,
            navContainer: navContainer
        });
    }

    
    /**
     * 生成分页列表，返回一个数组，每个元素包含页码信息
     * @returns {Array} 分页信息数组
     */
    function generatePagination(pageInfo) {
        const domain = location.protocol + "//" + location.hostname;

        const {
            page,
            total: pageTotal
        } = pageInfo;
        const paginationList = [];

        // 生成页码链接
        const generatePageLink = (num) => {
            let pageType = 'active'
            if (num === 1) {
                pageType === 'first'
            }
            if (num === pageTotal) {
                pageType === 'last'
            }
            if (num === page - 1) {
                pageType === 'before'
            }
            if (num === page + 1) {
                pageType === 'after'
            }
            const href = num == 1 ? `${domain}/category/${pageInfo.category}/` : `${domain}/category/${pageInfo.category}/page/${num}`
            return {
                content: num,
                pageType: num === 1 ? '' : '',
                active: num === page ? 'active ' : ' ',
                href: href,
                type: 'number',
            }
        };
        // 第一页和beforePageHref是否是同一个。
        // 最后一页和 afterPageHref是否是同一个。
        const paginationInfo = {
            hasPrev: page > 1, // 是否有前一页按钮
            hasNext: page < pageTotal, // 是否有后一页按钮
            hasBeforeDot: false, // 前两个页码之间是否有间隔
            hasAfterDot: false, // 后两个页面之间是否有间隔
            activePageHref: `${domain}/category/${pageInfo.category}/page/${page}`,
            beforePageHref: page > 1 ? `${domain}/category/${pageInfo.category}/page/${page - 1}` : '',
            afterPageHref: page < pageTotal ? `${domain}/category/${pageInfo.category}/page/${page + 1}` : '',
            firstPageHref: `${domain}/category/${pageInfo.category}/page/1`, // 第一页链接
            lastPageHref: `${domain}/category/${pageInfo.category}/page/${pageTotal}`, // 最后一页链接
        };
        if (pageTotal < 5) {
            // **总页数 < 5，直接显示所有页码**
            for (let i = 1; i <= pageTotal; i++) {
                paginationList.push(generatePageLink(i));
            }
            Object.assign(paginationInfo, {
                hasPrev: false,
                hasNext: false,
                hasBeforeDot: false, // 前两个页码之间是否有间隔
                hasAfterDot: false, // 后两个页面之间是否有间隔
            })

        } else {
            // **总页数 >= 5，需要插入省略号等逻辑**
            const pagesToShow = new Set();

            // 1. **添加第一页和最后一页**
            pagesToShow.add(1);
            pagesToShow.add(pageTotal);

            // 2. **添加当前页及前后页**
            pagesToShow.add(page);
            if (page > 1) pagesToShow.add(page - 1);
            if (page < pageTotal) pagesToShow.add(page + 1);

            // 3. **转换为数组并排序**
            const sortedPages = [...pagesToShow].sort((a, b) => a - b);

            // 4. **插入省略号 `...`**
            for (let i = 0; i < sortedPages.length; i++) {
                paginationList.push(generatePageLink(sortedPages[i]));

                // 检查是否需要插入省略号（跳过的页数 > 1）
                if (i < sortedPages.length - 1 && sortedPages[i + 1] - sortedPages[i] > 1) {
                    paginationList.push({
                        content: '...',
                        type: 'dots'
                    });
                }
            }
            // 5, 判断是否需要前一页，和后一页，当page===1时，不需要前一页，当page===pageTotal时不需要后一页。
            if (page < pageTotal) {
                paginationList.push({
                    content: '后一页', // 也可以用 "Next"
                    href: `${domain}/category/${pageInfo.category}/page/${page + 1}`,
                    type: 'next',
                });
            }
            if (page > 1) {
                paginationList.unshift({
                    content: '前一页', // 也可以用 "Prev"
                    href: page - 1 > 1 ? `${domain}/category/${pageInfo.category}/page/${page - 1}` : `${domain}/category/${pageInfo.category}`,
                    type: 'prev',
                });
            }
        }
        // 

        return {
            paginationList,
            paginationInfo: paginationInfo
        };
    }

    async function generatePaginationHtml() {
        const getPrevDom = (href) => {
            return `
                <a class=" xs:bg-red-500 prev page-numbers flex items-center gap-1 p-2 h-10  text-gray-800 bg-gray-200 rounded-md hover:bg-blue-600 hover:text-white transition-all"
                    href="${href}">
                    <span class="ast-left-arrow text-lg sm:text-xl ">←</span> 前一页
                </a>
    
            `
        }
        const getNextDom = (href) => {
            return `
                <a class="next page-numbers flex items-center gap-1 p-2  h-10 text-gray-800 bg-gray-200 rounded-md hover:bg-blue-600 hover:text-white transition-all"
                    href="${href}">
                    后一页 <span class="ast-right-arrow text-lg sm:text-xl">→</span>
                </a>
            `

        }
        const getNumDom = (info = {
            href: '',
            type,
            content: ''
        }) => {
            return `
                <a class="${info.active} page-numbers px-3 py-2  text-gray-800 bg-gray-200 rounded-md hover:bg-blue-600 hover:text-white transition-all"
                    href='${info.href}' data-href="${info.href}">
                    ${info.content}
                </a>
            `
        }
        const getDotDom = () => {
            return `
                <span class="page-numbers dots  text-gray-500">…</span>
            `
        }
        const pageInfo = getPageInfo();
        const {
            paginationList
        } = await generatePagination(pageInfo)
        const {navContainer} = pageInfo

        let navContentHtml = ''
        paginationList.forEach(item => {
            switch (item.type) {
                case 'prev':
                    navContentHtml += getPrevDom(item.href)
                    break;
                case 'next':
                    navContentHtml += getNextDom(item.href)
                    break;
                case 'number':
                    navContentHtml += getNumDom(item)
                    break;
                case 'dots':
                    navContentHtml += getDotDom()
                    break;
                default:
                    // no default
            }
        });
        const finalHTml = `
                <div class="nav-links flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
                    <span class="another-element"></span>
                    ${navContentHtml}
                </div>
            `
        navContainer && (navContainer.innerHTML = finalHTml)
    }

    generatePaginationHtml()


})()