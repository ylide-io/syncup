import { asyncDelay } from '../utils/async.ts'
import { createCleanSerachParams } from '../utils/url.ts'

export namespace BackendApi {
	export interface ResponseBody<Data> {
		result: boolean
		error?: any
		data?: Data
	}

	async function request<Data>(path: string, query?: Record<string, any>, data?: any): Promise<Data> {
		const response = await fetch(`https://localhost${path}?${query ? createCleanSerachParams(query) : ''}`, {
			method: data ? 'POST' : 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			body: data ? JSON.stringify(data) : undefined,
		})

		const body = (await response.json()) as ResponseBody<Data>
		if (!body.result) {
			throw new Error(`Error during request: ${body.error || 'Unknown'}`)
		}

		return body.data as Data
	}

	//

	export async function getAuctions() {
		await asyncDelay(700)
		return [{ id: '1' }]
	}

	//

	export type GetTagsResponse = string[]

	export async function getTags(): Promise<GetTagsResponse> {
		await asyncDelay(500)
		return [
			'B2B Sales',
			'B2C Sales',
			'Bootstrapping',
			'Financial Planning',
			'Fundraising',
			'Growth Marketing',
			'Manufacturing',
			'People & Hiring',
			'Product & Engineering',
			'Product Marketing',
			'Public Relations',
			'SEM & SEO',
			'Social Media',
			'Strategy & Operations',
		]
	}
}
