import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BrowsePage } from './pages/browsePage/browsePage.tsx'
import { RoutePath } from './routePath.ts'
import { DashboardPage } from './pages/dashboardPage/dashboardPage.tsx'

export function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={RoutePath.ROOT} element={<BrowsePage />} />

				<Route path={RoutePath.DASHBOARD} element={<DashboardPage />} />
			</Routes>
		</BrowserRouter>
	)
}
