import { useWeb3Modal } from '@web3modal/wagmi/react'
import { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

import { RoutePath } from '../../routePath.ts'
import { Button } from '../button/button.tsx'
import css from './layout.module.scss'
import LogoSvg from './logo.svg'

type LayoutProps = PropsWithChildren

export function Layout({ children }: LayoutProps) {
	const { open } = useWeb3Modal()

	return (
		<div className={css.root}>
			<div className={css.header}>
				<a className={css.logo} href={RoutePath.ROOT}>
					<LogoSvg />
				</a>

				<div className={css.headerRight}>
					<Link to={RoutePath.ROOT}>Browse Auctions</Link>
					<Link to={RoutePath.DASHBOARD}>Dashboard</Link>
					<Button onClick={() => void open()}>Sign Up</Button>
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
