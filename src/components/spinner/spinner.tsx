import clsx from 'clsx'

import { PropsWithClassName, PropsWithCSSStyle } from '../props'
import css from './spinner.module.scss'

export enum SpinnerLook {
	PRIMARY = 'PRIMARY',
	SECONDARY = 'SECONDARY',
}

export interface LoaderProps extends PropsWithClassName, PropsWithCSSStyle {
	look?: SpinnerLook
	size?: number | string
}

export function Spinner({ className, style, look, size }: LoaderProps) {
	const lookClass = {
		[SpinnerLook.PRIMARY]: css.root_primaryLook,
		[SpinnerLook.SECONDARY]: css.root_secondaryLook,
	}[look ?? SpinnerLook.PRIMARY]

	return (
		<div className={clsx(css.root, lookClass, className)} style={Object.assign({}, style, { width: size })}>
			<div className={css.inner}>
				<svg className={css.svg} viewBox="0 0 20 20">
					<path d="M10 4C6.68629 4 4 6.68629 4 10C4 10.292 4.02078 10.5786 4.06081 10.8584C4.13902 11.4051 3.75921 11.9117 3.21249 11.9899C2.66577 12.0681 2.15917 11.6883 2.08096 11.1416C2.02756 10.7682 2 10.387 2 10C2 5.58172 5.58172 2 10 2C10.4074 2 10.8083 2.03054 11.2004 2.0896C11.7466 2.17187 12.1226 2.68129 12.0403 3.22741C11.9581 3.77353 11.4486 4.14956 10.9025 4.06729C10.6087 4.02303 10.3074 4 10 4ZM16.7875 8.01008C17.3342 7.93187 17.8408 8.31168 17.919 8.8584C17.9724 9.23176 18 9.61296 18 10C18 14.4183 14.4183 18 10 18C9.61296 18 9.23176 17.9724 8.8584 17.919C8.31168 17.8408 7.93187 17.3342 8.01008 16.7875C8.08828 16.2408 8.59488 15.861 9.1416 15.9392C9.42144 15.9792 9.708 16 10 16C13.3137 16 16 13.3137 16 10C16 9.708 15.9792 9.42144 15.9392 9.1416C15.861 8.59488 16.2408 8.08828 16.7875 8.01008Z" />
				</svg>
			</div>
		</div>
	)
}
