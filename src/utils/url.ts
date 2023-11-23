import { createSearchParams, URLSearchParamsInit } from 'react-router-dom'

import { filterObjectEntries } from './object.ts'

export function isExternalUrl(url: string) {
	const a = document.createElement('a')
	a.href = url
	return a.host !== location.host
}

export function createCleanSerachParams(search: Record<string, any>) {
	return createSearchParams(filterObjectEntries(search, (_, value) => value != null))
}

//

export interface UseNavParameters {
	path?: string
	search?: URLSearchParamsInit
	hash?: string
}

export function buildUrl(params: string | UseNavParameters) {
	return typeof params === 'string'
		? params
		: `${params.path || ''}${params.search ? `?${createSearchParams(params.search).toString()}` : ''}${
				params.hash ? `#${params.hash}` : ''
		  }`
}
