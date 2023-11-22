import { OrderV2 } from 'opensea-js/lib/orders/types'

import { DateFormatStyle, formatDate } from './date.ts'

export function renderAuctionStatus(ask: OrderV2 | undefined) {
	const closingDate = ask?.closingDate && Date.parse(ask.closingDate)

	return (
		<>
			{!closingDate ? (
				'Auction ended'
			) : (
				<>
					Auction ending on <b>{formatDate(closingDate, DateFormatStyle.LONG)}</b>
				</>
			)}
		</>
	)
}
