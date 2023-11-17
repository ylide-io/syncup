import css from './auctionListItem.module.scss'
import { Button } from '../../../components/button/button.tsx'
import { NBSP } from '../../../global.ts'
import { RoutePath } from '../../../routePath.ts'
import { ProfilePhoto } from '../../../components/profilePhoto/profilePhoto.tsx'

export function AuctionListItem() {
	return (
		<div className={css.root}>
			<ProfilePhoto />

			<div className={css.details}>
				<div className={css.name}>Bryan Wilcox</div>

				<div>
					Co-Founder & CTO{NBSP}
					{NBSP}·{NBSP}
					{NBSP}Philz Coffee
				</div>

				<div className={css.bio}>
					Bryan Wilcox is a co-founder and the former CTO of Tovala, a food-tech company that saves people
					time with a smart oven and paired meal service. Tovala has raised $70M in venture funding from Y
					Combinator, Comcast Ventures, Interplay, Origin Ventures and Left Lane Capital. Prior to Tovala,
					Bryan worked with GE, John Deere, and Whirlpool before earning his PhD in Mechanical Engineering
					from the University of Illinois. Bryan founded 2 other companies, including The Product Manufactory,
					where he still consults on product development. He advises startup founders on business leadership,
					company culture, and developing great technology products.
				</div>

				<div className={css.footer}>
					<Button href={RoutePath.AUCTION}>Details ►</Button>

					<div>
						Auction ending in <b>5 days 20 hours</b>
					</div>
				</div>
			</div>
		</div>
	)
}
