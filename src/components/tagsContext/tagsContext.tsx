import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { createContext, PropsWithChildren } from 'react'

import { BackendApi } from '../../api/backendApi.ts'
import { ReactQueryKey } from '../../global.ts'

export const TagsContext = createContext({} as UseQueryResult<BackendApi.GetTagsResponse>)

export function TagsContextProvider({ children }: PropsWithChildren) {
	const tagsQuery = useQuery({
		queryKey: ReactQueryKey.tags,
		queryFn: () => BackendApi.getTags(),
	})

	return <TagsContext.Provider value={tagsQuery}>{children}</TagsContext.Provider>
}
