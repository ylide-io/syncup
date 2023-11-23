import { OrderV2 } from 'opensea-js/lib/orders/types'

import { DASH } from '../global.ts'
import { formatDuration } from './date.ts'

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
