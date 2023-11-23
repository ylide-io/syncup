import { createCleanSerachParams } from '../utils/url.ts'

export namespace BackendApi {
	async function request<Data>(
		path: string,
		{
			method,
			bearer,
			query,
			data,
		}: { method?: string; bearer?: string; query?: Record<string, any>; data?: any } = {},
	): Promise<Data> {
		const response = await fetch(
			`${import.meta.env.VITE__BACKEND_URL}${path}?${query ? createCleanSerachParams(query) : ''}`,
			{
				method: method || (data ? 'POST' : 'GET'),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${bearer}`,
				},
				body: data ? JSON.stringify(data) : undefined,
			},
		)

		return (await response.json()) as Data
	}

	//

	export interface Expert {
		id: string
		name: string
		description: string
		position: string
		company: string
		achievements: string[]
		imgUrl: string
		socialLinks: string[]
		tags: { name: string }[]
		slots: { tokenId: string }[]
	}

	export type ExpertsResponse = Expert[]

	export async function getExperts({ filterByTags }: { filterByTags?: string[] } = {}): Promise<ExpertsResponse> {
		return await request('/expert', { query: { tags: filterByTags } })
	}

	//

	export async function getSlot({ tokenId }: { tokenId: string }) {
		return await request(`/slot/${tokenId}`)
	}

	//

	export async function getSlotCallLink({ bearer, tokenId }: { bearer: string; tokenId: string }) {
		return await request(`/expert/slot/${tokenId}`, { bearer })
	}

	//

	export interface GetTagsResponse {
		items: string[]
		count: number
	}

	export async function getTags(): Promise<GetTagsResponse> {
		return await request('/tag')
	}

	//

	export async function createBid({ bearer, tokenId }: { bearer: string; tokenId: string }) {
		return await request('/bid', { bearer, data: { tokenId } })
	}

	//

	export async function deleteBid({ bearer, tokenId }: { bearer: string; tokenId: string }) {
		return await request('/bid', { method: 'DELETE', bearer, data: { tokenId } })
	}

	//

	export async function getUser({ bearer }: { bearer: string }) {
		return await request('/user', { bearer })
	}
}
