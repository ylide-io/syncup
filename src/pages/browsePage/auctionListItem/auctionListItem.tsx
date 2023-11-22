import { NFT } from 'opensea-js'
import { OrderV2 } from 'opensea-js/lib/orders/types'
import { generatePath } from 'react-router-dom'

import { BackendApi } from '../../../api/backendApi.ts'
import { Button } from '../../../components/button/button.tsx'
import { ProfilePhoto } from '../../../components/profilePhoto/profilePhoto.tsx'
import { RoutePath } from '../../../routePath.ts'
import { renderAuctionStatus } from '../../../utils/auction.tsx'
import css from './auctionListItem.module.scss'

export interface AuctionListItemProps {
	nft: NFT
	expert: BackendApi.Expert
	ask?: OrderV2
}

export function AuctionListItem({ nft, ask, expert }: AuctionListItemProps) {
	return (
		<div className={css.root}>
			<ProfilePhoto className={css.profilePhoto} url={expert.imgUrl} />

			<div className={css.details}>
				<div className={css.name}>{expert.name}</div>

				{!!(expert.position || expert.company) && (
					<div>{[expert.position, expert.company].filter(Boolean).join('  ·  ')}</div>
				)}

				{!!expert.description && <div className={css.bio}>{expert.description}</div>}

				<div className={css.footer}>
					<Button href={generatePath(RoutePath.AUCTION, { auctionId: nft.identifier })}>Details ►</Button>

					<div>{renderAuctionStatus(ask)}</div>
				</div>
			</div>
		</div>
	)
}
