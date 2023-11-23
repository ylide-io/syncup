import { useQuery } from '@tanstack/react-query'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

import { BackendApi } from '../../api/backendApi.ts'
import { ReactQueryKey } from '../../global.ts'
import { invariant } from '../../utils/assert.ts'
import { BroswerStorageContext } from '../browserStorageContext/browserStorageContext.tsx'

export interface AuthContextApi {
	authToken: string | undefined
}

export const AuthContext = createContext({} as AuthContextApi)

export function AuthContextProvider({ children }: PropsWithChildren) {
	const storageContextApi = useContext(BroswerStorageContext)
	const { address } = useAccount()
	const { signMessageAsync } = useSignMessage()
	const authToken = address && storageContextApi.getAuthToken(address)

	useQuery({
		enabled: !!address && !authToken,
		queryKey: ReactQueryKey.auth(address || ''),
		queryFn: async () => {
			invariant(address)

			const { nonce } = await BackendApi.getAuthNonce({ address: address })
			console.log('nonce', nonce)
			invariant(nonce)

			const signature = await signMessageAsync({ message: nonce })
			console.log('signature', signature)
			invariant(signature)

			const { token } = await BackendApi.getAuthToken({ address: address, signature })
			console.log('token', token)
			invariant(token)

			storageContextApi.setAuthToken(address, token)
		},
	})

	const api = useMemo<AuthContextApi>(
		() => ({
			authToken,
		}),
		[authToken],
	)

	return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}
