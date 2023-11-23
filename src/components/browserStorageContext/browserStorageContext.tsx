import { createContext, PropsWithChildren, useMemo, useState } from 'react'

export enum BroswerStorageKey {
	AUTH_TOKEN = 'syncdup__auth_token',
}

//

function getJsonItem<T>(key: BroswerStorageKey, storage: Storage = localStorage): T | undefined {
	const value = storage.getItem(key)
	if (value) {
		return JSON.parse(value) as T
	}
}

function setJsonItem(key: BroswerStorageKey, value: any, storage: Storage = localStorage) {
	storage.setItem(key, JSON.stringify(value))
}

//

export interface BroswerStorageContextApi {
	getAuthToken: (address: string) => string
	setAuthToken: (address: string, token: string) => void
}

export const BroswerStorageContext = createContext({} as BroswerStorageContextApi)

export function BroswerStorageContextProvider({ children }: PropsWithChildren) {
	const [updateCounter, setUpdateCounter] = useState(0)

	const api = useMemo<BroswerStorageContextApi>(
		() => ({
			getAuthToken: address =>
				getJsonItem<Record<string, string>>(BroswerStorageKey.AUTH_TOKEN)?.[address.toLowerCase()] || '',
			setAuthToken: (address, token) => {
				const value = getJsonItem<Record<string, string>>(BroswerStorageKey.AUTH_TOKEN) || {}
				setJsonItem(BroswerStorageKey.AUTH_TOKEN, { ...value, [address.toLowerCase()]: token })
				setUpdateCounter(updateCounter + 1)
			},
		}),
		[updateCounter],
	)

	return <BroswerStorageContext.Provider value={api}>{children}</BroswerStorageContext.Provider>
}
