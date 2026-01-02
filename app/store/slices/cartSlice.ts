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
	},
})

export const { addToCart } = cartSlice.actions

export default cartSlice.reducer
