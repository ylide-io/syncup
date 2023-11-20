import { createSearchParams } from 'react-router-dom'

import { filterObjectEntries } from './object.ts'

export function isExternalUrl(url: string) {
	const a = document.createElement('a')
	a.href = url
	return a.host !== location.host
}

export function createCleanSerachParams(search: Record<string, any>) {
	return createSearchParams(filterObjectEntries(search, (_, value) => value != null))
}
