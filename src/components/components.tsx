import css from './components.module.scss'
import { PropsWithChildren } from 'react'
import { PropsWithClassName } from './props.ts'
import clsx from 'clsx'

interface SectionHeaderProps extends PropsWithChildren, PropsWithClassName {}

export function SectionHeader({ children, className }: SectionHeaderProps) {
	return <div className={clsx(css.sectionHeader, className)}>{children}</div>
}
