import { NFT } from 'opensea-js'
import { OrderV2 } from 'opensea-js/lib/orders/types'

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
	}

	export interface GetExpertsSlot {
		tokenId: string
		ask: OrderV2
		nft: NFT
	}

	export interface GetExpertsItem extends Expert {
		slots: GetExpertsSlot[]
	}

	export type GetExpertsResponse = GetExpertsItem[]

	export async function getExperts({ filterByTags }: { filterByTags?: string[] } = {}) {
		return await request<GetExpertsResponse>('/expert', { query: { tags: filterByTags } })
	}

	//

	export interface GetSlotResponse {
		tokenId: string
		nft: NFT
		expert: Expert
		ask: OrderV2
		bids: OrderV2[] | null
	}

	export async function getSlot({ tokenId }: { tokenId: string }) {
		return await request<GetSlotResponse>(`/slot/${tokenId}`)
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

	export async function getTags() {
		return await request<GetTagsResponse>('/tag')
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
