import { useMutation, useQuery } from '@tanstack/react-query'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import clsx from 'clsx'
import { OrderV2 } from 'opensea-js/lib/orders/types'
import { useContext, useState } from 'react'
import { generatePath, useParams } from 'react-router-dom'

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
import { FILTER_BY_TAG_PARAM, RoutePath } from '../../routePath.ts'
import { invariant } from '../../utils/assert.ts'
import { getCurrentPrice, getHighestBidPrice, getNextPrice, placeBid } from '../../utils/auction.tsx'
import { DateFormatStyle, formatDate, formatDuration } from '../../utils/date.ts'
import { formatCryptoAmount } from '../../utils/number.ts'
import { cancelBid, getUserBids } from '../../utils/opensea.ts'
import { truncateAddress } from '../../utils/string.ts'
import { buildUrl } from '../../utils/url.ts'
import css from './auctionPage.module.scss'

const FOLDED_HISTORY_SIZE = 3

export function AuctionPage() {
	const { nftId } = useParams<{ nftId: string }>()
	invariant(nftId)

	const cryptoContext = useContext(CryptoContext)
	const { address, authToken, createAuthToken } = useContext(AuthContext)
	const { open } = useWeb3Modal()

	const slotQuery = useQuery({
		queryKey: ReactQueryKey.auction(nftId, address),
		queryFn: async () => {
			const [slot, userBids] = await Promise.all([
				BackendApi.getSlot({ tokenId: nftId }),
				address ? getUserBids({ address, nftIds: [nftId] }) : null,
			])

			const bids = slot.bids?.map(b => b.data)
			const highestBidPrice = getHighestBidPrice(bids)
			const currentPrice = getCurrentPrice(slot.ask, bids)

			console.log('slot', slot)
			console.log('userBids', userBids)
			console.log('currentPrice', currentPrice)

			return { slot, userBids, highestBidPrice, currentPrice }
		},
		staleTime: 60 * 1000,
	})

	const { slot, userBids, highestBidPrice, currentPrice } = slotQuery.data || {}

	const [isHistoryExpanded, setHistoryExpanded] = useState(true)
	const isHistoryFolded = slot?.bids && slot.bids.length > FOLDED_HISTORY_SIZE && !isHistoryExpanded

	const nextPrice = getNextPrice(highestBidPrice || currentPrice)

	const placeBidMutation = useMutation({
		mutationFn: async () => {
			await placeBid({
				authToken,
				tokenId: nftId,
				price: nextPrice,
			})

			slotQuery.refetch()
		},
		onError: e => {
			console.log(e)
			alert(['Failed to create a bid', e.message].filter(Boolean).join('\n\n'))
		},
	})

	const cancelBidMutation = useMutation({
		mutationFn: async (bid: OrderV2) => {
			const orderHash = bid.orderHash
			invariant(orderHash)

			if (!confirm('Are you sure you want to cancel your bid?')) return

			await cancelBid({ bid })
			await BackendApi.deleteBid({ bearer: authToken, orderHash })

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
										<Button
											key={tag.name}
											size={ButtonSize.SMALL}
											look={ButtonLook.SECONDARY}
											href={buildUrl({
												path: generatePath(RoutePath.ROOT),
												search: {
													[FILTER_BY_TAG_PARAM]: tag.name,
												},
											})}
										>
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
							<>
								{authToken ? (
									<Button
										className={css.bidButton}
										size={ButtonSize.LARGE}
										isLoading={placeBidMutation.isPending}
										onClick={() => placeBidMutation.mutate()}
									>
										Place a Bid / {formatCryptoAmount(nextPrice)} ETH ►
									</Button>
								) : (
									<Button
										className={css.bidButton}
										size={ButtonSize.LARGE}
										isLoading={placeBidMutation.isPending}
										onClick={() => (address ? createAuthToken() : open())}
									>
										Sign Up to Place a Bid
									</Button>
								)}
							</>
						)}

						<div className={clsx(css.history, isHistoryFolded && css.history_folded)}>
							<SectionHeader>History</SectionHeader>

							{slot.bids?.length ? (
								<>
									<div className={css.historyList}>
										{[...slot.bids]
											.reverse()
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
