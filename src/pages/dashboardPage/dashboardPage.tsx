import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { SectionHeader } from '../../components/components.tsx'
import { Layout } from '../../components/layout/layout.tsx'
import { invariant } from '../../utils/assert.ts'
import { getAllNfts, getUserBids } from '../../utils/opensea.ts'
import css from './dashboardPage.module.scss'
import { MyAuction } from './myAuction/myAuction.tsx'

export function DashboardPage() {
	const { address } = useAccount()

	const userBidsQuery = useQuery({
		enabled: !!address,
		queryKey: ['bids', 'user', address],
		queryFn: async () => {
			invariant(address)
			const allNfts = await getAllNfts()
			const bids = await getUserBids({
				address: '0x37d524c92b46277d9167fe936e45baa4f0568a73',
				auctionIds: allNfts.nfts.map(nft => nft.identifier),
			})
			console.log('allNfts', allNfts)
			console.log('bids', bids)
			return bids
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
