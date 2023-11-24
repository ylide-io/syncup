import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'

import { BackendApi } from '../../api/backendApi.ts'
import { AuthContext } from '../../components/authContext/authContext.tsx'
import { SectionHeader } from '../../components/components.tsx'
import { Layout } from '../../components/layout/layout.tsx'
import { ReactQueryKey } from '../../global.ts'
import css from './dashboardPage.module.scss'
import { MyAuction } from './myAuction/myAuction.tsx'

export function DashboardPage() {
	const { authToken } = useContext(AuthContext)

	const userQuery = useQuery({
		enabled: !!authToken,
		queryKey: ReactQueryKey.user(authToken),
		queryFn: async () => {
			const user = await BackendApi.getUser({ bearer: authToken })
			console.log('user', user)
			return user
		},
	})

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
