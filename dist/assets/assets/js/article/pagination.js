 function generatePagination(pageIndex, pageTotal, categoryName) {
  let domain = location.protocol + "//" + location.hostname;
  let paginationHtml = '<div class="nav-links flex justify-center items-center gap-2 sm:gap-4 flex-wrap">';

  // 如果总页数小于5，显示所有页码，不显示上一页和下一页
  if (pageTotal < 5) {
    for (let i = 1; i <= pageTotal; i++) {
      if (i === pageIndex) {
        paginationHtml += `<span aria-current="page" class="page-numbers current px-3 py-2 sm:px-4 sm:py-3 bg-blue-600 text-white rounded-md font-semibold">${i}</span>`;
      } else {
        paginationHtml += `<a class="page-numbers px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-200 rounded-md hover:bg-blue-600 hover:text-white transition-all" href="${domain}/category/${categoryName}/page/${i}/">${i}</a>`;
      }
    }
  } else {
    // 前一页链接
    if (pageIndex > 1) {
      paginationHtml += `<a class="prev page-numbers flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-200 rounded-md hover:bg-blue-600 hover:text-white transition-all" href="${domain}/category/${categoryName}/page/${pageIndex - 1}/"><span class="ast-left-arrow">←</span> 前一页</a>`;
    }

    // 始终显示第一页链接（不可点击）
    paginationHtml += `<span class="page-numbers px-3 py-2 sm:px-4 sm:py-3 text-gray-500 bg-gray-200 rounded-md">${1}</span>`;

    // 当当前页大于3时，显示省略号
    if (pageIndex > 3) {
      paginationHtml += '<span class="page-numbers dots px-3 py-2 sm:px-4 sm:py-3 text-gray-500">…</span>';
    }

    // 中间页码
    for (let i = Math.max(2, pageIndex - 2); i <= Math.min(pageTotal - 1, pageIndex + 2); i++) {
      if (i === pageIndex) {
        paginationHtml += `<span aria-current="page" class="page-numbers current px-3 py-2 sm:px-4 sm:py-3 bg-blue-600 text-white rounded-md font-semibold">${i}</span>`;
      } else {
        paginationHtml += `<a class="page-numbers px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-200 rounded-md hover:bg-blue-600 hover:text-white transition-all" href="${domain}/category/${categoryName}/page/${i}/">${i}</a>`;
      }
    }

    // 后续页码
    if (pageIndex < pageTotal - 2) {
      paginationHtml += '<span class="page-numbers dots px-3 py-2 sm:px-4 sm:py-3 text-gray-500">…</span>';
      paginationHtml += `<a class="page-numbers px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-200 rounded-md hover:bg-blue-600 hover:text-white transition-all" href="${domain}/category/${categoryName}/page/${pageTotal}/">${pageTotal}</a>`;
    }

    // 后一页链接
    if (pageIndex < pageTotal) {
      paginationHtml += `<a class="next page-numbers flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-gray-200 rounded-md hover:bg-blue-600 hover:text-white transition-all" href="${domain}/category/${categoryName}/page/${pageIndex + 1}/">后一页 <span class="ast-right-arrow">→</span></a>`;
    }
  }

  paginationHtml += '</div>';
  return paginationHtml;
}

    const path = location.pathname;
  
  const regex = /\/category\/([^\/]+)(?:\/page\/(\d+))?(?:\.html)?\/?$/;
  const matches = path.match(regex);
  if (matches) {
    const category = decodeURIComponent(matches[1]);  // 解码获取 Category 部分
    const page = matches[2] ? parseInt(matches[2]) : 1;  // 如果没有 page，则默认值为 '1'
    console.log("Category:", category);
    console.log("Page:", page);
    const myDiv = document.getElementById('list-page-container');
    const maxpage = parseInt(myDiv.getAttribute('maxpage'));
    myDiv.innerHTML = generatePagination(page, maxpage, category);
  }