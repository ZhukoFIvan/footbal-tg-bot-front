import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
	productId: number
	quantity: number
}

interface CartState {
	items: CartItem[]
}

const initialState: CartState = {
	items: [],
}

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart: (state, action: PayloadAction<number>) => {
			const productId = action.payload
			const existingItem = state.items.find(
				(item) => item.productId === productId
			)

			if (existingItem) {
				existingItem.quantity += 1
			} else {
				state.items.push({ productId, quantity: 1 })
			}
		},

		removeFromCart: (state, action: PayloadAction<number>) => {
			const productId = action.payload
			const existingItem = state.items.find(
				(item) => item.productId === productId
			)

			if (existingItem) {
				if (existingItem.quantity > 1) {
					existingItem.quantity -= 1
				} else {
					state.items = state.items.filter(
						(item) => item.productId !== productId
					)
				}
			}
		},

		setQuantity: (
			state,
			action: PayloadAction<{ productId: number; quantity: number }>
		) => {
			const { productId, quantity } = action.payload
			const existingItem = state.items.find(
				(item) => item.productId === productId
			)

			if (quantity <= 0) {
				state.items = state.items.filter((item) => item.productId !== productId)
			} else if (existingItem) {
				existingItem.quantity = quantity
			} else {
				state.items.push({ productId, quantity })
			}
		},

		clearCart: (state) => {
			state.items = []
		},

		// Синхронизация с сервером
		syncWithServer: (
			state,
			action: PayloadAction<{ productId: number; quantity: number }[]>
		) => {
			// Заменяем локальную корзину данными с сервера
			state.items = action.payload.map((item) => ({
				productId: item.productId,
				quantity: item.quantity,
			}))
		},
	},
})

export const {
	addToCart,
	removeFromCart,
	setQuantity,
	clearCart,
	syncWithServer,
} = cartSlice.actions

export default cartSlice.reducer

// Селекторы
export const selectCartItems = (state: { cart: CartState }) => state.cart.items

export const selectCartItemQuantity =
	(productId: number) => (state: { cart: CartState }) => {
		const item = state.cart.items.find((item) => item.productId === productId)
		return item?.quantity || 0
	}

export const selectCartTotal = (state: { cart: CartState }) =>
	state.cart.items.reduce((total, item) => total + item.quantity, 0)
