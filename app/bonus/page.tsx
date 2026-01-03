'use client'

import {
	useGetBonusInfoQuery,
	useGetBonusTransactionsQuery,
	useGetBonusMilestonesQuery,
} from '@/app/store/api/bonusApi'
import Loader from '@/app/components/Loader/Loader'
import { Gift, Clock } from 'lucide-react'

const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

export default function BonusPage() {
	const { data: bonusInfo, isLoading: infoLoading } = useGetBonusInfoQuery()
	const { data: transactions, isLoading: transLoading } =
		useGetBonusTransactionsQuery({ limit: 20 })
	const { data: milestones } = useGetBonusMilestonesQuery()

	if (infoLoading) {
		return (
			<div className='min-h-screen bg-background pb-24 flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			{/* Header */}
			<div className='sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5'>
				<div className='container mx-auto px-4 py-3'>
					<h1 className='text-2xl font-bold text-foreground'>Бонусы</h1>
				</div>
			</div>

			<div className='container mx-auto px-4 py-6'>
				{/* Balance Card */}
				<div className='bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-6 mb-6 border border-primary/20'>
					<div className='text-center'>
						<p className='text-foreground/70 mb-2'>Ваш баланс</p>
						<h2 className='text-5xl font-bold text-primary mb-6'>
							{bonusInfo ? rub(bonusInfo.bonus_balance) : '0 ₽'}
						</h2>
						<div className='grid grid-cols-2 gap-4'>
							<div className='text-center'>
								<p className='text-sm text-foreground/50'>Всего потрачено</p>
								<p className='text-lg font-semibold text-foreground'>
									{bonusInfo ? rub(bonusInfo.total_spent) : '0 ₽'}
								</p>
							</div>
							<div className='text-center'>
								<p className='text-sm text-foreground/50'>Покупок</p>
								<p className='text-lg font-semibold text-foreground'>
									{bonusInfo?.total_orders || 0}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Next Milestone */}
				{bonusInfo?.next_milestone && (
					<div className='bg-element-bg rounded-2xl p-4 mb-6 flex items-center gap-4'>
						<div className='w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0'>
							<Gift className='w-6 h-6 text-primary' />
						</div>
						<div className='flex-1'>
							<p className='text-foreground font-medium'>
								Получите 25 ₽ за первый отзыв после 2-й покупки
							</p>
							<p className='text-sm text-foreground/50 mt-1'>
								{bonusInfo.next_milestone.description}
							</p>
						</div>
					</div>
				)}

				{/* Milestones Card */}
				{milestones && (
					<div className='bg-element-bg rounded-2xl p-6 mb-6'>
						<h3 className='text-xl font-bold text-foreground mb-4 flex items-center gap-2'>
							<Gift className='w-6 h-6 text-primary' />
							Карта наград
						</h3>
						<div className='space-y-3'>
							{Object.entries(milestones.milestones).map(([orders, bonus]) => {
								const completed =
									bonusInfo && bonusInfo.total_orders >= parseInt(orders)
								const isCurrent =
									bonusInfo?.next_milestone?.orders === parseInt(orders)

								return (
									<div
										key={orders}
										className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
											isCurrent
												? 'bg-primary/10 border border-primary/30'
												: 'bg-element-bg/60'
										} ${completed ? 'opacity-50' : ''}`}
									>
										<div className='flex items-center gap-3'>
											<div
												className={`w-8 h-8 rounded-full flex items-center justify-center ${
													completed
														? 'bg-primary text-white'
														: 'bg-element-bg text-foreground/50'
												}`}
											>
												{completed ? '✓' : parseInt(orders)}
											</div>
											<div>
												<p className='text-foreground font-medium'>
													{parseInt(orders) === 1
														? '1 покупка'
														: `${orders} покупки`}
												</p>
												{bonus === 0 && (
													<p className='text-xs text-foreground/50'>
														Усилитель B
													</p>
												)}
											</div>
										</div>
										<div className='text-right'>
											{bonus > 0 ? (
												<span className='text-primary font-semibold'>
													{rub(bonus)}
												</span>
											) : (
												<span className='text-foreground/50 text-sm'>
													Секретный подарок
												</span>
											)}
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}

				{/* Transaction History */}
				<div className='bg-element-bg rounded-2xl p-6'>
					<h3 className='text-xl font-bold text-foreground mb-4 flex items-center gap-2'>
						<Clock className='w-6 h-6 text-primary' />
						История транзакций
					</h3>
					{transLoading ? (
						<Loader />
					) : transactions && transactions.length > 0 ? (
						<div className='space-y-3'>
							{transactions.map((tr) => (
								<div
									key={tr.id}
									className='flex items-center justify-between p-3 bg-element-bg/60 rounded-xl'
								>
									<div className='flex-1'>
										<p className='text-foreground text-sm'>
											{tr.description || tr.type}
										</p>
										<p className='text-xs text-foreground/50 mt-1'>
											{new Date(tr.created_at).toLocaleDateString('ru-RU')}
										</p>
									</div>
									<div
										className={`font-semibold ${
											tr.amount > 0 ? 'text-primary' : 'text-destructive'
										}`}
									>
										{tr.amount > 0 ? '+' : ''}
										{rub(Math.abs(tr.amount))}
									</div>
								</div>
							))}
						</div>
					) : (
						<p className='text-foreground/50 text-center py-8'>
							История пока пуста
						</p>
					)}
				</div>
			</div>
		</div>
	)
}
