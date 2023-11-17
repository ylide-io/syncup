import clsx from 'clsx'
import { useState } from 'react'

import { Button, ButtonLook, ButtonSize } from '../../components/button/button.tsx'
import { SectionHeader } from '../../components/components.tsx'
import { Layout } from '../../components/layout/layout.tsx'
import { ProfilePhoto } from '../../components/profilePhoto/profilePhoto.tsx'
import ExternalSvg from '../../icons/external.svg'
import css from './auctionPage.module.scss'

export function AuctionPage() {
	const history = ['3.5', '3.0', '2.5', '2.0', '1.5', '1.0']
	const [isHistoryFolded, setHistoryFolded] = useState(true)

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

						<div className={css.historyList}>
							{history.slice(0, isHistoryFolded ? 3 : history.length).map((price, i) => (
								<div key={i} className={css.historyItem}>
									<div className={css.historyTitle}>Bid placed by 0x52e316e3..d80545ee</div>
									<div className={css.historyPrice}>
										{price} ETH
										<div>~6481 USD</div>
									</div>
									<div className={css.historyDate}>
										14 November 12:42{' '}
										<a>
											<ExternalSvg />
										</a>
									</div>
								</div>
							))}
						</div>

						{isHistoryFolded && (
							<a
								onClick={() => {
									setHistoryFolded(false)
								}}
							>
								Full History ↓
							</a>
						)}
					</div>
				</div>
			</div>
		</Layout>
	)
}
