import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BrowsePage } from './pages/browsePage/browsePage.tsx'

export function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<BrowsePage />} />
			</Routes>
		</BrowserRouter>
	)
}
