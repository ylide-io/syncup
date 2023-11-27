import { useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { generatePath, useSearchParams } from 'react-router-dom'

import { BackendApi } from '../../api/backendApi.ts'
import { Button, ButtonLook, ButtonSize } from '../../components/button/button.tsx'
import { SectionHeader } from '../../components/components.tsx'
import { ErrorMessage } from '../../components/errorMessage/errorMessage.tsx'
import { Layout } from '../../components/layout/layout.tsx'
import { SpinningLoader } from '../../components/loaders/loaders.tsx'
import { TagsContext } from '../../components/tagsContext/tagsContext.tsx'
import { ReactQueryKey } from '../../global.ts'
import { FILTER_BY_TAG_PARAM, RoutePath } from '../../routePath.ts'
import { buildUrl } from '../../utils/url.ts'
import { AuctionListItem } from './auctionListItem/auctionListItem.tsx'
import css from './browsePage.module.scss'

const SIDEBAR_TAG_COUNT = 7

export function BrowsePage() {
	const [searchParams] = useSearchParams()
	const filterByTag = searchParams.get(FILTER_BY_TAG_PARAM) || ''

	const tagsContext = useContext(TagsContext)

	const slotsQuery = useQuery({
		queryKey: ReactQueryKey.auctions(filterByTag),
		queryFn: async () => {
			const experts = await BackendApi.getExperts({ filterByTags: filterByTag ? [filterByTag] : undefined })
			const slots = experts
				.reduce<{ slot: BackendApi.GetExpertsSlot; expert: BackendApi.Expert }[]>((res, it) => {
					res.push(...it.slots.map(slot => ({ slot, expert: it })))
					return res
				}, [])
				.sort((a, b) => Date.parse(a.slot.ask.createdDate) - Date.parse(b.slot.ask.createdDate))
			console.log('slots', slots)
			return slots
		},
	})

	const [tagsCollapsed, setTagsCollapsed] = useState(true)

	return (
		<Layout>
			<div className={css.root}>
				<div className={css.sidebar}>
					<SectionHeader>Filter by Expertise</SectionHeader>

					{tagsContext.data ? (
						<>
							<div className={css.tagList}>
								{tagsContext.data.items
									.slice(0, tagsCollapsed ? SIDEBAR_TAG_COUNT : tagsContext.data.items.length)
									.map(tag => (
										<Button
											key={tag}
											size={ButtonSize.SMALL}
											look={tag === filterByTag ? ButtonLook.PRIMARY : ButtonLook.SECONDARY}
											href={buildUrl({
												path: generatePath(RoutePath.ROOT),
												search: {
													[FILTER_BY_TAG_PARAM]: tag,
												},
											})}
										>
											{tag}
										</Button>
									))}
							</div>

							{tagsCollapsed && tagsContext.data.items.length > SIDEBAR_TAG_COUNT && (
								<button className={css.sidebarMoreButton} onClick={() => setTagsCollapsed(false)}>
									More ↓
								</button>
							)}
						</>
					) : (
						<SpinningLoader />
					)}
				</div>

				<div className={css.content}>
					{slotsQuery.data?.length ? (
						<div className={css.list}>
							{slotsQuery.data.map(item => (
								<AuctionListItem
									key={item.slot.tokenId}
									nft={item.slot.nft}
									ask={item.slot.ask}
									expert={item.expert}
								/>
							))}
						</div>
					) : slotsQuery.data ? (
						<ErrorMessage>No auctions at the moment</ErrorMessage>
					) : slotsQuery.isLoading ? (
						<SpinningLoader />
					) : (
						<ErrorMessage>Failed to load 😟</ErrorMessage>
					)}
				</div>
			</div>
		</Layout>
	)
}
