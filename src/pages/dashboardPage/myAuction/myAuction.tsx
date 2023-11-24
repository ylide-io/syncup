import { OrderV2 } from 'opensea-js/lib/orders/types'
import { generatePath } from 'react-router-dom'

import { BackendApi } from '../../../api/backendApi.ts'
import { Button, ButtonSize } from '../../../components/button/button.tsx'
import { ProfilePhoto } from '../../../components/profilePhoto/profilePhoto.tsx'
import { RoutePath } from '../../../routePath.ts'
import { renderAuctionStatus } from '../../../utils/auction.tsx'
import { formatCryptoAmount } from '../../../utils/number.ts'
import css from './myAuction.module.scss'
import Expert = BackendApi.Expert

export interface MyAuctionProps {
	tokenId: string
	ask: OrderV2
	expert: Expert
	secretLink: BackendApi.SecretLink | null
}

export function MyAuction({ tokenId, ask, expert, secretLink }: MyAuctionProps) {
	return (
		<div className={css.root}>
			<ProfilePhoto className={css.profilePhoto} url={expert.imgUrl} />

			<div className={css.details}>
				<div className={css.name}>{expert.name}</div>

				<div>
					Current bid is <b>{formatCryptoAmount(ask.currentPrice)} ETH</b>
				</div>

				{secretLink && (
					<div className={css.info}>
						<b>Congratulations!</b>
						<br />
						Your bid is the highest one!
						<br />
						<br />
						Here is the link to a call with {expert.name}:
						<br />
						<a href={secretLink.url} target="_blank" rel="noreferrer">
							{secretLink.url}
						</a>
					</div>
				)}

				<div className={css.footer}>
					<Button size={ButtonSize.SMALL} href={generatePath(RoutePath.AUCTION, { nftId: tokenId })}>
						Details ►
					</Button>

					<div>{renderAuctionStatus(ask)}</div>
				</div>
			</div>
		</div>
	)
}
