import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

// Базовый API с настройками
export const baseApi = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
		prepareHeaders: (headers, { getState }) => {
			// Получаем токен из state
			const token = (getState() as RootState).auth.token

			// Если есть токен - добавляем в заголовки
			if (token) {
				headers.set('Authorization', `Bearer ${token}`)
			}

			return headers
		},
	}),
	tagTypes: [
		'Sections',
		'Categories',
		'Products',
		'Cart',
		'Bonus',
		'SiteSettings',
		'Reviews',
		'PromoCodes',
		'AdminBanners',
		'AdminBonus',
		'AdminStats',
	],
	// Отключаем кеширование глобально - всегда будет свежий запрос
	keepUnusedDataFor: 0,
	// Всегда делаем новый запрос при монтировании компонента
	refetchOnMountOrArgChange: true,
	endpoints: () => ({}),
})
