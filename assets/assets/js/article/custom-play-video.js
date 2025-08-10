function customPlayVideo() {
	try {
        // 可能有，可能没有。
        const videoPlayBtns = Array.from(document.querySelectorAll('.cust-video-play'));

        videoPlayBtns.forEach(btnItem => {
            btnItem.addEventListener('click', () => {
                // 找到最近的父级 class 为 cust-video-wrapper 的元素
                const wrapper = btnItem.closest('.cust-video-wrapper');
                if (!wrapper) return;

                // 在父级元素中查找 class 为 cust-video-pl 的元素
                const videoPl = wrapper.querySelector('.cust-video-pl');
                if (!videoPl) return;

                // 获取 .cust-video-pl 的 src 值
                const videoSrc = videoPl.getAttribute('src');
                if (!videoSrc) return;

                // 获取 title 和 style

                // 生成 iframe
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', `${videoSrc}`);
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframe.setAttribute('width', '100%');
                iframe.setAttribute('height', wrapper.offsetHeight);

                // 在父节点下查找 itemprop="video" 的元素
                const videoElement = wrapper.querySelector('[itemprop="video"]');
                if (videoElement) {
                    videoElement.replaceWith(iframe);
                }
            });
        });

    } catch (error) {
        console.error('Error in video play script:', error);
    }
}

customPlayVideo()