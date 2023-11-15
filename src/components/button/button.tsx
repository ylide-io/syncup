import css from './button.module.scss'
import { forwardRef, HTMLAttributes, PropsWithChildren, ReactNode, Ref } from 'react'
import clsx from 'clsx'
import { PropsWithClassName } from '../props.ts'
import { useNavigate } from 'react-router-dom'
import { isExternalUrl } from '../../utils/url.ts'
import { Spinner } from '../spinner/spinner.tsx'

export enum ButtonSize {
	SMALL = 'SMALL',
	MEDIUM = 'MEDIUM',
	LARGE = 'LARGE',
}

export enum ButtonLook {
	PRIMARY = 'PRIMARY',
	SECONDARY = 'SECONDARY',
}

interface ButtonProps extends PropsWithChildren, PropsWithClassName, HTMLAttributes<HTMLElement> {
	size?: ButtonSize
	look?: ButtonLook
	icon?: ReactNode
	href?: string
	isSingleLine?: boolean
	isDisabled?: boolean
	isLoading?: boolean
}

export const Button = forwardRef(
	(
		{
			children,
			className,
			size,
			look,
			icon,
			href,
			onClick,
			isSingleLine,
			isDisabled,
			isLoading,
			...props
		}: ButtonProps,
		ref: Ref<HTMLButtonElement & HTMLAnchorElement>,
	) => {
		const navigate = useNavigate()

		const sizeClass = {
			[ButtonSize.SMALL]: css.root_smallSize,
			[ButtonSize.MEDIUM]: css.root_mediumSize,
			[ButtonSize.LARGE]: css.root_largeSize,
		}[size ?? ButtonSize.MEDIUM]

		const lookClass = {
			[ButtonLook.PRIMARY]: css.root_primaryLook,
			[ButtonLook.SECONDARY]: css.root_secondaryLook,
		}[look ?? ButtonLook.PRIMARY]

		const Component = href ? 'a' : 'button'
		const externalHref = !!href && isExternalUrl(href)
		const target = externalHref ? '_blank' : undefined
		const rel = externalHref ? 'noreferrer' : undefined

		return (
			<Component
				ref={ref}
				className={clsx(
					css.root,
					sizeClass,
					lookClass,
					icon != null && css.root_hasIcon,
					children != null && css.root_hasContent,
					(isDisabled || isLoading) && css.root_disabled,
					isSingleLine && css.root_singleline,
					isLoading && css.root_loading,
					className,
				)}
				disabled={isDisabled || isLoading}
				href={href}
				target={target}
				rel={rel}
				onClick={e => {
					onClick?.(e)

					if (href && !externalHref) {
						e.preventDefault()
						navigate(href)
					}
				}}
				{...props}
			>
				{icon && <div className={css.icon}>{icon}</div>}
				{children != null && <div className={css.content}>{children}</div>}
				{isLoading && <Spinner className={css.loader} />}
			</Component>
		)
	},
)
