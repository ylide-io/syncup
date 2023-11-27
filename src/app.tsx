import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthContextProvider } from './components/authContext/authContext.tsx'
import { BroswerStorageContextProvider } from './components/browserStorageContext/browserStorageContext.tsx'
import { CryptoContextProvider } from './components/cryptoContext/cryptoContext.tsx'
import { TagsContextProvider } from './components/tagsContext/tagsContext.tsx'
import { AuctionPage } from './pages/auctionPage/auctionPage.tsx'
import { BrowsePage } from './pages/browsePage/browsePage.tsx'
import { DashboardPage } from './pages/dashboardPage/dashboardPage.tsx'
import { RoutePath } from './routePath.ts'
import { Web3ModalManager } from './utils/walletconnect.tsx'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 10,
			retry: false,
			refetchOnWindowFocus: false,
		},
	},
})

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BroswerStorageContextProvider>
				<Web3ModalManager>
					<AuthContextProvider>
						<TagsContextProvider>
							<CryptoContextProvider>
								<BrowserRouter>
									<Routes>
										<Route path={RoutePath.ROOT} element={<BrowsePage />} />
										<Route path={RoutePath.AUCTION} element={<AuctionPage />} />
										<Route path={RoutePath.DASHBOARD} element={<DashboardPage />} />
									</Routes>
								</BrowserRouter>
							</CryptoContextProvider>
						</TagsContextProvider>
					</AuthContextProvider>
				</Web3ModalManager>
			</BroswerStorageContextProvider>
		</QueryClientProvider>
	)
}
