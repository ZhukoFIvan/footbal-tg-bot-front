import { baseApi } from './baseApi'

// Типы для бонусов
export interface BonusInfo {
	bonus_balance: number
	total_spent: number
	total_orders: number
	next_milestone: {
		orders: number
		bonus: number
		description: string
	} | null
}

export interface BonusTransaction {
	id: number
	amount: number
	type: string
	description: string | null
	created_at: string
}

export interface BonusMilestones {
	milestones: Record<number, { bonus: number; description: string }>
	bonus_rate: number
	max_usage_percent: number
}

export const bonusApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Получить информацию о бонусах
		getBonusInfo: builder.query<BonusInfo, void>({
			query: () => '/bonus/info',
			providesTags: ['Bonus'],
		}),

		// Получить историю транзакций
		getBonusTransactions: builder.query<
			BonusTransaction[],
			{ limit?: number; offset?: number }
		>({
			query: ({ limit = 50, offset = 0 }) =>
				`/bonus/transactions?limit=${limit}&offset=${offset}`,
			providesTags: ['Bonus'],
		}),

		// Получить карту наград
		getBonusMilestones: builder.query<BonusMilestones, void>({
			query: () => '/bonus/milestones',
		}),
	}),
})

export const {
	useGetBonusInfoQuery,
	useGetBonusTransactionsQuery,
	useGetBonusMilestonesQuery,
} = bonusApi

