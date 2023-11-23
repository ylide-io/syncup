import { useQuery } from '@tanstack/react-query'
import { BigNumber } from 'ethers'
import { createContext, PropsWithChildren, useMemo } from 'react'

import { ReactQueryKey } from '../../global.ts'
import { invariant } from '../../utils/assert.ts'
import { formatCryptoAmount, formatFiat } from '../../utils/number.ts'

export interface CryptoContextApi {
	getUsdPrice: (amount: BigNumber) => string | undefined
}

export const CryptoContext = createContext({} as CryptoContextApi)

export function CryptoContextProvider({ children }: PropsWithChildren) {
	const ratesQuery = useQuery({
		queryKey: ReactQueryKey.rates,
		queryFn: async () => {
			const res = await fetch('https://coins.llama.fi/prices/current/coingecko:ethereum')
			invariant(res.ok)

			const json = (await res.json()) as {
				coins: { 'coingecko:ethereum': { price: number; symbol: 'ETH'; timestamp: number; confidence: number } }
			}

			return {
				ETH: json.coins['coingecko:ethereum'].price,
			}
		},
	})

	const api = useMemo<CryptoContextApi>(
		() => ({
			getUsdPrice: amount => {
				if (ratesQuery.data) {
					return formatFiat(+formatCryptoAmount(amount) * ratesQuery.data.ETH)
				}
			},
		}),
		[ratesQuery.data],
	)

	return <CryptoContext.Provider value={api}>{children}</CryptoContext.Provider>
}
