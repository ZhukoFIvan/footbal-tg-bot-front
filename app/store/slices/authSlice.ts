import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
	isAuthenticated: boolean
	token: string | null
	userId: number | null
	telegramId: number | null
	isAdmin: boolean
	isTestMode: boolean 
}

const initialState: AuthState = {
	isAuthenticated: false,
	token: null,
	userId: null,
	telegramId: null,
	isAdmin: false,
	isTestMode: process.env.NEXT_PUBLIC_TEST_MODE === 'true', // Можно переключать через .env
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

			console.log('🔄 Restoring auth from localStorage:')
			console.log('  - token:', token ? 'exists' : 'missing')
			console.log('  - userId:', userId)
			console.log('  - telegramId:', telegramId)
			console.log('  - isAdmin (raw):', isAdmin)
			console.log('  - isAdmin (parsed):', isAdmin === 'true')

			if (token && userId && telegramId) {
				state.isAuthenticated = true
				state.token = token
				state.userId = parseInt(userId)
				state.telegramId = parseInt(telegramId)
				state.isAdmin = isAdmin === 'true'
				
				console.log('✅ Auth restored successfully')
				console.log('✅ Admin status:', state.isAdmin)
			} else {
				console.log('❌ Auth not restored - missing data')
			}
		}
	},

		toggleTestMode: (state) => {
			state.isTestMode = !state.isTestMode
			console.log('Test mode:', state.isTestMode ? 'ON' : 'OFF')
		},

		setTestMode: (state, action: PayloadAction<boolean>) => {
			state.isTestMode = action.payload
		},
	},
})

export const { setAuth, logout, restoreAuth, toggleTestMode, setTestMode } =
	authSlice.actions

export default authSlice.reducer

// Селекторы
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
	state.auth.isAuthenticated || state.auth.isTestMode

export const selectToken = (state: { auth: AuthState }) => state.auth.token

export const selectUserId = (state: { auth: AuthState }) => state.auth.userId

export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.isAdmin

export const selectIsTestMode = (state: { auth: AuthState }) =>
	state.auth.isTestMode

export const selectAuthState = (state: { auth: AuthState }) => state.auth

