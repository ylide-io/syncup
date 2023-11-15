import css from './browsePage.module.scss'
import { Layout } from '../../components/layout/layout.tsx'
import { SectionHeader } from '../../components/components.tsx'
import { Button, ButtonLook, ButtonSize } from '../../components/button/button.tsx'
import { Auction } from './auction/auction.tsx'

export function BrowsePage() {
	return (
		<Layout>
			<div className={css.root}>
				<div className={css.sidebar}>
					<SectionHeader>Filter by Expertise</SectionHeader>

					<div className={css.tagList}>
						{[
							'B2B Sales',
							'Product & Engineering',
							'Bootstrapping',
							'Financial Planning',
							'Fundraising',
							'Growth Marketing',
							'Manufacturing',
						].map(tag => (
							<Button key={tag} size={ButtonSize.SMALL} look={ButtonLook.SECONDARY}>
								{tag}
							</Button>
						))}
					</div>

					<a className={css.sidebarMoreButton} href="/">
						More ↓
					</a>
				</div>

				<div className={css.content}>
					<div className={css.list}>
						<Auction />
						<Auction />
						<Auction />
					</div>

					<a className={css.moreButton} href="/">
						Show more experts ↓
					</a>
				</div>
			</div>
		</Layout>
	)
}
