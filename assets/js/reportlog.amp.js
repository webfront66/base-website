AMP.getState('reportLogInfo').then((res) => {
	fetch('https://admin.fqhgvpn.com/analyze/reportLog', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: res,
	})
});