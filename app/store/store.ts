import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './api/baseApi'
import cartReducer from './slices/cartSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
	reducer: {
		// Добавляем reducer для API
		[baseApi.reducerPath]: baseApi.reducer,
		// Добавляем reducer для корзины
		cart: cartReducer,
		// Добавляем reducer для авторизации
		auth: authReducer,
	},
	// Добавляем middleware для RTK Query
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(baseApi.middleware),
})

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

