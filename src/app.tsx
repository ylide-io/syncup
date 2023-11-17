import { useWeb3ModalTheme } from '@web3modal/wagmi/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { WagmiConfig } from 'wagmi'

import { AuctionPage } from './pages/auctionPage/auctionPage.tsx'
import { BrowsePage } from './pages/browsePage/browsePage.tsx'
import { DashboardPage } from './pages/dashboardPage/dashboardPage.tsx'
import { RoutePath } from './routePath.ts'
import { setupWeb3Modal } from './utils/walletconnect.tsx'

const wagmiConfig = setupWeb3Modal()

export function App() {
	const { setThemeVariables } = useWeb3ModalTheme()

	setThemeVariables({
		'--w3m-accent': '#f8cb53',
	})

	return (
		// @ts-expect-error config
		<WagmiConfig config={wagmiConfig}>
			<BrowserRouter>
				<Routes>
					<Route path={RoutePath.ROOT} element={<BrowsePage />} />
					<Route path={RoutePath.AUCTION} element={<AuctionPage />} />
					<Route path={RoutePath.DASHBOARD} element={<DashboardPage />} />
				</Routes>
			</BrowserRouter>
		</WagmiConfig>
	)
}
