import { baseApi } from './baseApi'

// Типы для отзывов (отзывы относятся ко всему магазину, а не к конкретным товарам)
export interface ReviewUser {
	id: number
	first_name: string
	last_name: string | null
	username: string | null
	display_name: string
}

export interface Review {
	id: number
	user: ReviewUser
	rating: number
	comment: string | null
	created_at: string
	updated_at: string
	is_own: boolean
	status?: 'pending' | 'rejected' | null
}

export interface ShopRating {
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

export interface AdminReview {
	id: number
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
	rating: number
	comment?: string
}

interface UpdateReviewRequest {
	rating: number
	comment?: string
}

export const reviewsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Получить отзывы на магазин
		getShopReviews: builder.query<
			Review[],
			{ limit?: number; offset?: number } | void
		>({
			query: (params) => {
				const limit = params?.limit ?? 50
				const offset = params?.offset ?? 0
				return `/reviews?limit=${limit}&offset=${offset}`
			},
			providesTags: [{ type: 'Reviews', id: 'LIST' }],
		}),

		// Получить статистику рейтинга магазина
		getShopRating: builder.query<ShopRating, void>({
			query: () => `/shop/rating`,
			providesTags: [{ type: 'Reviews', id: 'RATING' }],
		}),

		// Создать отзыв на магазин
		createReview: builder.mutation<Review, CreateReviewRequest>({
			query: (body) => ({
				url: '/reviews',
				method: 'POST',
				body,
			}),
			invalidatesTags: [
				{ type: 'Reviews', id: 'LIST' },
				{ type: 'Reviews', id: 'RATING' },
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
			invalidatesTags: [
				{ type: 'Reviews', id: 'LIST' },
				{ type: 'Reviews', id: 'RATING' },
			],
		}),

		// Удалить свой отзыв
		deleteReview: builder.mutation<
			{ ok: boolean; message: string },
			number
		>({
			query: (reviewId) => ({
				url: `/reviews/${reviewId}`,
				method: 'DELETE',
			}),
			invalidatesTags: [
				{ type: 'Reviews', id: 'LIST' },
				{ type: 'Reviews', id: 'RATING' },
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
	useGetShopReviewsQuery,
	useGetShopRatingQuery,
	useCreateReviewMutation,
	useUpdateReviewMutation,
	useDeleteReviewMutation,
	// Админ хуки
	useGetAdminReviewsQuery,
	useGetAdminReviewStatsQuery,
	useModerateReviewMutation,
	useDeleteAdminReviewMutation,
} = reviewsApi

