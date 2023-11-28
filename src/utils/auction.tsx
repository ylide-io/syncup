import { BigNumber, BigNumberish } from 'ethers'
import { OrderV2 } from 'opensea-js/lib/orders/types'

import { BackendApi } from '../api/backendApi.ts'
import { DASH } from '../global.ts'
import { invariant } from './assert.ts'
import { formatDuration } from './date.ts'
import { compareBigNumbers, cryptoAmount, toBigNumber } from './number.ts'
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

export function getHighestBidPrice(bids?: OrderV2[] | null) {
	return toBigNumber(bids?.sort((a, b) => -compareBigNumbers(a.currentPrice, b.currentPrice))[0]?.currentPrice)
}

export function getCurrentPrice(ask: OrderV2, bids?: OrderV2[] | null) {
	return getHighestBidPrice(bids) || toBigNumber(ask.currentPrice)
}

export function getNextPrice(lastPrice: BigNumber | undefined) {
	lastPrice = lastPrice || BigNumber.from('0')

	let nextPrice = ['0.01', '0.02', '0.05', '0.1'].map(cryptoAmount).find(value => lastPrice?.lt(value))
	if (nextPrice) {
		return nextPrice
	}

	nextPrice = cryptoAmount('0.1')
	while (lastPrice.gte(nextPrice)) {
		nextPrice = nextPrice.add(cryptoAmount('0.1'))
	}
	return nextPrice
}

export async function placeBid({
	authToken,
	tokenId,
	price,
}: {
	authToken: string
	tokenId: string
	price: BigNumberish
}) {
	invariant(authToken)

	const bid = await createBid({ nftId: tokenId, price })
	console.log('bid', bid)

	const res = await BackendApi.createBid({ bearer: authToken, tokenId, bid })
	console.log('res', res)
}
