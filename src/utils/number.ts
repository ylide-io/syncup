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

const oneBN: BigNumber = utils.parseUnits('1', 18)

export function multiplyBigNumber(bn: BigNumberish, number: number): BigNumber {
	const bnForSure = BigNumber.from(bn)
	const numberBN = utils.parseUnits(number.toString(), 18)

	return bnForSure.mul(numberBN).div(oneBN)
}

export function divideBigNumber(bn: BigNumberish, number: number): BigNumber {
	const bnForSure = BigNumber.from(bn)
	const numberBN = utils.parseUnits(number.toString(), 18)

	return bnForSure.div(numberBN).div(oneBN)
}
