import { baseApi } from './baseApi'

// Типы для заказов
interface OrderItem {
	id: number
	product_title: string
	quantity: number
	price: number
}

interface Order {
	id: number
	user_id: number
	total_amount: number
	bonus_used: number
	bonus_earned: number
	final_amount: number
	currency: string
	status: string
	created_at: string
	items: OrderItem[]
}

export interface CreateOrderRequest {
	bonus_to_use?: number
	promo_code?: string
}

export const ordersApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Создать заказ из корзины
		createOrder: builder.mutation<Order, CreateOrderRequest>({
			query: (body) => ({
				url: '/orders/create',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Cart', 'Bonus'],
		}),
	}),
})

export const { useCreateOrderMutation } = ordersApi

