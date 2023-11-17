import { PropsWithClassName } from '../props.ts'
import css from './profilePhoto.module.scss'

type ProfilePhotoProps = PropsWithClassName

export function ProfilePhoto({ className }: ProfilePhotoProps) {
	return (
		<div className={className}>
			<div className={css.inner}>
				<img alt="Profile" src="https://picsum.photos/id/474/800" />
			</div>
		</div>
	)
}
