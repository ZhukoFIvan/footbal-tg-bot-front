'use client'

import { useGetAdminStatsQuery } from '@/app/store/api/adminApi'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, ShoppingCart, DollarSign, Package, Eye, FolderTree, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Loader from '@/app/components/Loader/Loader'

export default function AdminStatsPage() {
	const router = useRouter()
	const { data: stats, isLoading, refetch } = useGetAdminStatsQuery()

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
		}).format(amount)
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			{/* Header */}
			<div className='sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5'>
				<div className='container mx-auto px-4 py-4 flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<Button
							onClick={() => router.push('/admin')}
							variant='ghost'
							size='icon'
						>
							<ArrowLeft className='w-5 h-5' />
						</Button>
						<h1 className='text-2xl font-bold text-foreground'>Статистика</h1>
					</div>
					<Button
						onClick={() => refetch()}
						variant='ghost'
						size='icon'
					>
						<RefreshCw className='w-5 h-5' />
					</Button>
				</div>
			</div>

			{/* Content */}
			<div className='container mx-auto px-4 py-6'>
				{isLoading ? (
					<Loader />
				) : stats ? (
					<div className='grid grid-cols-2 gap-4'>
						{/* Total Users */}
						<div className='bg-element-bg rounded-2xl p-6'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center'>
									<Users className='w-5 h-5 text-primary' />
								</div>
								<div className='flex-1'>
									<p className='text-sm text-foreground/50'>Пользователи</p>
									<p className='text-2xl font-bold text-foreground'>{stats.total_users}</p>
								</div>
							</div>
						</div>

						{/* Total Orders */}
						<div className='bg-element-bg rounded-2xl p-6'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center'>
									<ShoppingCart className='w-5 h-5 text-primary' />
								</div>
								<div className='flex-1'>
									<p className='text-sm text-foreground/50'>Заказы</p>
									<p className='text-2xl font-bold text-foreground'>{stats.total_orders}</p>
								</div>
							</div>
						</div>

						{/* Total Revenue */}
						<div className='bg-element-bg rounded-2xl p-6 col-span-2'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center'>
									<DollarSign className='w-5 h-5 text-primary' />
								</div>
								<div className='flex-1'>
									<p className='text-sm text-foreground/50'>Общая выручка</p>
									<p className='text-3xl font-bold text-primary'>{formatCurrency(stats.total_revenue)}</p>
								</div>
							</div>
						</div>

						{/* Products */}
						<div className='bg-element-bg rounded-2xl p-6'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center'>
									<Package className='w-5 h-5 text-primary' />
								</div>
								<div className='flex-1'>
									<p className='text-sm text-foreground/50'>Товары</p>
									<p className='text-2xl font-bold text-foreground'>{stats.total_products}</p>
									<p className='text-xs text-foreground/40'>Активных: {stats.active_products}</p>
								</div>
							</div>
						</div>

						{/* Categories */}
						<div className='bg-element-bg rounded-2xl p-6'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center'>
									<Eye className='w-5 h-5 text-primary' />
								</div>
								<div className='flex-1'>
									<p className='text-sm text-foreground/50'>Категории</p>
									<p className='text-2xl font-bold text-foreground'>{stats.total_categories}</p>
								</div>
							</div>
						</div>

						{/* Sections */}
						<div className='bg-element-bg rounded-2xl p-6'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center'>
									<FolderTree className='w-5 h-5 text-primary' />
								</div>
								<div className='flex-1'>
									<p className='text-sm text-foreground/50'>Секции</p>
									<p className='text-2xl font-bold text-foreground'>{stats.total_sections}</p>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className='text-center py-12'>
						<p className='text-foreground/50'>Статистика недоступна</p>
					</div>
				)}
			</div>
		</div>
	)
}

