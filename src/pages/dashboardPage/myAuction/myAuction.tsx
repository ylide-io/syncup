import { Button, ButtonSize } from '../../../components/button/button.tsx'
import { ProfilePhoto } from '../../../components/profilePhoto/profilePhoto.tsx'
import { NBSP } from '../../../global.ts'
import css from './myAuction.module.scss'

export function MyAuction() {
	return (
		<div className={css.root}>
			<ProfilePhoto />

			<div className={css.details}>
				<div className={css.name}>Bryan Wilcox</div>

				<div>
					Current bid is <b>3.5 ETH</b>
					{NBSP}
					{NBSP}·{NBSP}
					{NBSP}Your bid is <b>2.0 ETH</b>
				</div>

				<div className={css.info}>
					<b>Congratulations!</b>
					<br />
					Your bid is the highest one!
					<br />
					<br />
					Here is the link to a call with Jason Feifer:
					<br />
					<a>https://us06web.zoom.us/j/83366087220</a>
					<br />
					<br />
					The call is scheduled for:
					<br />
					<b>November 20, 2023 at 3:00pm UTC</b>
					<br />
					<br />
					Don&apos;t be late ;)
				</div>

				<div className={css.footer}>
					<Button size={ButtonSize.SMALL}>Details ►</Button>

					<div>
						Ending in <b>5 days 20 hours</b>
					</div>
				</div>
			</div>
		</div>
	)
}
