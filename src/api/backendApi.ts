import { createCleanSerachParams } from '../utils/url.ts'

export namespace BackendApi {
	async function request<Data>(path: string, query?: Record<string, any>, data?: any): Promise<Data> {
		const response = await fetch(
			`${import.meta.env.VITE__BACKEND_URL}${path}?${query ? createCleanSerachParams(query) : ''}`,
			{
				method: data ? 'POST' : 'GET',
				headers: {
					'Content-Type': 'application/json',
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

	export async function getExperts(): Promise<ExpertsResponse> {
		return await request('/expert')
	}

	//

	export interface GetTagsResponse {
		items: string[]
		count: number
	}

	export async function getTags(): Promise<GetTagsResponse> {
		return await request('/tag')
	}
}
