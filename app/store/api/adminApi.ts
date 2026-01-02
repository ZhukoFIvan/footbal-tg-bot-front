import { baseApi } from './baseApi'

// Типы для админки
export interface AdminSection {
	id: number
	name: string
	image: string | null
	route: string | null
	end_time: string | null
	sort_order: number
	is_active: boolean
	created_at: string
}

export interface AdminCategory {
	id: number
	title: string
	slug: string
	description: string | null
	main_image: string | null
	additional_image: string | null
	show_on_main: boolean
	sort_order: number
	is_active: boolean
	created_at: string
}

export interface AdminProduct {
	id: number
	category_id: number
	section_id: number | null
	badge_id: number | null
	title: string
	slug: string
	description: string | null
	images: string[]
	price: number
	old_price: number | null
	discount_percent: number | null
	promotion_text: string | null
	currency: string
	stock_count: number
	is_active: boolean
	created_at: string
	updated_at: string
}

export interface AdminBadge {
	id: number
	title: string
	color: string
	text_color: string
	is_active: boolean
	created_at: string
}

export interface AdminBanner {
	id: number
	title: string
	image: string | null
	link: string | null
	sort_order: number
	is_active: boolean
	created_at: string
}

export interface AdminBonusUser {
	user_id: number
	telegram_id: number
	first_name: string | null
	username: string | null
	bonus_balance: number
	total_orders: number
	total_spent: number
	created_at: string
}

export interface AdminBonusTransaction {
	id: number
	user_id: number
	telegram_id: number
	first_name: string | null
	username: string | null
	amount: number
	type: string
	description: string | null
	created_at: string
}

export interface AdminStats {
	total_users: number
	total_orders: number
	total_revenue: number
	total_products: number
	active_products: number
	total_categories: number
	total_sections: number
}

