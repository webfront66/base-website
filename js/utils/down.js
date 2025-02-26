function getOS() {
	const userAgent = navigator.userAgent,
			platform = navigator.platform,
			macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
			windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
			iosPlatforms = ['iPhone', 'iPad', 'iPod'];

	if (macosPlatforms.includes(platform)) {
			return 'Mac';
	} else if (iosPlatforms.includes(platform)) {
			return 'iOS';
	} else if (windowsPlatforms.includes(platform)) {
			return 'Windows';
	} else if (/Android/.test(userAgent)) {
			return 'Android';
	} else if (/Linux/.test(platform)) {
			return 'Linux';
	}

	return 'Unknown';
}

const linkInfo = {
	Mac: 'https://www.fanqiejsq.com/%E5%9B%9E%E5%9B%BD%E5%8A%A0%E9%80%9F%E5%99%A8mac%E4%B8%8B%E8%BD%BD/',
	iOS: 'https://www.fanqiejsq.com/%E5%9B%9E%E5%9B%BD%E5%8A%A0%E9%80%9F%E5%99%A8ios%E4%B8%8B%E8%BD%BD/',
	Windows: 'https://www.fanqiejsq.com/%E5%9B%9E%E5%9B%BD%E5%8A%A0%E9%80%9F%E5%99%A8windows%E4%B8%8B%E8%BD%BD/',
	Android: 'https://www.fanqiejsq.com/%E5%9B%9E%E5%9B%BD%E5%8A%A0%E9%80%9F%E5%99%A8android%E4%B8%8B%E8%BD%BD/',
	Linux: 'https://www.fanqiejsq.com/download/',
	Unknown: 'https://www.fanqiejsq.com/download/'
}
let link = 'https://www.fanqiejsq.com/download/'
function setComDownLinkHref() {
	const system = getOS()
	const downPageLink = linkInfo[system]
	if (!downPageLink) {
			return
	}

	link = downPageLink
	try {
			const comDownLinkDom = Array.from(document.querySelectorAll('.com-down-link'));
			if (!comDownLinkDom || !comDownLinkDom.length) {
					return;
			}
			comDownLinkDom.forEach(item => {
					if (item.hasAttribute('href')) {
							item.setAttribute('href', downPageLink)
					}
			})
	} catch (error) {
			console.error('An error occurred:', error);
			// 错误处理逻辑
	}

}
setComDownLinkHref()
