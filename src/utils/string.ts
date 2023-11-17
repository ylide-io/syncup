export enum TruncatePoint {
	// noinspection JSUnusedGlobalSymbols
	START = 'START',
	MIDDLE = 'MIDDLE',
	END = 'END',
}

export function truncate(string: string, opts: { maxLength: number; separator?: string; point?: TruncatePoint }) {
	const { maxLength: maxLengthRaw, separator, point } = opts

	const maxLength = Math.max(maxLengthRaw, 1)

	if (maxLength >= string.length) return string

	if (point === TruncatePoint.END) {
		return `${string.slice(0, maxLength)}${separator || ''}`
	}

	if (point === TruncatePoint.START) {
		return `${separator || ''}${string.slice(string.length - maxLength)}`
	}

	const targetLength = Math.max(maxLength, separator ? 2 : 1)
	const leftSize = Math.ceil(targetLength / 2)
	const rightSize = targetLength - leftSize

	if (rightSize) {
		const parts = [string.slice(0, leftSize), string.slice(-rightSize)]
		return parts.join(separator || '')
	} else {
		return string.slice(0, leftSize)
	}
}

export function truncateAddress(address: string, maxSignificantLength = 8, separator = '..') {
	const prefix = address.match(/^(0[x:])/i)?.[1] || ''
	return `${prefix}${truncate(address.slice(prefix.length), { maxLength: maxSignificantLength, separator })}`
}
