import { ReactNode } from 'react'

import { Spinner } from '../spinner/spinner.tsx'
import css from './loaders.module.scss'

interface SpinningLoaderProps {
	reason?: ReactNode
}

export function SpinningLoader({ reason }: SpinningLoaderProps) {
	return (
		<div className={css.spinningLoader}>
			<Spinner />
			{reason ?? 'Loading ...'}
		</div>
	)
}
