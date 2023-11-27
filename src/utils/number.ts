import { BigNumber, utils } from 'ethers'

const LOCALE = 'en-US'

export function formatCryptoAmount(value: BigNumber) {
	return utils.formatUnits(value, 18)
}

export const usdFormat = new Intl.NumberFormat(LOCALE, {
	// https://stackoverflow.com/questions/41045270/range-error-with-tolocalestring-with-maximumnumber-of-digits-0
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

export function formatFiat(value: number) {
	return usdFormat.format(value)
}

export function compareBigNumbers(a: BigNumber, b: BigNumber) {
	return a.gt(b) ? 1 : a.lt(b) ? -1 : 0
}
