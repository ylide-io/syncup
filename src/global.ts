export const NBSP = ' '
export const DASH = '–'

export const ReactQueryKey = {
	auth: (address: string) => ['auth', address],
	tags: ['tags'],
	rates: ['rates'],
	auctions: (filterByTag?: string) => ['auctions', `tag_${filterByTag || ''}`],
	auction: (id: string, address?: string) => ['auction', id, address],
	user: (authToken: string) => ['user', authToken],
}
