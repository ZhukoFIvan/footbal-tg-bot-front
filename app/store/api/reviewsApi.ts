import { baseApi } from './baseApi'

// Типы для отзывов
export interface ReviewUser {
	id: number
	first_name: string
	last_name: string | null
	username: string | null
	display_name: string
}

export interface Review {
	id: number
	product_id: number
	user: ReviewUser
	rating: number
	comment: string | null
	created_at: string
	updated_at: string
	is_own: boolean
	status?: 'pending' | 'rejected' | null
}

export interface ProductRating {
	average_rating: number
	reviews_count: number
	rating_distribution: {
		'5': number
		'4': number
		'3': number
		'2': number
		'1': number
	}
}

// Типы для админ-панели
export interface AdminReviewUser {
	id: number
	telegram_id: number
	first_name: string | null
	last_name: string | null
	username: string | null
}

export interface AdminReviewProduct {
	id: number
	title: string
	slug: string
}

export interface AdminReview {
	id: number
	product_id: number
	product: AdminReviewProduct
	user: AdminReviewUser
	rating: number
	comment: string | null
	status: 'pending' | 'approved' | 'rejected'
	created_at: string
	updated_at: string
}

export interface ReviewStats {
	pending: number
	approved: number
	rejected: number
	total: number
}

interface CreateReviewRequest {
	product_id: number
	rating: number
	comment?: string
}

interface UpdateReviewRequest {
	rating: number
	comment?: string
}

export const reviewsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Получить отзывы товара
		getProductReviews: builder.query<
			Review[],
			{ productId: number; limit?: number; offset?: number }
		>({
			query: ({ productId, limit = 50, offset = 0 }) =>
				`/products/${productId}/reviews?limit=${limit}&offset=${offset}`,
			providesTags: (result, error, { productId }) => [
				{ type: 'Reviews', id: `product-${productId}` },
				{ type: 'Reviews', id: 'LIST' },
			],
		}),

		// Получить статистику рейтинга товара
		getProductRating: builder.query<ProductRating, number>({
			query: (productId) => `/products/${productId}/rating`,
			providesTags: (result, error, productId) => [
				{ type: 'Reviews', id: `rating-${productId}` },
				{ type: 'Reviews', id: `product-${productId}` },
			],
		}),

		// Создать отзыв
		createReview: builder.mutation<Review, CreateReviewRequest>({
			query: (body) => ({
				url: '/reviews',
				method: 'POST',
				body,
			}),
			invalidatesTags: (result, error, { product_id }) => [
				{ type: 'Reviews', id: `product-${product_id}` },
				{ type: 'Reviews', id: `rating-${product_id}` },
				{ type: 'Reviews', id: 'LIST' },
			],
		}),

		// Обновить свой отзыв
		updateReview: builder.mutation<
			Review,
			{ reviewId: number; data: UpdateReviewRequest }
		>({
			query: ({ reviewId, data }) => ({
				url: `/reviews/${reviewId}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (result) =>
				result
					? [
							{ type: 'Reviews', id: `product-${result.product_id}` },
							{ type: 'Reviews', id: `rating-${result.product_id}` },
							{ type: 'Reviews', id: 'LIST' },
					  ]
					: [],
		}),

		// Удалить свой отзыв
		deleteReview: builder.mutation<
			{ ok: boolean; message: string },
			{ reviewId: number; productId: number }
		>({
			query: ({ reviewId }) => ({
				url: `/reviews/${reviewId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, { productId }) => [
				{ type: 'Reviews', id: `product-${productId}` },
				{ type: 'Reviews', id: `rating-${productId}` },
				{ type: 'Reviews', id: 'LIST' },
			],
		}),

		// ==================== АДМИН ЭНДПОИНТЫ ====================

		// Получить все отзывы (для админ-панели)
		getAdminReviews: builder.query<
			AdminReview[],
			{ status?: 'pending' | 'approved' | 'rejected'; limit?: number; offset?: number }
		>({
			query: ({ status, limit = 50, offset = 0 }) => {
				const params = new URLSearchParams({
					limit: limit.toString(),
					offset: offset.toString(),
				})
				if (status) params.append('status', status)
				return `/admin/reviews?${params}`
			},
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({ type: 'Reviews' as const, id })),
							{ type: 'Reviews', id: 'ADMIN_LIST' },
					  ]
					: [{ type: 'Reviews', id: 'ADMIN_LIST' }],
		}),

		// Получить статистику отзывов (для админ-панели)
		getAdminReviewStats: builder.query<ReviewStats, void>({
			query: () => '/admin/reviews/stats',
			providesTags: [{ type: 'Reviews', id: 'STATS' }],
		}),

		// Модерировать отзыв (одобрить/отклонить)
		moderateReview: builder.mutation<
			{ ok: boolean; review_id: number; new_status: string },
			{ reviewId: number; action: 'approve' | 'reject' }
		>({
			query: ({ reviewId, action }) => ({
				url: `/admin/reviews/${reviewId}/moderate`,
				method: 'PATCH',
				body: { action },
			}),
			invalidatesTags: (result, error, { reviewId }) => [
				{ type: 'Reviews', id: reviewId },
				{ type: 'Reviews', id: 'ADMIN_LIST' },
				{ type: 'Reviews', id: 'STATS' },
				{ type: 'Reviews', id: 'LIST' },
			],
		}),

		// Удалить отзыв (админ)
		deleteAdminReview: builder.mutation<
			{ ok: boolean; message: string },
			number
		>({
			query: (reviewId) => ({
				url: `/admin/reviews/${reviewId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, reviewId) => [
				{ type: 'Reviews', id: reviewId },
				{ type: 'Reviews', id: 'ADMIN_LIST' },
				{ type: 'Reviews', id: 'STATS' },
				{ type: 'Reviews', id: 'LIST' },
			],
		}),
	}),
})

export const {
	useGetProductReviewsQuery,
	useGetProductRatingQuery,
	useCreateReviewMutation,
	useUpdateReviewMutation,
	useDeleteReviewMutation,
	// Админ хуки
	useGetAdminReviewsQuery,
	useGetAdminReviewStatsQuery,
	useModerateReviewMutation,
	useDeleteAdminReviewMutation,
} = reviewsApi

