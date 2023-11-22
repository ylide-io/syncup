import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'

import { BackendApi } from '../../api/backendApi.ts'
import { Button, ButtonLook, ButtonSize } from '../../components/button/button.tsx'
import { SectionHeader } from '../../components/components.tsx'
import { Layout } from '../../components/layout/layout.tsx'
import { SpinningLoader } from '../../components/loaders/loaders.tsx'
import { TagsContext } from '../../components/tagsContext/tagsContext.tsx'
import { ReactQueryKey } from '../../global.ts'
import { getNftDetails } from '../../utils/opensea.ts'
import { AuctionListItem } from './auctionListItem/auctionListItem.tsx'
import css from './browsePage.module.scss'

const SIDEBAR_TAG_COUNT = 7

export function BrowsePage() {
	const tagsContext = useContext(TagsContext)

	const auctionsQuery = useQuery({
		queryKey: ReactQueryKey.auctions,
		queryFn: async () => {
			return await BackendApi.getExperts().then(experts =>
				Promise.all(
					experts.map(async expert => ({
						auction: expert,
						details: await getNftDetails({ auctionId: expert.id }),
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
