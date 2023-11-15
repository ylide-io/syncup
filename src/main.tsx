import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import 'normalize.css'
import 'minireset.css'
import './index.scss'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { invariant } from './utils/assert.ts'

const root = document.getElementById('root')
invariant(root)

const queryClient = new QueryClient()

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</React.StrictMode>,
)
