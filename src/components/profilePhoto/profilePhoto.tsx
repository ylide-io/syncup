import clsx from 'clsx'

import { PropsWithClassName } from '../props.ts'
import css from './profilePhoto.module.scss'

type ProfilePhotoProps = PropsWithClassName

export function ProfilePhoto({ className }: ProfilePhotoProps) {
	return (
		<div className={clsx(css.root, className)}>
			<img alt="Profile" src="https://picsum.photos/id/474/800" />
		</div>
	)
}
