import { OrderV2 } from 'opensea-js/lib/orders/types'

import { BackendApi } from '../api/backendApi.ts'
import { DASH } from '../global.ts'
import { invariant } from './assert.ts'
import { formatDuration } from './date.ts'
import { compareBigNumbers } from './number.ts'
import { createBid } from './opensea.ts'

export function renderAuctionStatus(ask: OrderV2 | undefined) {
	const duration = ask?.closingDate ? formatDuration(Date.now() - Date.parse(ask?.closingDate)) : undefined

	return (
		<>
			{ask?.finalized ? (
				<>
					Auction ended{' '}
					{duration != null && (
						<>
							<b title={ask?.closingDate || undefined}>{duration}</b> ago
						</>
					)}
				</>
			) : duration != null ? (
				<>
					Auction ending in <b title={ask?.closingDate || undefined}>{duration}</b>
				</>
			) : (
				DASH
			)}
		</>
	)
}

export function getCurrentPrice(ask: OrderV2, bids?: OrderV2[] | null) {
	const price = bids?.sort((a, b) => -compareBigNumbers(a.currentPrice, b.currentPrice))[0]?.currentPrice
	return price || ask.currentPrice
}

export async function placeBid({ authToken, tokenId }: { authToken: string; tokenId: string }) {
	invariant(authToken)

	const bid = await createBid({ nftId: tokenId })
	console.log('bid', bid)

	const res = await BackendApi.createBid({ bearer: authToken, tokenId, bid })
	console.log('res', res)
}
