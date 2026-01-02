import { baseApi } from './baseApi'

// Типы для авторизации
export interface AuthRequest {
	initData: string
}

export interface AuthResponse {
	ok: boolean
	access_token: string
	user_id: number
	telegram_id: number
	is_admin: boolean
}

export const authApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Авторизация через Telegram
		telegramAuth: builder.mutation<AuthResponse, AuthRequest>({
			query: (body) => ({
				url: '/auth/telegram',
				method: 'POST',
				body,
			}),
		}),
	}),
})

export const { useTelegramAuthMutation } = authApi
