import { BigNumber, BigNumberish, utils } from 'ethers'

const LOCALE = 'en-US'

export function formatCryptoAmount(value: BigNumberish) {
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

export function compareBigNumbers(a: BigNumberish, b: BigNumberish) {
	return BigNumber.from(a).gt(BigNumber.from(b)) ? 1 : BigNumber.from(a).lt(BigNumber.from(b)) ? -1 : 0
}
