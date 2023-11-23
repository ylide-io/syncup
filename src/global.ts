export const NBSP = ' '

export const ReactQueryKey = {
	tags: ['tags'],
	rates: ['rates'],
	auctions: (filterByTag?: string) => ['auctions', `tag_${filterByTag || ''}`],
	auction: (id: string) => ['auction', id],
}
