import { useQuery } from '@tanstack/react-query'
import { BigNumber } from 'ethers'
import { useContext } from 'react'

import { BackendApi } from '../../api/backendApi.ts'
import { AuthContext } from '../../components/authContext/authContext.tsx'
import { SectionHeader } from '../../components/components.tsx'
import { ErrorMessage } from '../../components/errorMessage/errorMessage.tsx'
import { Layout } from '../../components/layout/layout.tsx'
import { SpinningLoader } from '../../components/loaders/loaders.tsx'
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

	const activeAuctions = userQuery.data
		?.filter(item => !item.data.finalized)
		// filter out duplicates
		.filter((auction, i, arr) => arr.findIndex(it => it.slot.tokenId === auction.slot.tokenId) === i)

	const pastAuctions = userQuery.data
		?.filter(item => item.data.finalized)
		// filter out duplicates
		.filter((auction, i, arr) => arr.findIndex(it => it.slot.tokenId === auction.slot.tokenId) === i)

	return (
		<Layout>
			<div className={css.root}>
				<div className={css.title}>My Dashboard</div>

				{userQuery.data ? (
					<div className={css.content}>
						<div className={css.section}>
							<SectionHeader>Active Auctions</SectionHeader>

							{activeAuctions?.length ? (
								activeAuctions.map(auction => (
									<MyAuction
										key={auction.orderHash}
										tokenId={auction.slot.tokenId}
										ask={auction.data}
										expert={auction.slot.expert}
										currentPrice={BigNumber.from(auction.ethAmount)}
										secretLink={auction.slot.link}
									/>
								))
							) : (
								<ErrorMessage>No auctions</ErrorMessage>
							)}
						</div>

						<div className={css.section}>
							<SectionHeader>Participation History</SectionHeader>

							{pastAuctions?.length ? (
								pastAuctions.map(auction => (
									<MyAuction
										key={auction.orderHash}
										tokenId={auction.slot.tokenId}
										ask={auction.data}
										expert={auction.slot.expert}
										currentPrice={BigNumber.from(auction.ethAmount)}
										secretLink={auction.slot.link}
									/>
								))
							) : (
								<ErrorMessage>No auctions</ErrorMessage>
							)}
						</div>
					</div>
				) : userQuery.isLoading ? (
					<SpinningLoader />
				) : (
					<ErrorMessage>Failed to load data 😟</ErrorMessage>
				)}
			</div>
		</Layout>
	)
}
