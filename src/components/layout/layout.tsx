import { useWeb3Modal } from '@web3modal/wagmi/react'
import { PropsWithChildren, useContext } from 'react'
import { generatePath, Link } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { FILTER_BY_TAG_PARAM, RoutePath } from '../../routePath.ts'
import { truncateAddress } from '../../utils/string.ts'
import { buildUrl } from '../../utils/url.ts'
import { Button, ButtonLook } from '../button/button.tsx'
import { SpinningLoader } from '../loaders/loaders.tsx'
import { TagsContext } from '../tagsContext/tagsContext.tsx'
import css from './layout.module.scss'
import LogoSvg from './logo.svg'

type LayoutProps = PropsWithChildren

export function Layout({ children }: LayoutProps) {
	const tagsContext = useContext(TagsContext)
	const { open } = useWeb3Modal()
	const { address } = useAccount()

	return (
		<div className={css.root}>
			<div className={css.header}>
				<Link className={css.logo} to={generatePath(RoutePath.ROOT)}>
					<LogoSvg />
				</Link>

				<div className={css.headerRight}>
					<Link to={generatePath(RoutePath.ROOT)}>Browse Auctions</Link>
					<Link to={generatePath(RoutePath.DASHBOARD)}>Dashboard</Link>

					{address ? (
						<Button look={ButtonLook.SECONDARY} onClick={() => void open({ view: 'Account' })}>
							{truncateAddress(address)}
						</Button>
					) : (
						<Button onClick={() => void open({ view: 'Connect' })}>Sign Up</Button>
					)}
				</div>
			</div>

			<div className={css.content}>{children}</div>

			<div className={css.footer}>
				{tagsContext.data ? (
					<div className={css.footerTags}>
						{tagsContext.data.items.map(tag => (
							<Link
								key={tag}
								to={buildUrl({
									path: generatePath(RoutePath.ROOT),
									search: {
										[FILTER_BY_TAG_PARAM]: tag,
									},
								})}
							>
								{tag}
							</Link>
						))}
					</div>
				) : (
					<SpinningLoader />
				)}

				<div className={css.footerBottom}>
					<div>© 2023 SyncdUp, Inc.</div>

					<div className={css.footerBottomRight}>
						<Link to={generatePath(RoutePath.ROOT)}>Terms of Service</Link>
						<Link to={generatePath(RoutePath.ROOT)}>Privacy Policy</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
