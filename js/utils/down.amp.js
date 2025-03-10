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
	Mac: '/pages/down/mac-down/mac-down.amp.html',
	iOS: '/pages/down/ios-down/ios-down.amp.html',
	Windows: '/pages/down/win-down/windows-down.amp.html',
	Android: '/pages/down/android-down/android-down.amp.html',
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
	AMP.setState({
		downJumpInfo: {
			platform: getOS(),
			link: link
		}
	});

}
setComDownLinkHref()
