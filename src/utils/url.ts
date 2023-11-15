export function isExternalUrl(url: string) {
	const a = document.createElement('a')
	a.href = url
	return a.host !== location.host
}
