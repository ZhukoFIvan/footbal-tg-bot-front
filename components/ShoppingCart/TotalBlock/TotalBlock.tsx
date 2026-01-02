import { useGetCartQuery } from '@/app/store/api/serverCartApi'
import { FC } from 'react'

interface TotalBlockProps {
	bonusToUse: number
	promoDiscount?: number
}

export const TotalBlock: FC<TotalBlockProps> = ({
	bonusToUse,
	promoDiscount = 0,
}) => {
	const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

	const { data: serverCart } = useGetCartQuery(undefined)

	const cartTotal = serverCart?.total_amount || 0
	const afterPromo = cartTotal - promoDiscount
	const finalAmount = Math.max(0, afterPromo - bonusToUse)

	return (
		<div className='bg-element-bg rounded-2xl p-4 mb-4'>
			<div className='space-y-2'>
				<div className='flex justify-between text-foreground/70'>
					<span>Товары ({serverCart?.total_items} шт.):</span>
					<span>{rub(cartTotal)}</span>
				</div>
				{promoDiscount > 0 && (
					<div className='flex justify-between text-primary'>
						<span>Промокод:</span>
						<span>-{rub(promoDiscount)}</span>
					</div>
				)}
				{bonusToUse > 0 && (
					<div className='flex justify-between text-primary'>
						<span>Бонусы:</span>
						<span>-{rub(bonusToUse)}</span>
					</div>
				)}
				<div className='border-t border-white/10 pt-2 mt-2' />
				<div className='flex justify-between text-xl font-bold text-foreground'>
					<span>Итого:</span>
					<span>{rub(finalAmount)}</span>
				</div>
			</div>
		</div>
	)
}
