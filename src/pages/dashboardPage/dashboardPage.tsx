import css from './dashboardPage.module.scss'
import { Layout } from '../../components/layout/layout.tsx'
import { SectionHeader } from '../../components/components.tsx'
import { MyAuction } from './myAuction/myAuction.tsx'

export function DashboardPage() {
	return (
		<Layout>
			<div className={css.root}>
				<div className={css.title}>My Dashboard</div>

				<div className={css.content}>
					<div className={css.section}>
						<SectionHeader>Active Auctions</SectionHeader>
						<MyAuction />
					</div>

					<div className={css.section}>
						<SectionHeader>Participation History</SectionHeader>
						<MyAuction />
						<MyAuction />
					</div>
				</div>
			</div>
		</Layout>
	)
}
