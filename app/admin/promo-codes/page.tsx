'use client'

import { useRouter } from 'next/navigation'
import {
	useGetAdminPromoCodesQuery,
	useDeletePromoCodeMutation,
} from '@/app/store/api/promoCodesApi'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function AdminPromoCodesPage() {
	const router = useRouter()
	const { data: promoCodes, isLoading } = useGetAdminPromoCodesQuery({})
	const [deletePromoCode] = useDeletePromoCodeMutation()

	const handleDelete = async (id: number, code: string) => {
		if (!confirm(`Удалить промокод "${code}"?`)) return

		try {
			await deletePromoCode(id).unwrap()
		} catch {
			alert('Ошибка при удалении промокода')
		}
	}

	const formatDate = (dateString: string | null) => {
		if (!dateString) return '—'
		try {
			return formatDistanceToNow(new Date(dateString), {
				addSuffix: true,
				locale: ru,
			})
		} catch {
			return dateString
		}
	}

	const getDiscountText = (
		type: 'percent' | 'fixed',
		value: number,
		maxDiscount: number | null
	) => {
		if (type === 'percent') {
			const text = `${value}%`
			return maxDiscount ? `${text} (макс. ${maxDiscount}₽)` : text
		}
		return `${value}₽`
	}

	if (isLoading) {
		return (
			<div className='min-h-screen bg-background p-6'>
				<div className='max-w-7xl mx-auto'>
					<p className='text-foreground/70'>Загрузка...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background p-6'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex justify-between items-center mb-6'>
					<div>
						<h1 className='text-3xl font-bold text-foreground mb-2'>
							Промокоды
						</h1>
						<p className='text-foreground/70'>
							Всего промокодов: {promoCodes?.length || 0}
						</p>
					</div>
					<div className='flex gap-2'>
						<Button
							onClick={() => router.push('/admin/promo-codes/create')}
							className='bg-primary hover:bg-primary-hover'
						>
							+ Создать промокод
						</Button>
						<Button
							onClick={() => router.push('/admin')}
							variant='outline'
							className='border-white/10'
						>
							← Назад
						</Button>
					</div>
				</div>

				{!promoCodes || promoCodes.length === 0 ? (
					<div className='bg-element-bg rounded-2xl p-8 text-center'>
						<p className='text-foreground/70 mb-4'>Промокодов пока нет</p>
						<Button
							onClick={() => router.push('/admin/promo-codes/create')}
							className='bg-primary hover:bg-primary-hover'
						>
							Создать первый промокод
						</Button>
					</div>
				) : (
					<div className='grid gap-4'>
						{promoCodes.map((promo) => (
							<div
								key={promo.id}
								className='bg-element-bg rounded-2xl p-6 hover:bg-element-bg/80 transition-colors'
							>
								<div className='flex items-start justify-between mb-4'>
									<div className='flex-1'>
										<div className='flex items-center gap-3 mb-2'>
											<h3 className='text-2xl font-bold text-foreground'>
												{promo.code}
											</h3>
											{promo.is_active ? (
												<span className='px-2 py-1 bg-primary/20 text-primary text-xs rounded-full'>
													Активен
												</span>
											) : (
												<span className='px-2 py-1 bg-destructive/20 text-destructive text-xs rounded-full'>
													Неактивен
												</span>
											)}
										</div>
										<div className='text-foreground/70 text-sm space-y-1'>
											<p>
												<span className='font-semibold'>Скидка:</span>{' '}
												{getDiscountText(
													promo.discount_type,
													promo.discount_value,
													promo.max_discount
												)}
											</p>
											{promo.min_order_amount && (
												<p>
													<span className='font-semibold'>
														Минимальная сумма:
													</span>{' '}
													{promo.min_order_amount}₽
												</p>
											)}
											<p>
												<span className='font-semibold'>Использований:</span>{' '}
												{promo.usage_count}
												{promo.usage_limit
													? ` / ${promo.usage_limit}`
													: ' (безлимит)'}
											</p>
											{promo.valid_from && (
												<p>
													<span className='font-semibold'>Начало:</span>{' '}
													{formatDate(promo.valid_from)}
												</p>
											)}
											{promo.valid_until && (
												<p>
													<span className='font-semibold'>Окончание:</span>{' '}
													{formatDate(promo.valid_until)}
												</p>
											)}
										</div>
									</div>
									<div className='flex gap-2'>
										<Button
											onClick={() =>
												router.push(`/admin/promo-codes/${promo.id}`)
											}
											variant='outline'
											size='sm'
											className='border-white/10'
										>
											Редактировать
										</Button>
										<Button
											onClick={() => handleDelete(promo.id, promo.code)}
											variant='outline'
											size='sm'
											className='border-destructive/20 text-destructive hover:bg-destructive/10'
										>
											Удалить
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

