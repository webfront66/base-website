document.addEventListener('load', () => {
	const res = {
		"host": window.location.host,
		"path": window.location.pathname
	}
	fetch('https://admin.fqhgvpn.com/analyze/reportLog', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(res),
	})
})