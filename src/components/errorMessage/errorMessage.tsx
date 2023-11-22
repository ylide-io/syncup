import { PropsWithChildren } from 'react'

import css from './errorMessage.module.scss'

type ErrorMessageProps = PropsWithChildren

export function ErrorMessage({ children }: ErrorMessageProps) {
	return <div className={css.root}>{children}</div>
}
