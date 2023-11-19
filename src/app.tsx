import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuctionPage } from './pages/auctionPage/auctionPage.tsx'
import { BrowsePage } from './pages/browsePage/browsePage.tsx'
import { DashboardPage } from './pages/dashboardPage/dashboardPage.tsx'
import { RoutePath } from './routePath.ts'
import { Web3ModalManager } from './utils/walletconnect.tsx'

export function App() {
	return (
		<Web3ModalManager>
			<BrowserRouter>
				<Routes>
					<Route path={RoutePath.ROOT} element={<BrowsePage />} />
					<Route path={RoutePath.AUCTION} element={<AuctionPage />} />
					<Route path={RoutePath.DASHBOARD} element={<DashboardPage />} />
				</Routes>
			</BrowserRouter>
		</Web3ModalManager>
	)
}
