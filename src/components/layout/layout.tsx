import css from './layout.module.scss'
import { PropsWithChildren } from 'react'
import LogoSvg from './logo.svg'
import { Button } from '../button/button.tsx'

type LayoutProps = PropsWithChildren

export function Layout({ children }: LayoutProps) {
	return (
		<div className={css.root}>
			<div className={css.header}>
				<LogoSvg />

				<div className={css.headerRight}>
					<a href="/">Browse Auctions</a>
					<a href="/">Dashboard</a>
					<Button>SIGN UP</Button>
				</div>
			</div>

			<div className={css.content}>{children}</div>

			<div className={css.footer}>
				<div className={css.footerTags}>
					{[
						'B2B Sales',
						'B2C Sales',
						'Bootstrapping',
						'Financial Planning',
						'Fundraising',
						'Growth Marketing',
						'Manufacturing',
						'People & Hiring',
						'Product & Engineering',
						'Product Marketing',
						'Public Relations',
						'SEM & SEO',
						'Social Media',
						'Strategy & Operations',
						'Growth Marketing',
					].map(tag => (
						<a key={tag} href="/">
							{tag}
						</a>
					))}
				</div>

				<div className={css.footerBottom}>
					<div>© 2023 SyncdUp, Inc.</div>

					<div className={css.footerBottomRight}>
						<a href="/">Terms of Service</a>
						<a href="/">Privacy Policy</a>
					</div>
				</div>
			</div>
		</div>
	)
}
