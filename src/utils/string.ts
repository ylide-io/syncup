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

export function formatAddress(address: string) {
	return (
		address
			.toLowerCase()
			// 000000000000000000000000d3c2b7b1ebcd6949abcf1041cc629b2648ad2329 -> 0xd3c2b7b1ebcd6949abcf1041cc629b2648ad2329
			.replace(/^0{24}/, '0x')
			// 3f4dcce76d4760fb23879fee1a28f278b0739f99c13911094418c042fb7fbc45 -> 0:3f4dcce76d4760fb23879fee1a28f278b0739f99c13911094418c042fb7fbc45
			.replace(/^([a-f0-9]{64})$/i, '0:$1')
	)
}
