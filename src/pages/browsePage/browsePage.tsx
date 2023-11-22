import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'

import { BackendApi } from '../../api/backendApi.ts'
import { Button, ButtonLook, ButtonSize } from '../../components/button/button.tsx'
import { SectionHeader } from '../../components/components.tsx'
import { Layout } from '../../components/layout/layout.tsx'
import { SpinningLoader } from '../../components/loaders/loaders.tsx'
import { TagsContext } from '../../components/tagsContext/tagsContext.tsx'
import { ReactQueryKey } from '../../global.ts'
import { getAuctionDetails } from '../../utils/opensea.ts'
import { AuctionListItem } from './auctionListItem/auctionListItem.tsx'
import css from './browsePage.module.scss'

export function BrowsePage() {
	const tagsContext = useContext(TagsContext)

	const auctionsQuery = useQuery({
		queryKey: ReactQueryKey.auctions,
		queryFn: async () => {
			return await BackendApi.getAuctions().then(auctions =>
				Promise.all(
					auctions.map(async auction => ({
						auction,
						details: await getAuctionDetails({ auctionId: auction.id }),
					})),
				),
			)
		},
	})

	return (
		<Layout>
			<div className={css.root}>
				<div className={css.sidebar}>
					<SectionHeader>Filter by Expertise</SectionHeader>

					{tagsContext?.data ? (
						<>
							<div className={css.tagList}>
								{tagsContext.data.slice(0, 7).map(tag => (
									<Button key={tag} size={ButtonSize.SMALL} look={ButtonLook.SECONDARY}>
										{tag}
									</Button>
								))}
							</div>

							<a className={css.sidebarMoreButton} href="/">
								More ↓
							</a>
						</>
					) : (
						<SpinningLoader />
					)}
				</div>

				<div className={css.content}>
					{auctionsQuery.data ? (
						<>
							<div className={css.list}>
								<AuctionListItem />
								<AuctionListItem />
								<AuctionListItem />
							</div>

							<a className={css.moreButton} href="/">
								Show more experts ↓
							</a>
						</>
					) : auctionsQuery.isLoading ? (
						<SpinningLoader />
					) : (
						'Failed to load 😟'
					)}
				</div>
			</div>
		</Layout>
	)
}
