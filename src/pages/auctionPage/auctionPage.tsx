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
import { DASH, ReactQueryKey } from '../../global.ts'
import ExternalSvg from '../../icons/external.svg'
import { invariant } from '../../utils/assert.ts'
import { DateFormatStyle, formatDate, formatDuration } from '../../utils/date.ts'
import { formatCryptoAmount } from '../../utils/number.ts'
import { truncateAddress } from '../../utils/string.ts'
import css from './auctionPage.module.scss'

const FOLDED_HISTORY_SIZE = 3

export function AuctionPage() {
	const { nftId } = useParams<{ nftId: string }>()
	invariant(nftId)

	const cryptoContext = useContext(CryptoContext)

	const slotQuery = useQuery({
		queryKey: ReactQueryKey.auction(nftId),
		queryFn: async () => {
			const slot = await BackendApi.getSlot({ tokenId: nftId })
			console.log('slot', slot)
			return slot
		},
		staleTime: 60 * 1000,
	})

	const data = slotQuery.data

	const [isHistoryExpanded, setHistoryExpanded] = useState(true)
	const isHistoryFolded = data?.bids && data.bids.length > FOLDED_HISTORY_SIZE && !isHistoryExpanded

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

						{!!data.expert.tags?.length && (
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

						<div className={css.info}>
							<div>
								<SectionHeader>Current Bid</SectionHeader>
								<div className={css.infoValue}>{formatCryptoAmount(data.ask.currentPrice)} ETH</div>
								<div className={css.infoSubvalue}>
									~{cryptoContext.getUsdPrice(data.ask.currentPrice)} USD
								</div>
							</div>

							{data.ask.finalized ? (
								<div>
									<SectionHeader>Ended</SectionHeader>
									<div className={css.infoValue}>
										{data.ask.closingDate
											? `${formatDuration(Date.now() - Date.parse(data.ask.closingDate))} ago`
											: DASH}
									</div>
									<div className={css.infoSubvalue}>
										{data.ask.closingDate
											? formatDate(data.ask.closingDate, DateFormatStyle.LONG)
											: DASH}
									</div>
								</div>
							) : (
								<div>
									<SectionHeader>Ending In</SectionHeader>
									<div className={css.infoValue}>
										{data.ask.closingDate
											? formatDuration(Date.now() - Date.parse(data.ask.closingDate))
											: DASH}
									</div>
									<div className={css.infoSubvalue}>
										{data.ask.closingDate
											? formatDate(data.ask.closingDate, DateFormatStyle.LONG)
											: DASH}
									</div>
								</div>
							)}
						</div>

						{data.ask.finalized || (
							<Button className={css.bidButton} size={ButtonSize.LARGE}>
								Place a Bid ►
							</Button>
						)}

						<div className={clsx(css.history, isHistoryFolded && css.history_folded)}>
							<SectionHeader>History</SectionHeader>

							{data.bids?.length ? (
								<>
									<div className={css.historyList}>
										{data.bids
											.slice(0, isHistoryFolded ? FOLDED_HISTORY_SIZE : data.bids.length)
											.map((order, i) => {
												const amount = formatCryptoAmount(order.currentPrice)
												const amountUsd = cryptoContext.getUsdPrice(order.currentPrice)

												return (
													<div key={i} className={css.historyItem}>
														<div className={css.historyTitle}>
															Bid placed by {truncateAddress(order.maker.address, 12)}
														</div>
														<div className={css.historyPrice}>
															{amount} ETH
															{amountUsd && <div>~{amountUsd} USD</div>}
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
								</>
							) : (
								<ErrorMessage>No bids yet</ErrorMessage>
							)}
						</div>
					</div>
				</div>
			) : slotQuery.isLoading ? (
				<SpinningLoader />
			) : (
				<ErrorMessage>Failed to load auction details 😟</ErrorMessage>
			)}
		</Layout>
	)
}
