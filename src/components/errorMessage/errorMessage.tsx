import clsx from 'clsx'
import { PropsWithChildren } from 'react'

import { PropsWithClassName } from '../props.ts'
import css from './errorMessage.module.scss'

interface ErrorMessageProps extends PropsWithChildren, PropsWithClassName {}

export function ErrorMessage({ children, className }: ErrorMessageProps) {
	return <div className={clsx(css.root, className)}>{children}</div>
}
