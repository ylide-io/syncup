import { useQuery } from '@tanstack/react-query'
import { NFT } from 'opensea-js'
import { OrderV2 } from 'opensea-js/lib/orders/types'
import { useContext } from 'react'

import { BackendApi } from '../../api/backendApi.ts'
import { Button, ButtonLook, ButtonSize } from '../../components/button/button.tsx'
import { SectionHeader } from '../../components/components.tsx'
import { ErrorMessage } from '../../components/errorMessage/errorMessage.tsx'
import { Layout } from '../../components/layout/layout.tsx'
import { SpinningLoader } from '../../components/loaders/loaders.tsx'
import { TagsContext } from '../../components/tagsContext/tagsContext.tsx'
import { ReactQueryKey } from '../../global.ts'
import { getAllNfts, getAsks } from '../../utils/opensea.ts'
import { AuctionListItem } from './auctionListItem/auctionListItem.tsx'
import css from './browsePage.module.scss'

const SIDEBAR_TAG_COUNT = 7

export function BrowsePage() {
	const tagsContext = useContext(TagsContext)

	const auctionsQuery = useQuery({
		queryKey: ReactQueryKey.auctions,
		queryFn: async () => {
			const [allNfts, experts] = await Promise.all([getAllNfts(), BackendApi.getExperts()])
			const allAsks = await getAsks({ nftIds: allNfts.nfts.map(nft => nft.identifier) })
			console.log('allAsks', allAsks)
			return allNfts.nfts.reduce<
				{
					nft: NFT
					ask: OrderV2
					expert: BackendApi.Expert
				}[]
			>((res, nft) => {
				const expert = experts.find(expert => expert.slots.some(slot => slot.tokenId === nft.identifier))
				const ask = allAsks.orders.find(order =>
					order.makerAssetBundle.assets.find(asset => asset.tokenId === nft.identifier),
				)

				if (expert && ask) {
					res.push({
						nft,
						ask,
						expert,
					})
				}

				return res
			}, [])
		},
	})

	return (
		<Layout>
			<div className={css.root}>
				<div className={css.sidebar}>
					<SectionHeader>Filter by Expertise</SectionHeader>

					{tagsContext.data ? (
						<>
							<div className={css.tagList}>
								{tagsContext.data.items.slice(0, SIDEBAR_TAG_COUNT).map(tag => (
									<Button key={tag} size={ButtonSize.SMALL} look={ButtonLook.SECONDARY}>
										{tag}
									</Button>
								))}
							</div>

							{tagsContext.data.items.length > SIDEBAR_TAG_COUNT && (
								<a className={css.sidebarMoreButton} href="/">
									More ↓
								</a>
							)}
						</>
					) : (
						<SpinningLoader />
					)}
				</div>

				<div className={css.content}>
					{auctionsQuery.data ? (
						<>
							<div className={css.list}>
								{auctionsQuery.data.map(({ nft, ask, expert }) => (
									<AuctionListItem key={nft.identifier} nft={nft} ask={ask} expert={expert} />
								))}
							</div>

							<a className={css.moreButton} href="/">
								Show more experts ↓
							</a>
						</>
					) : auctionsQuery.isLoading ? (
						<SpinningLoader />
					) : (
						<ErrorMessage>Failed to load 😟</ErrorMessage>
					)}
				</div>
			</div>
		</Layout>
	)
}
