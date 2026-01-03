'use client'

import { useRouter } from 'next/navigation'
import {
	useGetAdminPromoCodesQuery,
	useDeletePromoCodeMutation,
} from '@/app/store/api/promoCodesApi'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import AdminHeader from '@/app/components/admin/shared/AdminHeader'
import { Plus } from 'lucide-react'
import Loader from '@/app/components/Loader/Loader'

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
			<div className='min-h-screen bg-background pb-24'>
				<AdminHeader
					title='Промокоды'
					actions={
						<Button
							onClick={() => router.push('/admin/promo-codes/create')}
							className='bg-primary hover:bg-primary-hover'
							size='sm'
						>
							<Plus className='w-4 h-4 mr-2' />
							Создать
						</Button>
					}
				/>
				<div className='container mx-auto px-4 py-6'>
					<Loader />
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			<AdminHeader
				title='Промокоды'
				actions={
					<Button
						onClick={() => router.push('/admin/promo-codes/create')}
						className='bg-primary hover:bg-primary-hover'
						size='sm'
					>
						<Plus className='w-4 h-4 mr-2' />
						Создать
					</Button>
				}
			/>
			<div className='container mx-auto px-4 py-6'>
				<p className='text-foreground/70 mb-6'>
					Всего промокодов: {promoCodes?.length || 0}
				</p>

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
					<div className='grid gap-3'>
						{promoCodes.map((promo) => (
							<div
								key={promo.id}
								className='bg-element-bg rounded-xl p-4 hover:bg-element-bg/80 transition-colors space-y-2'
							>
								{/* Строка 1: Код и статус */}
								<div className='flex items-center justify-between'>
									<h3 className='text-xl font-bold text-foreground'>
										{promo.code}
									</h3>
									{promo.is_active ? (
										<span className='px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded'>
											Активен
										</span>
									) : (
										<span className='px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded'>
											Неактивен
										</span>
									)}
								</div>

								{/* Между строкой 1 и 2: Скидка */}
								<div className='text-lg font-semibold text-primary'>
									{getDiscountText(
										promo.discount_type,
										promo.discount_value,
										promo.max_discount
									)}
									{promo.min_order_amount && (
										<span className='text-sm text-foreground/50 ml-2'>
											(мин. {promo.min_order_amount}₽)
										</span>
									)}
								</div>

								{/* Строка 2: Использований */}
								<div className='text-sm text-foreground/70'>
									<span className='text-foreground/50'>Использований:</span>{' '}
									<span className='text-foreground font-medium'>
										{promo.usage_count}
										{promo.usage_limit ? ` / ${promo.usage_limit}` : ' / 100'}
									</span>
								</div>

								{/* Строка 3: Начало */}
								{promo.valid_from && (
									<div className='text-sm text-foreground/70'>
										<span className='text-foreground/50'>Начало:</span>{' '}
										<span className='text-foreground font-medium'>
											{formatDate(promo.valid_from)}
										</span>
									</div>
								)}

								{/* Строка 4: Окончание */}
								{promo.valid_until && (
									<div className='text-sm text-foreground/70'>
										<span className='text-foreground/50'>Окончание:</span>{' '}
										<span className='text-foreground font-medium'>
											{formatDate(promo.valid_until)}
										</span>
									</div>
								)}

								{/* Строка 5: Кнопка редактировать */}
								<Button
									onClick={() => router.push(`/admin/promo-codes/${promo.id}`)}
									variant='outline'
									className='w-full border-white/10 hover:bg-white/5'
								>
									Редактировать
								</Button>

								{/* Строка 6: Кнопка удалить */}
								<Button
									onClick={() => handleDelete(promo.id, promo.code)}
									variant='outline'
									className='w-full border-red-500/20 text-red-400 hover:bg-red-500/10'
								>
									Удалить
								</Button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
