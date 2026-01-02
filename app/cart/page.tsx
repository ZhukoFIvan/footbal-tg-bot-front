'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGetCartQuery } from '@/app/store/api/serverCartApi'
import { useCreateOrderMutation } from '@/app/store/api/ordersApi'
import { useApplyPromoCodeMutation } from '@/app/store/api/promoCodesApi'
import { useAppSelector } from '@/app/store/hooks'
import { selectIsTestMode } from '@/app/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import Loader from '@/app/components/Loader/Loader'
import { ShoppingCartList } from '@/components/ShoppingCart/ShoppingCartList/ShoppingCartList'
import { EmptyCart } from '@/components/ShoppingCart/EmptyCart/EmptyCart'
import { TotalBlock } from '@/components/ShoppingCart/TotalBlock/TotalBlock'
import { BonusBlock } from '@/components/ShoppingCart/BonusBlock/BonusBlock'
import { Input } from '@/components/ui/input'

export default function CartPage() {
	const router = useRouter()
	const isTestMode = useAppSelector(selectIsTestMode)

	const [bonusToUse, setBonusToUse] = useState(0)
	const [promoCode, setPromoCode] = useState('')
	const [appliedPromo, setAppliedPromo] = useState<{
		code: string
		discount: number
		discount_type: 'percent' | 'fixed'
		discount_value: number
		cart_total: number
		new_total: number
	} | null>(null)
	const [promoError, setPromoError] = useState('')

	const {
		data: serverCart,
		isLoading: cartLoading,
		error: cartError,
	} = useGetCartQuery(undefined, {
		skip: isTestMode,
	})
	const [createOrder, { isLoading: orderLoading }] = useCreateOrderMutation()
	const [applyPromo, { isLoading: promoLoading }] = useApplyPromoCodeMutation()

	if (cartLoading) {
		return (
			<div className='min-h-screen bg-background pb-24 flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	if (cartError) {
		const errorMessage =
			'status' in cartError
				? `HTTP ${cartError.status}: ${JSON.stringify(cartError.data || {})}`
				: 'error' in cartError
				? String(cartError.error)
				: 'Неизвестная ошибка'

		return (
			<div className='min-h-screen bg-background pb-24'>
				<div className='container mx-auto px-4 py-12'>
					<div className='max-w-md mx-auto text-center'>
						<p className='text-destructive text-lg font-semibold mb-2'>
							Ошибка загрузки корзины
						</p>
						<p className='text-foreground/70 text-sm mb-4 font-mono'>
							{errorMessage}
						</p>
						<div className='space-y-2 mb-6'>
							<Button
								onClick={() => window.location.reload()}
								variant='outline'
								className='w-full'
							>
								Обновить страницу
							</Button>
							<Button
								onClick={() => router.push('/catalog')}
								className='w-full'
							>
								Вернуться к каталогу
							</Button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (!serverCart || serverCart.items.length === 0) {
		return (
			<div className='min-h-screen bg-background pb-24'>
				<div className='sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5'>
					<div className='container mx-auto px-4 py-6'>
						<h1 className='text-3xl font-bold text-foreground'>Корзина</h1>
					</div>
				</div>
				<EmptyCart />
			</div>
		)
	}

	const handleApplyPromo = async () => {
		if (!promoCode.trim()) {
			setPromoError('Введите промокод')
			return
		}

		try {
			const result = await applyPromo({ code: promoCode.trim() }).unwrap()
			setAppliedPromo({
				code: promoCode.trim(),
				discount: result.discount,
				discount_type: result.discount_type as 'percent' | 'fixed',
				discount_value: result.discount_value,
				cart_total: result.cart_total,
				new_total: result.new_total as number,
			})
			setPromoError('')
		} catch (error: unknown) {
			setAppliedPromo(null)
			if (error && typeof error === 'object' && 'data' in error) {
				const errorData = error.data as { detail?: string }
				setPromoError(errorData.detail || 'Не удалось применить промокод')
			} else {
				setPromoError('Не удалось применить промокод')
			}
		}
	}

	const handleRemovePromo = () => {
		setAppliedPromo(null)
		setPromoCode('')
		setPromoError('')
	}

	const handleCheckout = async () => {
		try {
			const order = await createOrder({
				bonus_to_use: bonusToUse,
				promo_code: appliedPromo?.code,
			}).unwrap()
			alert(`Заказ создан! ID: ${order.id}, К оплате: ${order.final_amount}₽`)
		} catch {
			alert('Ошибка создания заказа')
		}
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			<div className='container mx-auto px-4 py-6'>
				<ShoppingCartList />

				<BonusBlock bonusToUse={bonusToUse} setBonusToUse={setBonusToUse} />

			<div className='bg-element-bg rounded-2xl p-4 mb-4'>
				<div className='flex gap-2 mb-2'>
					<Input
						type='text'
						placeholder='Введите промокод'
						value={promoCode}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setPromoCode(e.target.value)
							setPromoError('')
						}}
						disabled={!!appliedPromo}
						className='flex-1 !bg-background rounded-xl px-3 py-3 text-white placeholder:text-white/50 outline-none border border-white/10 focus:border-primary transition-colors disabled:opacity-50'
					/>
					{appliedPromo ? (
						<Button
							onClick={handleRemovePromo}
							variant='outline'
							className='px-4 rounded-xl border-white/10 hover:border-destructive hover:text-destructive'
						>
							Удалить
						</Button>
					) : (
						<Button
							onClick={handleApplyPromo}
							disabled={promoLoading || !promoCode.trim()}
							className='px-6 rounded-xl bg-primary hover:bg-primary-hover'
						>
							{promoLoading ? 'Проверка...' : 'Применить'}
						</Button>
					)}
				</div>

				{promoError && (
					<p className='text-destructive text-sm mt-2'>{promoError}</p>
				)}

				{appliedPromo && (
					<div className='mt-3 p-3 bg-primary/10 rounded-xl border border-primary/20'>
						<div className='flex items-center justify-between mb-1'>
							<span className='text-sm text-foreground/70'>
								Промокод применён:
							</span>
							<span className='text-sm font-semibold text-primary'>
								{appliedPromo.code}
							</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-foreground/70'>Скидка:</span>
							<span className='text-lg font-bold text-primary'>
								-{new Intl.NumberFormat('ru-RU').format(appliedPromo.discount)} ₽
							</span>
						</div>
					</div>
				)}
			</div>

				<TotalBlock
				bonusToUse={bonusToUse}
				promoDiscount={appliedPromo?.discount || 0}
			/>

				<Button
					onClick={handleCheckout}
					disabled={orderLoading}
					className='w-full h-14 rounded-full bg-primary hover:bg-primary-hover text-white text-lg font-semibold shadow-[0_0_20px_rgba(33,188,96,0.3)]'
				>
					{orderLoading ? 'Создание заказа...' : 'Перейти к оплате'}
				</Button>
			</div>
		</div>
	)
}
