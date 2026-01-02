import { baseApi } from './baseApi'

// Типы для секций
export interface Section {
	id: number
	name: string
	image: string
	route?: string | null
	rest_time?: number | null // опциональное поле - время до окончания акции в секундах
}

export const sectionsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Получение всех секций
		getSections: builder.query<Section[], void>({
			query: () => '/sections',
			providesTags: ['Sections'],
		}),
	}),
})

// Экспортируем хуки для использования в компонентах
export const { useGetSectionsQuery } = sectionsApi
