import { baseApi } from './baseApi'

export interface PromoCode {
	id: number
	code: string
	discount_type: 'percent' | 'fixed'
	discount_value: number
	min_order_amount: number | null
	max_discount: number | null
	usage_limit: number | null
	usage_count: number
	valid_from: string | null
	valid_until: string | null
	is_active: boolean
	created_at: string
	updated_at: string
}

export interface CreatePromoCodeRequest {
	code: string
	discount_type: 'percent' | 'fixed'
	discount_value: number
	min_order_amount?: number | null
	max_discount?: number | null
	usage_limit?: number | null
	valid_from?: string | null
	valid_until?: string | null
	is_active?: boolean
}

interface UpdatePromoCodeRequest {
	code?: string
	discount_type?: 'percent' | 'fixed'
	discount_value?: number
	min_order_amount?: number | null
	max_discount?: number | null
	usage_limit?: number | null
	valid_from?: string | null
	valid_until?: string | null
	is_active?: boolean
}

interface ApplyPromoResponse {
	promo_code: string
	discount: number
	discount_type: 'percent' | 'fixed'
	discount_value: number
	cart_total: number
	new_total: number
}

export const promoCodesApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// User endpoints
		applyPromoCode: builder.mutation<ApplyPromoResponse, { code: string }>({
			query: (body) => ({
				url: '/cart/apply-promo',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Cart'],
		}),

		validatePromoCode: builder.mutation<ApplyPromoResponse, { code: string }>({
			query: (body) => ({
				url: '/cart/validate-promo',
				method: 'POST',
				body,
			}),
		}),

		// Admin endpoints
		getAdminPromoCodes: builder.query<
			PromoCode[],
			{ limit?: number; offset?: number; is_active?: boolean }
		>({
			query: (params) => ({
				url: '/admin/promo-codes',
				params,
			}),
			providesTags: ['PromoCodes'],
		}),

		getAdminPromoCode: builder.query<PromoCode, number>({
			query: (id) => `/admin/promo-codes/${id}`,
			providesTags: (_result, _error, id) => [{ type: 'PromoCodes', id }],
		}),

		createPromoCode: builder.mutation<PromoCode, CreatePromoCodeRequest>({
			query: (body) => ({
				url: '/admin/promo-codes',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['PromoCodes'],
		}),

		updatePromoCode: builder.mutation<
			PromoCode,
			{ id: number; data: UpdatePromoCodeRequest }
		>({
			query: ({ id, data }) => ({
				url: `/admin/promo-codes/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'PromoCodes', id },
				'PromoCodes',
			],
		}),

		deletePromoCode: builder.mutation<{ ok: boolean; message: string }, number>(
			{
				query: (id) => ({
					url: `/admin/promo-codes/${id}`,
					method: 'DELETE',
				}),
				invalidatesTags: ['PromoCodes'],
			}
		),
	}),
})

export const {
	useApplyPromoCodeMutation,
	useValidatePromoCodeMutation,
	useGetAdminPromoCodesQuery,
	useGetAdminPromoCodeQuery,
	useCreatePromoCodeMutation,
	useUpdatePromoCodeMutation,
	useDeletePromoCodeMutation,
} = promoCodesApi

