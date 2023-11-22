import { PropsWithClassName } from '../props.ts'
import DefaultProfilePic from './default-profile-pic.png'
import css from './profilePhoto.module.scss'

interface ProfilePhotoProps extends PropsWithClassName {
	url?: string | null | undefined
}

export function ProfilePhoto({ className, url }: ProfilePhotoProps) {
	return (
		<div className={className}>
			<div className={css.inner}>
				<img alt="Profile" src={url || DefaultProfilePic} />
			</div>
		</div>
	)
}
