import { NFT } from 'opensea-js'
import { OrderV2 } from 'opensea-js/lib/orders/types'

import { formatAddress } from '../utils/string.ts'
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

		const body = await response.text()

		try {
			return JSON.parse(body) as Data
		} catch (e) {
			return body as Data
		}
	}

	//

	export async function getAuthNonce({ address }: { address: string }) {
		return await request<{ nonce: string }>('/auth/nonce', { query: { address: formatAddress(address) } })
	}

	//

	export async function getAuthToken({ address, signature }: { address: string; signature: string }) {
		return await request<{ token: string }>('/auth', { data: { address: formatAddress(address), signature } })
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

	export interface GetSlotBidItem {
		data: OrderV2
		ethAmount: string
		orderHash: string
	}

	export interface GetSlotResponse {
		tokenId: string
		nft: NFT
		expert: Expert
		ask: OrderV2
		bids: GetSlotBidItem[] | null
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

	export async function createBid({ bearer, tokenId, bid }: { bearer: string; tokenId: string; bid: OrderV2 }) {
		return await request('/bid', { bearer, data: { tokenId, order: bid } })
	}

	//

	export async function deleteBid({ bearer, orderHash }: { bearer: string; orderHash: string }) {
		return await request('/bid', { method: 'DELETE', bearer, data: { orderHash } })
	}

	//

	export interface SecretLink {
		id: string
		url: string
	}

	export interface getUserItem {
		data: OrderV2
		orderHash: string
		ethAmount: string
		slot: {
			tokenId: string
			expert: Expert
			link: SecretLink | null
			nft: NFT
			ask: OrderV2
		}
	}

	export async function getUser({ bearer }: { bearer: string }) {
		return await request<getUserItem[]>('/user', { bearer })
	}
}
