import { baseApi } from './baseApi'
import { Product } from './productsApi'

// Типы для категорий
export interface Category {
	id: number
	title: string
	slug: string
	description: string
	main_image: string
	additional_image: string
	show_on_main: boolean
	sort_order: number
	is_active: boolean
}

// Тип для категорий на главном экране
export interface MainScreenCategory {
	category: Category
	products: Product[]
	total_products: number
	has_more: boolean
}

export const categoriesApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Получение всех категорий
		getCategories: builder.query<Category[], void>({
			query: () => '/categories',
			providesTags: ['Categories'],
		}),

		// Получение категорий для главного экрана
		getMainScreenCategories: builder.query<
			MainScreenCategory[],
			{ limit_per_category?: number }
		>({
			query: ({ limit_per_category = 8 }) =>
				`/categories/main-screen?limit_per_category=${limit_per_category}`,
			providesTags: ['Categories', 'Products'],
		}),
	}),
})

// Экспортируем хуки для использования в компонентах
export const { useGetCategoriesQuery, useGetMainScreenCategoriesQuery } =
	categoriesApi
