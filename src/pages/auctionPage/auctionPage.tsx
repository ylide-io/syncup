import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { OrderV2 } from 'opensea-js/lib/orders/types'
import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { BackendApi } from '../../api/backendApi.ts'
import { AuthContext } from '../../components/authContext/authContext.tsx'
import { Button, ButtonLook, ButtonSize } from '../../components/button/button.tsx'
import { SectionHeader } from '../../components/components.tsx'
import { CryptoContext } from '../../components/cryptoContext/cryptoContext.tsx'
import { ErrorMessage } from '../../components/errorMessage/errorMessage.tsx'
import { Layout } from '../../components/layout/layout.tsx'
import { SpinningLoader } from '../../components/loaders/loaders.tsx'
import { ProfilePhoto } from '../../components/profilePhoto/profilePhoto.tsx'
import { DASH, ReactQueryKey } from '../../global.ts'
import { invariant } from '../../utils/assert.ts'
import { getCurrentPrice, placeBid } from '../../utils/auction.tsx'
import { DateFormatStyle, formatDate, formatDuration } from '../../utils/date.ts'
import { formatCryptoAmount } from '../../utils/number.ts'
import { cancelBid, getUserBids } from '../../utils/opensea.ts'
import { truncateAddress } from '../../utils/string.ts'
import css from './auctionPage.module.scss'

const FOLDED_HISTORY_SIZE = 3

export function AuctionPage() {
	const { nftId } = useParams<{ nftId: string }>()
	invariant(nftId)

	const cryptoContext = useContext(CryptoContext)
	const authContext = useContext(AuthContext)
	const { address } = useAccount()

	const slotQuery = useQuery({
		queryKey: ReactQueryKey.auction(nftId, address),
		queryFn: async () => {
			const [slot, userBids] = await Promise.all([
				BackendApi.getSlot({ tokenId: nftId }),
				address ? getUserBids({ address, nftIds: [nftId] }) : null,
			])

			const currentPrice = getCurrentPrice(slot.ask, slot.bids?.map(b => b.data))

			console.log('slot', slot)
			console.log('userBids', userBids)
			console.log('currentPrice', currentPrice)

			return { slot, userBids, currentPrice }
		},
		staleTime: 60 * 1000,
	})

	const { slot, userBids, currentPrice } = slotQuery.data || {}

	const [isHistoryExpanded, setHistoryExpanded] = useState(true)
	const isHistoryFolded = slot?.bids && slot.bids.length > FOLDED_HISTORY_SIZE && !isHistoryExpanded

	const placeBidMutation = useMutation({
		mutationFn: async () => {
			await placeBid({ authToken: authContext.authToken, tokenId: nftId })

			slotQuery.refetch()
		},
	})

	const cancelBidMutation = useMutation({
		mutationFn: async (bid: OrderV2) => {
			const orderHash = bid.orderHash
			invariant(orderHash)

			if (!confirm('Are you sure you want to cancel your bid?')) return

			await cancelBid({ bid })
			await BackendApi.deleteBid({ bearer: authContext.authToken, orderHash })

			slotQuery.refetch()
		},
	})

	return (
		<Layout>
			{slot ? (
				<div className={css.root}>
					<div className={css.sidebar}>
						<ProfilePhoto url={slot.expert.imgUrl} />

						{!!(slot.expert.position || slot.expert.company) && (
							<div className={css.position}>
								<div>{slot.expert.position}</div>
								{slot.expert.company}
							</div>
						)}

						{!!slot.expert.achievements.length && (
							<div className={css.achievements}>
								{slot.expert.achievements.map((a, i) => (
									<div key={i}>· {a}</div>
								))}
							</div>
						)}

						{!!slot.expert.tags?.length && (
							<div className={css.tags}>
								<SectionHeader>Expertise</SectionHeader>

								<div className={css.tagsList}>
									{slot.expert.tags.map(tag => (
										<Button key={tag.name} size={ButtonSize.SMALL} look={ButtonLook.SECONDARY}>
											{tag.name}
										</Button>
									))}
								</div>
							</div>
						)}
					</div>

					<div>
						<h1 className={css.name}>{slot.expert.name}</h1>

						<div className={css.bio}>{slot.expert.description}</div>

						<div className={css.info}>
							{currentPrice && (
								<div>
									<SectionHeader>Current Bid</SectionHeader>
									<div className={css.infoValue}>{formatCryptoAmount(currentPrice)} ETH</div>
									<div className={css.infoSubvalue}>
										~{cryptoContext.getUsdPrice(currentPrice)} USD
									</div>
								</div>
							)}

							{slot.ask.finalized ? (
								<div>
									<SectionHeader>Ended</SectionHeader>
									<div className={css.infoValue}>
										{slot.ask.closingDate
											? `${formatDuration(Date.now() - Date.parse(slot.ask.closingDate))} ago`
											: DASH}
									</div>
									<div className={css.infoSubvalue}>
										{slot.ask.closingDate
											? formatDate(slot.ask.closingDate, DateFormatStyle.LONG)
											: DASH}
									</div>
								</div>
							) : (
								<div>
									<SectionHeader>Ending In</SectionHeader>
									<div className={css.infoValue}>
										{slot.ask.closingDate
											? formatDuration(Date.now() - Date.parse(slot.ask.closingDate))
											: DASH}
									</div>
									<div className={css.infoSubvalue}>
										{slot.ask.closingDate
											? formatDate(slot.ask.closingDate, DateFormatStyle.LONG)
											: DASH}
									</div>
								</div>
							)}
						</div>

						{slot.ask.finalized || (
							<Button
								className={css.bidButton}
								size={ButtonSize.LARGE}
								isLoading={placeBidMutation.isPending}
								onClick={() => placeBidMutation.mutate()}
							>
								Place a Bid ►
							</Button>
						)}

						<div className={clsx(css.history, isHistoryFolded && css.history_folded)}>
							<SectionHeader>History</SectionHeader>

							{slot.bids?.length ? (
								<>
									<div className={css.historyList}>
										{slot.bids
											.slice(0, isHistoryFolded ? FOLDED_HISTORY_SIZE : slot.bids.length)
											.map((bid, i) => {
												const order = bid.data
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
															)}

															{userBids?.orders.some(
																b => b.orderHash === bid.orderHash,
															) && (
																<>
																	{' · '}

																	{cancelBidMutation.isPending &&
																	cancelBidMutation.variables === bid.data ? (
																		'Loading...'
																	) : (
																		<a
																			onClick={() =>
																				cancelBidMutation.mutate(bid.data)
																			}
																		>
																			Cancel
																		</a>
																	)}
																</>
															)}
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