export const adminApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Dev Token
		getDevToken: builder.mutation<
			{ access_token: string; is_admin: boolean },
			{ telegram_id: number }
		>({
			query: (body) => ({
				url: '/auth/dev-token',
				method: 'POST',
				body,
			}),
		}),

		// Sections
		getAdminSections: builder.query<AdminSection[], void>({
			query: () => '/admin/sections',
			providesTags: ['Sections'],
		}),

		createSection: builder.mutation<AdminSection, Partial<AdminSection>>({
			query: (body) => ({
				url: '/admin/sections',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Sections'],
		}),

		updateSection: builder.mutation<
			AdminSection,
			{ id: number; data: Partial<AdminSection> }
		>({
			query: ({ id, data }) => ({
				url: `/admin/sections/${id}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: ['Sections'],
		}),

		deleteSection: builder.mutation<void, number>({
			query: (id) => ({
				url: `/admin/sections/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Sections'],
		}),

		uploadSectionImage: builder.mutation<void, { id: number; file: File }>({
			query: ({ id, file }) => {
				const formData = new FormData()
				formData.append('file', file)
				return {
					url: `/admin/sections/${id}/image`,
					method: 'POST',
					body: formData,
				}
			},
			invalidatesTags: ['Sections'],
		}),

		// Categories
		getAdminCategories: builder.query<AdminCategory[], void>({
			query: () => '/admin/categories',
			providesTags: ['Categories'],
		}),

		createCategory: builder.mutation<AdminCategory, Partial<AdminCategory>>({
			query: (body) => ({
				url: '/admin/categories',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Categories'],
		}),

		updateCategory: builder.mutation<
			AdminCategory,
			{ id: number; data: Partial<AdminCategory> }
		>({
			query: ({ id, data }) => ({
				url: `/admin/categories/${id}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: ['Categories'],
		}),

		deleteCategory: builder.mutation<void, number>({
			query: (id) => ({
				url: `/admin/categories/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Categories'],
		}),

	// Products
	getAdminProducts: builder.query<
		AdminProduct[],
		{ limit?: number; offset?: number }
	>({
		query: ({ limit = 100, offset = 0 }) =>
			`/admin/products?limit=${limit}&offset=${offset}`,
		providesTags: ['Products'],
	}),

	getAdminProduct: builder.query<AdminProduct, number>({
		query: (id) => `/admin/products/${id}`,
		providesTags: ['Products'],
	}),

	createProduct: builder.mutation<AdminProduct, Partial<AdminProduct>>({
		query: (body) => ({
			url: '/admin/products',
			method: 'POST',
			body,
		}),
		invalidatesTags: ['Products'],
	}),

	updateProduct: builder.mutation<
		AdminProduct,
		{ id: number; data: Partial<AdminProduct> }
	>({
		query: ({ id, data }) => ({
			url: `/admin/products/${id}`,
			method: 'PATCH',
			body: data,
		}),
		invalidatesTags: ['Products'],
	}),

	deleteProduct: builder.mutation<void, number>({
		query: (id) => ({
			url: `/admin/products/${id}`,
			method: 'DELETE',
		}),
		invalidatesTags: ['Products'],
	}),

	uploadProductImages: builder.mutation<
		{ images: string[] },
		{ id: number; body: FormData }
	>({
		query: ({ id, body }) => ({
			url: `/admin/products/${id}/images`,
			method: 'POST',
			body,
		}),
		invalidatesTags: ['Products'],
	}),

	deleteProductImage: builder.mutation<
		void,
		{ id: number; imageIndex: number }
	>({
		query: ({ id, imageIndex }) => ({
			url: `/admin/products/${id}/images/${imageIndex}`,
			method: 'DELETE',
		}),
		invalidatesTags: ['Products'],
	}),

		// Badges
		getAdminBadges: builder.query<AdminBadge[], void>({
			query: () => '/admin/badges',
		}),

		createBadge: builder.mutation<AdminBadge, Partial<AdminBadge>>({
			query: (body) => ({
				url: '/admin/badges',
				method: 'POST',
				body,
			}),
		}),

		updateBadge: builder.mutation<
			AdminBadge,
			{ id: number; data: Partial<AdminBadge> }
		>({
			query: ({ id, data }) => ({
				url: `/admin/badges/${id}`,
				method: 'PATCH',
				body: data,
			}),
		}),

		deleteBadge: builder.mutation<void, number>({
			query: (id) => ({
				url: `/admin/badges/${id}`,
				method: 'DELETE',
			}),
		}),

		// Banners
		getAdminBanners: builder.query<AdminBanner[], void>({
			query: () => '/admin/banners',
			providesTags: ['AdminBanners'],
		}),

		createBanner: builder.mutation<AdminBanner, Partial<AdminBanner>>({
			query: (body) => ({
				url: '/admin/banners',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['AdminBanners'],
		}),

		updateBanner: builder.mutation<
			AdminBanner,
			{ id: number; data: Partial<AdminBanner> }
		>({
			query: ({ id, data }) => ({
				url: `/admin/banners/${id}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: ['AdminBanners'],
		}),

		deleteBanner: builder.mutation<void, number>({
			query: (id) => ({
				url: `/admin/banners/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['AdminBanners'],
		}),

		uploadBannerImage: builder.mutation<void, { id: number; file: File }>({
			query: ({ id, file }) => {
				const formData = new FormData()
				formData.append('file', file)
				return {
					url: `/admin/banners/${id}/image`,
					method: 'POST',
					body: formData,
				}
			},
			invalidatesTags: ['AdminBanners'],
		}),

		// Admin Bonus Management
		getAdminBonusUsers: builder.query<
			AdminBonusUser[],
			{ limit?: number; offset?: number }
		>({
			query: ({ limit = 50, offset = 0 }) =>
				`/admin/bonus/users?limit=${limit}&offset=${offset}`,
			providesTags: ['AdminBonus'],
		}),

		getAdminBonusUserById: builder.query<AdminBonusUser, number>({
			query: (userId) => `/admin/bonus/users/${userId}`,
			providesTags: ['AdminBonus'],
		}),

		addBonus: builder.mutation<
			void,
			{ user_id: number; amount: number; description?: string }
		>({
			query: (body) => ({
				url: '/admin/bonus/add',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['AdminBonus'],
		}),

		subtractBonus: builder.mutation<
			void,
			{ user_id: number; amount: number; description?: string }
		>({
			query: (body) => ({
				url: '/admin/bonus/subtract',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['AdminBonus'],
		}),

		setBalance: builder.mutation<
			void,
			{ user_id: number; balance: number; description?: string }
		>({
			query: (body) => ({
				url: '/admin/bonus/set-balance',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['AdminBonus'],
		}),

		getAdminBonusTransactions: builder.query<
			AdminBonusTransaction[],
			{ limit?: number; offset?: number }
		>({
			query: ({ limit = 50, offset = 0 }) =>
				`/admin/bonus/transactions?limit=${limit}&offset=${offset}`,
			providesTags: ['AdminBonus'],
		}),

		// Statistics
		getAdminStats: builder.query<AdminStats, void>({
			query: () => '/admin/stats',
			providesTags: ['AdminStats'],
		}),
	}),
})

export const {
	useGetDevTokenMutation,
	useGetAdminSectionsQuery,
	useCreateSectionMutation,
	useUpdateSectionMutation,
	useDeleteSectionMutation,
	useUploadSectionImageMutation,
	useGetAdminCategoriesQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useGetAdminProductsQuery,
	useGetAdminProductQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
	useUploadProductImagesMutation,
	useDeleteProductImageMutation,
	useGetAdminBadgesQuery,
	useCreateBadgeMutation,
	useUpdateBadgeMutation,
	useDeleteBadgeMutation,
	useGetAdminBannersQuery,
	useCreateBannerMutation,
	useUpdateBannerMutation,
	useDeleteBannerMutation,
	useUploadBannerImageMutation,
	useGetAdminBonusUsersQuery,
	useGetAdminBonusUserByIdQuery,
	useAddBonusMutation,
	useSubtractBonusMutation,
	useSetBalanceMutation,
	useGetAdminBonusTransactionsQuery,
	useGetAdminStatsQuery,
} = adminApi

