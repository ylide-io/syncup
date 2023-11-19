import 'normalize.css'
import 'minireset.css'
import './main.scss'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './app.tsx'
import { invariant } from './utils/assert.ts'

const root = document.getElementById('root')
invariant(root)

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
