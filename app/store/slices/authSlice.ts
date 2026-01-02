import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
	isAuthenticated: boolean
	token: string | null
	userId: number | null
	telegramId: number | null
	isAdmin: boolean
}

const initialState: AuthState = {
	isAuthenticated: false,
	token: null,
	userId: null,
	telegramId: null,
	isAdmin: false,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuth: (
			state,
			action: PayloadAction<{
				token: string
				userId: number
				telegramId: number
				isAdmin: boolean
			}>
		) => {
			state.isAuthenticated = true
			state.token = action.payload.token
			state.userId = action.payload.userId
			state.telegramId = action.payload.telegramId
			state.isAdmin = action.payload.isAdmin

			// Сохраняем в localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('token', action.payload.token)
				localStorage.setItem('userId', action.payload.userId.toString())
				localStorage.setItem('telegramId', action.payload.telegramId.toString())
				localStorage.setItem('isAdmin', action.payload.isAdmin.toString())
			}
		},

		logout: (state) => {
			state.isAuthenticated = false
			state.token = null
			state.userId = null
			state.telegramId = null
			state.isAdmin = false

			// Очищаем localStorage
			if (typeof window !== 'undefined') {
				localStorage.removeItem('token')
				localStorage.removeItem('userId')
				localStorage.removeItem('telegramId')
				localStorage.removeItem('isAdmin')
			}
		},

		restoreAuth: (state) => {
			// Восстанавливаем из localStorage
			if (typeof window !== 'undefined') {
				const token = localStorage.getItem('token')
				const userId = localStorage.getItem('userId')
				const telegramId = localStorage.getItem('telegramId')
				const isAdmin = localStorage.getItem('isAdmin')

				if (token && userId && telegramId) {
					state.isAuthenticated = true
					state.token = token
					state.userId = parseInt(userId)
					state.telegramId = parseInt(telegramId)
					state.isAdmin = isAdmin === 'true'
				} else {
				}
			}
		},
	},
})

export const { setAuth, logout, restoreAuth } = authSlice.actions

export default authSlice.reducer

// Селекторы
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
	state.auth.isAuthenticated

export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.isAdmin
