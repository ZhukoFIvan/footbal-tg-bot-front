import { baseApi } from './baseApi'

// Типы для товаров
export interface Badge {
	id: number
	title: string
	color: string
	text_color: string
}

export interface Product {
	id: number
	category_id: number
	section_id: number
	title: string
	slug: string
	description: string
	images: string[] | string // Может быть массив или JSON-строка
	price: number
	old_price: number | null
	promotion_text: string | null
	currency: string
	stock_count: number
	is_active: boolean
	badge: Badge | null // Один бейдж, может быть null
}

interface ProductsParams {
	category_id?: number
	section_id?: number
	limit?: number
	offset?: number
}

export const productsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Получение товаров с фильтрами
		getProducts: builder.query<Product[], ProductsParams>({
			query: (params) => {
				const queryParams = new URLSearchParams()
				if (params.category_id)
					queryParams.append('category_id', params.category_id.toString())
				if (params.section_id)
					queryParams.append('section_id', params.section_id.toString())
				if (params.limit) queryParams.append('limit', params.limit.toString())
				if (params.offset)
					queryParams.append('offset', params.offset.toString())

				return `/products?${queryParams.toString()}`
			},
			providesTags: ['Products'],
		}),

		// Получение одного товара
		getProduct: builder.query<Product, number>({
			query: (id) => `/products/${id}`,
			providesTags: ['Products'],
		}),
	}),
})

// Экспортируем хуки для использования в компонентах
export const { useGetProductsQuery, useGetProductQuery } = productsApi
