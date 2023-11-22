import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'

import { BackendApi } from '../../api/backendApi.ts'
import { Button, ButtonLook, ButtonSize } from '../../components/button/button.tsx'
import { SectionHeader } from '../../components/components.tsx'
import { CryptoContext } from '../../components/cryptoContext/cryptoContext.tsx'
import { ErrorMessage } from '../../components/errorMessage/errorMessage.tsx'
import { Layout } from '../../components/layout/layout.tsx'
import { SpinningLoader } from '../../components/loaders/loaders.tsx'
import { ProfilePhoto } from '../../components/profilePhoto/profilePhoto.tsx'
import { ReactQueryKey } from '../../global.ts'
import ExternalSvg from '../../icons/external.svg'
import { invariant } from '../../utils/assert.ts'
import { DateFormatStyle, formatDate } from '../../utils/date.ts'
import { formatCryptoAmount, formatFiat } from '../../utils/number.ts'
import { getBids, getLatestAsk } from '../../utils/opensea.ts'
import { truncateAddress } from '../../utils/string.ts'
import css from './auctionPage.module.scss'
import getExperts = BackendApi.getExperts

const FOLDED_HISTORY_SIZE = 3

export function AuctionPage() {
	const { nftId } = useParams<{ nftId: string }>()
	invariant(nftId)

	const cryptoContext = useContext(CryptoContext)

	const auctionQuery = useQuery({
		queryKey: ReactQueryKey.auction(nftId),
		queryFn: async () => {
			const [experts, latestAsk, bids] = await Promise.all([
				getExperts(),
				getLatestAsk({ nftId }),
				getBids({ nftId }),
			])
			console.log('experts', experts)
			console.log('bids', bids)

			const expert = experts.find(expert => expert.slots.some(slot => slot.tokenId === nftId))
			invariant(expert)

			return {
				expert,
				latestAsk,
				bids,
			}
		},
		staleTime: 60 * 1000,
	})

	const data = auctionQuery.data

	const [isHistoryExpanded, setHistoryExpanded] = useState(true)
	const isHistoryFolded = data && data.bids.orders.length > FOLDED_HISTORY_SIZE && !isHistoryExpanded

	return (
		<Layout>
			{data ? (
				<div className={css.root}>
					<div className={css.sidebar}>
						<ProfilePhoto url={data.expert.imgUrl} />

						{!!(data.expert.position || data.expert.company) && (
							<div className={css.position}>
								<div>{data.expert.position}</div>
								{data.expert.company}
							</div>
						)}

						{!!data.expert.achievements.length && (
							<div className={css.achievements}>
								{data.expert.achievements.map((a, i) => (
									<div key={i}>· {a}</div>
								))}
							</div>
						)}

						{!!data.expert.tags.length && (
							<div className={css.tags}>
								<SectionHeader>Expertise</SectionHeader>

								<div className={css.tagsList}>
									{data.expert.tags.map(tag => (
										<Button key={tag.name} size={ButtonSize.SMALL} look={ButtonLook.SECONDARY}>
											{tag.name}
										</Button>
									))}
								</div>
							</div>
						)}
					</div>

					<div>
						<h1 className={css.name}>{data.expert.name}</h1>

						<div className={css.bio}>{data.expert.description}</div>

						{data.latestAsk ? (
							<>
								<div className={css.info}>
									<div>
										<SectionHeader>Current Bid</SectionHeader>
										<div className={css.infoValue}>3.5 ETH</div>
										<div className={css.infoSubvalue}>~6481 USD</div>
									</div>

									<div>
										<SectionHeader>Ending In</SectionHeader>
										<div className={css.infoValue}>4 days 3 hours</div>
										<div className={css.infoSubvalue}>Nov 20, 3:00 PM</div>
									</div>
								</div>

								<Button className={css.bidButton} size={ButtonSize.LARGE}>
									Place a Bid ►
								</Button>

								<div className={clsx(css.history, isHistoryFolded && css.history_folded)}>
									<SectionHeader>History</SectionHeader>

									<div className={css.historyList}>
										{data.bids.orders
											.slice(0, isHistoryFolded ? FOLDED_HISTORY_SIZE : data.bids.orders.length)
											.map((order, i) => {
												const amount = formatCryptoAmount(order.currentPrice)
												const amountUsd = cryptoContext.getUsdPrice(
													+formatCryptoAmount(order.currentPrice),
												)

												return (
													<div key={i} className={css.historyItem}>
														<div className={css.historyTitle}>
															Bid placed by {truncateAddress(order.maker.address, 12)}
														</div>
														<div className={css.historyPrice}>
															{amount} ETH
															{amountUsd && <div>~{formatFiat(amountUsd)} USD</div>}
														</div>
														<div className={css.historyDate} title={order.createdDate}>
															{formatDate(
																Date.parse(order.createdDate),
																DateFormatStyle.LONG,
															)}{' '}
															<a>
																<ExternalSvg />
															</a>
														</div>
													</div>
												)
											})}
									</div>

									{isHistoryFolded && <a onClick={() => setHistoryExpanded(true)}>Full History ↓</a>}
								</div>
							</>
						) : (
							<ErrorMessage className={css.errorMessage}>Auction ended 🔥</ErrorMessage>
						)}
					</div>
				</div>
			) : auctionQuery.isLoading ? (
				<SpinningLoader />
			) : (
				<ErrorMessage>Failed to load auction details 😟</ErrorMessage>
			)}
		</Layout>
	)
}
