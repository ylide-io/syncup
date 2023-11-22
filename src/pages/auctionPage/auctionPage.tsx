import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'

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
import { getBids } from '../../utils/opensea.ts'
import { truncateAddress } from '../../utils/string.ts'
import css from './auctionPage.module.scss'

const FOLDED_HISTORY_SIZE = 3

export function AuctionPage() {
	const { auctionId } = useParams<{ auctionId: string }>()
	invariant(auctionId)

	const cryptoContext = useContext(CryptoContext)

	const bidsQuery = useQuery({
		queryKey: ReactQueryKey.auction(auctionId),
		queryFn: async () => {
			const bids = await getBids({ nftId: auctionId })
			console.log('bids', bids)
			return bids
		},
	})

	const [isHistoryExpanded, setHistoryExpanded] = useState(true)
	const isHistoryFolded = bidsQuery.data && bidsQuery.data.orders.length > FOLDED_HISTORY_SIZE && !isHistoryExpanded

	return (
		<Layout>
			<div className={css.root}>
				<div className={css.sidebar}>
					<ProfilePhoto />

					<div className={css.position}>
						<div>Co-Founder & CTO</div>
						Philz Coffee
					</div>

					<div className={css.achievements}>
						<div>· Raised $70 m+ in funding</div>
						<div>· Building hardware</div>
						<div>· Y Combinator alum</div>
					</div>

					<div className={css.tags}>
						<SectionHeader>Expertise</SectionHeader>

						<div className={css.tagsList}>
							<Button size={ButtonSize.SMALL} look={ButtonLook.SECONDARY}>
								Fundraising
							</Button>
							<Button size={ButtonSize.SMALL} look={ButtonLook.SECONDARY}>
								DeFi
							</Button>
						</div>
					</div>
				</div>

				<div>
					<h1 className={css.name}>Bryan Wilcox</h1>

					<div className={css.bio}>
						Bryan Wilcox is a co-founder and the former CTO of Tovala, a food-tech company that saves people
						time with a smart oven and paired meal service. Tovala has raised $70M in venture funding from Y
						Combinator, Comcast Ventures, Interplay, Origin Ventures and Left Lane Capital. Prior to Tovala,
						Bryan worked with GE, John Deere, and Whirlpool before earning his PhD in Mechanical Engineering
						from the University of Illinois. Bryan founded 2 other companies, including The Product
						Manufactory, where he still consults on product development. He advises startup founders on
						business leadership, company culture, and developing great technology products.
					</div>

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

						{bidsQuery.data ? (
							<>
								<div className={css.historyList}>
									{bidsQuery.data.orders
										.slice(0, isHistoryFolded ? FOLDED_HISTORY_SIZE : bidsQuery.data.orders.length)
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
							</>
						) : bidsQuery.isLoading ? (
							<SpinningLoader />
						) : (
							<ErrorMessage>Failed to load bids 😟</ErrorMessage>
						)}
					</div>
				</div>
			</div>
		</Layout>
	)
}
