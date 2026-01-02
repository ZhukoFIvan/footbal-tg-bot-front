import { useGetCartQuery } from '../api/serverCartApi'
import { useAppSelector } from '../hooks'
import { selectIsTestMode } from '../slices/authSlice'

/**
 * Хук для проверки, есть ли товар в корзине
 * @param productId - ID товара
 * @returns {boolean} - true если товар в корзине
 */
export const useIsInCart = (productId: number): boolean => {
	const isTestMode = useAppSelector(selectIsTestMode)
	const { data: cart } = useGetCartQuery(undefined, {
		skip: isTestMode,
	})

	if (!cart) return false

	return cart.items.some((item) => item.product_id === productId)
}

/**
 * Хук для получения ID элемента корзины по ID товара
 * @param productId - ID товара
 * @returns {number | null} - ID элемента корзины или null
 */
export const useCartItemId = (productId: number): number | null => {
	const isTestMode = useAppSelector(selectIsTestMode)
	const { data: cart } = useGetCartQuery(undefined, {
		skip: isTestMode,
	})

	if (!cart) return null

	const item = cart.items.find((item) => item.product_id === productId)
	return item ? item.id : null
}



