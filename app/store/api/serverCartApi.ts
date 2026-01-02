import { baseApi } from './baseApi'

// Типы для корзины
export interface CartItem {
	id: number
	product_id: number
	product_title: string
	product_image: string | null
	product_price: number
	product_old_price: number | null
	quantity: number
	subtotal: number
}

export interface CartResponse {
	id: number
	items: CartItem[]
	total_items: number
	total_amount: number
	bonus_balance: number
	max_bonus_usage: number
	bonus_will_earn: number
}

export interface AddToCartRequest {
	product_id: number
	quantity?: number
}

export interface UpdateCartItemRequest {
	quantity: number
}

export const cartApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Получить корзину
		getCart: builder.query<CartResponse, void>({
			query: () => '/cart/',
			providesTags: ['Cart'],
		}),

		// Добавить товар в корзину
		addToServerCart: builder.mutation<CartResponse, AddToCartRequest>({
			query: (body) => ({
				url: '/cart/items',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Cart'],
		}),

		// Изменить количество товара
		updateCartItem: builder.mutation<
			CartResponse,
			{ itemId: number; quantity: number }
		>({
			query: ({ itemId, quantity }) => ({
				url: `/cart/items/${itemId}`,
				method: 'PATCH',
				body: { quantity },
			}),
			invalidatesTags: ['Cart'],
		}),

		// Удалить товар из корзины
		removeCartItem: builder.mutation<CartResponse, number>({
			query: (itemId) => ({
				url: `/cart/items/${itemId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Cart'],
		}),

		// Очистить корзину
		clearServerCart: builder.mutation<{ ok: boolean; message: string }, void>({
			query: () => ({
				url: '/cart/',
				method: 'DELETE',
			}),
			invalidatesTags: ['Cart'],
		}),
	}),
})

export const {
	useGetCartQuery,
	useAddToServerCartMutation,
	useUpdateCartItemMutation,
	useRemoveCartItemMutation,
	useClearServerCartMutation,
} = cartApi
