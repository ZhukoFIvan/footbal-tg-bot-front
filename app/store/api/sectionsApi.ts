import { baseApi } from './baseApi'

export interface Section {
	id: number
	name: string
	image: string
	route?: string | null
	rest_time?: number | null
}

export const sectionsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getSections: builder.query<Section[], void>({
			query: () => '/sections',
			providesTags: ['Sections'],
		}),
	}),
})

// Экспортируем хуки для использования в компонентах
export const { useGetSectionsQuery } = sectionsApi
