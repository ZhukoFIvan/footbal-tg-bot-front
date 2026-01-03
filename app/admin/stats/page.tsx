'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
	useGetStatsOverviewQuery,
	useGetStatsUsersQuery,
	useGetStatsOrdersQuery,
	useGetStatsRevenueQuery,
	useGetStatsProductsQuery,
	useGetStatsTopProductsQuery,
	useGetStatsRecentUsersQuery,
	useGetStatsRecentOrdersQuery,
} from '@/app/store/api/adminApi'
import { useAppSelector } from '@/app/store/hooks'
import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import Loader from '@/app/components/Loader/Loader'
import AdminHeader from '@/app/components/admin/shared/AdminHeader'

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
}

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
}

// Компонент карточки статистики
function StatCard({
	title,
	value,
	subtitle,
	icon,
	color = 'blue',
	warning,
}: {
	title: string
	value: string | number
	subtitle?: string
	icon: string
	color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
	warning?: string
}) {
	const colors: Record<string, string> = {
		blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
		green: 'from-green-500/20 to-green-600/20 border-green-500/30',
		purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
		orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
		red: 'from-red-500/20 to-red-600/20 border-red-500/30',
	}

	return (
		<motion.div
			variants={item}
			className={`bg-linear-to-br ${colors[color]} border rounded-2xl p-6`}
		>
			<div className='flex items-start justify-between mb-4'>
				<div className='text-4xl'>{icon}</div>
				{warning && (
					<div className='text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full'>
						⚠️ {warning}
					</div>
				)}
			</div>
			<div className='text-sm text-foreground/70 mb-1'>{title}</div>
			<div className='text-3xl font-bold text-foreground mb-1'>{value}</div>
			{subtitle && <div className='text-sm text-foreground/60'>{subtitle}</div>}
		</motion.div>
	)
}

// Компонент пустого состояния
function EmptyState({ icon, message }: { icon: string; message: string }) {
	return (
		<div className='flex flex-col items-center justify-center py-12 text-center'>
			<div className='text-6xl mb-4 opacity-50'>{icon}</div>
			<p className='text-foreground/60'>{message}</p>
		</div>
	)
}

// Форматирование денег
const formatMoney = (amount: number) => `${amount.toLocaleString('ru-RU')} ₽`

// Форматирование даты
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

// Стиль для tooltip
const tooltipStyle = {
	backgroundColor: '#1a1a1a',
	border: '1px solid rgba(255, 255, 255, 0.2)',
	borderRadius: '8px',
	color: '#ffffff',
	padding: '8px 12px',
}

// Стиль для элементов внутри tooltip
const tooltipItemStyle = {
	color: '#ffffff',
}

export default function AdminStatsPage() {
	const token = useAppSelector((state) => state.auth.token)
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

	// Не делаем запросы если нет токена
	const shouldSkip = !token || !isAuthenticated

	const {
		data: overview,
		isLoading: overviewLoading,
		error: overviewError,
	} = useGetStatsOverviewQuery(undefined, {
		refetchOnMountOrArgChange: true,
		skip: shouldSkip,
	})
	const {
		data: users,
		isLoading: usersLoading,
		error: usersError,
	} = useGetStatsUsersQuery(undefined, {
		refetchOnMountOrArgChange: true,
		skip: shouldSkip,
	})
	const {
		data: orders,
		isLoading: ordersLoading,
		error: ordersError,
	} = useGetStatsOrdersQuery(undefined, {
		refetchOnMountOrArgChange: true,
		skip: shouldSkip,
	})
	const {
		data: revenue,
		isLoading: revenueLoading,
		error: revenueError,
	} = useGetStatsRevenueQuery(undefined, {
		refetchOnMountOrArgChange: true,
		skip: shouldSkip,
	})
	const {
		data: products,
		isLoading: productsLoading,
		error: productsError,
	} = useGetStatsProductsQuery(undefined, {
		refetchOnMountOrArgChange: true,
		skip: shouldSkip,
	})
	const {
		data: topProducts,
		isLoading: topProductsLoading,
		error: topProductsError,
	} = useGetStatsTopProductsQuery(10, {
		refetchOnMountOrArgChange: true,
		skip: shouldSkip,
	})
	const {
		data: recentUsers,
		isLoading: recentUsersLoading,
		error: recentUsersError,
	} = useGetStatsRecentUsersQuery(5, {
		refetchOnMountOrArgChange: true,
		skip: shouldSkip,
	})
	const {
		data: recentOrders,
		isLoading: recentOrdersLoading,
		error: recentOrdersError,
	} = useGetStatsRecentOrdersQuery(10, {
		refetchOnMountOrArgChange: true,
		skip: shouldSkip,
	})

	const isLoading =
		overviewLoading ||
		usersLoading ||
		ordersLoading ||
		revenueLoading ||
		productsLoading ||
		topProductsLoading ||
		recentUsersLoading ||
		recentOrdersLoading

	const hasError =
		overviewError ||
		usersError ||
		ordersError ||
		revenueError ||
		productsError ||
		topProductsError ||
		recentUsersError ||
		recentOrdersError

	// Ждем восстановления токена из localStorage
	const [authReady, setAuthReady] = useState(false)

	useEffect(() => {
		// Проверяем localStorage напрямую
		const checkAuth = () => {
			if (typeof window !== 'undefined') {
				const localToken = localStorage.getItem('token')
				if (localToken) {
					setAuthReady(true)
				} else {
					// Если токена нет в localStorage, ждем немного для восстановления через Redux
					setTimeout(() => {
						setAuthReady(true)
					}, 200)
				}
			} else {
				setAuthReady(true)
			}
		}

		checkAuth()
	}, [])

	// Если токен еще не восстановлен, показываем загрузку
	if (!authReady) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<Loader />
			</div>
		)
	}

	// Если токен не найден после восстановления
	if (!token || !isAuthenticated) {
		// Проверяем, есть ли токен в localStorage
		const localToken =
			typeof window !== 'undefined' ? localStorage.getItem('token') : null

		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center max-w-md px-4'>
					<div className='text-6xl mb-4'>🔒</div>
					<p className='text-foreground text-lg font-semibold mb-2'>
						{localToken ? 'Проблема с авторизацией' : 'Требуется авторизация'}
					</p>
					<p className='text-foreground/60 text-sm mb-4'>
						{localToken
							? 'Токен найден, но не удалось восстановить сессию. Попробуйте обновить страницу.'
							: 'Для просмотра статистики необходимо войти в систему'}
					</p>
					<button
						onClick={() => window.location.reload()}
						className='px-4 py-2 bg-primary hover:bg-primary-hover rounded-lg text-white text-sm transition-colors'
					>
						🔄 Обновить страницу
					</button>
				</div>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<Loader />
			</div>
		)
	}

	// Данные для графиков
	const userGrowthData = users
		? [
				{ period: 'Сегодня', count: users.new_users_today },
				{ period: 'Неделя', count: users.new_users_this_week },
				{ period: 'Месяц', count: users.new_users_this_month },
		  ]
		: []

	const orderStatusData = orders
		? [
				{ name: 'Оплачено', value: orders.paid_orders, color: '#22c55e' }, // Более яркий зеленый
				{
					name: 'Завершено',
					value: orders.completed_orders,
					color: '#3b82f6', // Синий
				},
				{ name: 'Ожидает', value: orders.pending_orders, color: '#f59e0b' }, // Оранжевый
				{ name: 'Отменено', value: orders.cancelled_orders, color: '#ef4444' }, // Красный
		  ]
		: []

	const revenueData = revenue
		? [
				{ period: 'Сегодня', revenue: revenue.revenue_today },
				{ period: 'Неделя', revenue: revenue.revenue_this_week },
				{ period: 'Месяц', revenue: revenue.revenue_this_month },
		  ]
		: []

	const productStatusData = products
		? [
				{
					name: 'Активные',
					value: products.active_products,
					color: '#6366f1', // Яркий индиго/фиолетовый
				},
				{
					name: 'Неактивные',
					value: products.inactive_products,
					color: '#64748b', // Светло-серый для контраста
				},
		  ]
		: []

	const getStatusColor = (status: string) => {
		const colors: Record<string, string> = {
			pending: 'bg-orange-500/20 text-orange-400',
			paid: 'bg-green-500/20 text-green-400',
			completed: 'bg-blue-500/20 text-blue-400',
			cancelled: 'bg-red-500/20 text-red-400',
		}
		return colors[status] || 'bg-gray-500/20 text-gray-400'
	}

	const getStatusText = (status: string) => {
		const texts: Record<string, string> = {
			pending: 'Ожидает',
			paid: 'Оплачено',
			completed: 'Завершено',
			cancelled: 'Отменено',
		}
		return texts[status] || status
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			<AdminHeader title='Статистика' />
			<div className='p-6'>
				<motion.div
					variants={container}
					initial='hidden'
					animate='show'
					className='max-w-7xl mx-auto space-y-6'
				>
					{/* Ошибки */}
					{hasError && (
						<motion.div
							variants={item}
							className='bg-red-500/10 border border-red-500/30 rounded-xl p-4'
						>
							<p className='text-red-400 text-sm font-semibold mb-3'>
								⚠️ Некоторые данные не удалось загрузить
							</p>
							<div className='text-xs text-red-400/80 space-y-1.5 mb-3'>
								{overviewError && (
									<div className='flex items-center gap-2'>
										<span>• Общая статистика:</span>
										<span className='font-semibold'>
											{'status' in overviewError
												? `Ошибка ${overviewError.status}`
												: 'Не удалось загрузить'}
										</span>
									</div>
								)}
								{usersError && (
									<div className='flex items-center gap-2'>
										<span>• Пользователи:</span>
										<span className='font-semibold'>
											{'status' in usersError
												? `Ошибка ${usersError.status}`
												: 'Не удалось загрузить'}
										</span>
									</div>
								)}
								{ordersError && (
									<div className='flex items-center gap-2'>
										<span>• Заказы:</span>
										<span className='font-semibold'>
											{'status' in ordersError
												? `Ошибка ${ordersError.status}`
												: 'Не удалось загрузить'}
										</span>
									</div>
								)}
								{revenueError && (
									<div className='flex items-center gap-2'>
										<span>• Выручка:</span>
										<span className='font-semibold'>
											{'status' in revenueError
												? `Ошибка ${revenueError.status}`
												: 'Не удалось загрузить'}
										</span>
									</div>
								)}
								{productsError && (
									<div className='flex items-center gap-2'>
										<span>• Товары:</span>
										<span className='font-semibold'>
											{'status' in productsError
												? `Ошибка ${productsError.status}`
												: 'Не удалось загрузить'}
										</span>
									</div>
								)}
								{topProductsError && (
									<div className='flex items-center gap-2'>
										<span>• Топ товары:</span>
										<span className='font-semibold'>
											{'status' in topProductsError
												? `Ошибка ${topProductsError.status}`
												: 'Не удалось загрузить'}
										</span>
									</div>
								)}
								{recentUsersError && (
									<div className='flex items-center gap-2'>
										<span>• Последние пользователи:</span>
										<span className='font-semibold'>
											{'status' in recentUsersError
												? `Ошибка ${recentUsersError.status}`
												: 'Не удалось загрузить'}
										</span>
									</div>
								)}
								{recentOrdersError && (
									<div className='flex items-center gap-2'>
										<span>• Последние заказы:</span>
										<span className='font-semibold'>
											{'status' in recentOrdersError
												? `Ошибка ${recentOrdersError.status}`
												: 'Не удалось загрузить'}
										</span>
									</div>
								)}
							</div>
							<button
								onClick={() => window.location.reload()}
								className='mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm transition-colors'
							>
								🔄 Обновить страницу
							</button>
						</motion.div>
					)}

					{/* Overview Cards */}
					{overview && (
						<motion.div
							variants={container}
							className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
						>
							<StatCard
								title='Общая выручка'
								value={formatMoney(overview.total_revenue)}
								icon='💰'
								color='green'
							/>
							<StatCard
								title='Всего заказов'
								value={overview.total_orders}
								icon='📦'
								color='blue'
							/>
							<StatCard
								title='Пользователи'
								value={overview.total_users}
								subtitle={`${overview.total_users_with_orders} с заказами`}
								icon='👥'
								color='purple'
							/>
							<StatCard
								title='Товары'
								value={overview.total_products}
								subtitle={`${overview.active_products} активных`}
								icon='🛍️'
								color='orange'
								warning={
									overview.out_of_stock_products > 0
										? `${overview.out_of_stock_products} нет в наличии`
										: undefined
								}
							/>
						</motion.div>
					)}

					{/* Revenue Section */}
					<motion.div variants={item} className='bg-element-bg rounded-2xl p-6'>
						<h2 className='text-2xl font-bold text-foreground mb-6'>
							💰 Выручка
						</h2>
						{revenue ? (
							<>
								<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
									<div className='bg-background/50 rounded-xl p-4'>
										<div className='text-sm text-foreground/70 mb-1'>
											Сегодня
										</div>
										<div className='text-2xl font-bold text-foreground'>
											{formatMoney(revenue.revenue_today)}
										</div>
									</div>
									<div className='bg-background/50 rounded-xl p-4'>
										<div className='text-sm text-foreground/70 mb-1'>
											Неделя
										</div>
										<div className='text-2xl font-bold text-foreground'>
											{formatMoney(revenue.revenue_this_week)}
										</div>
									</div>
									<div className='bg-background/50 rounded-xl p-4'>
										<div className='text-sm text-foreground/70 mb-1'>Месяц</div>
										<div className='text-2xl font-bold text-foreground'>
											{formatMoney(revenue.revenue_this_month)}
										</div>
									</div>
								</div>
								<ResponsiveContainer width='100%' height={300}>
									<BarChart data={revenueData}>
										<CartesianGrid strokeDasharray='3 3' stroke='#ffffff10' />
										<XAxis dataKey='period' stroke='#ffffff60' />
										<YAxis stroke='#ffffff60' />
										<Tooltip
											contentStyle={tooltipStyle}
											formatter={(value) => [
												formatMoney(value as number),
												'Выручка',
											]}
											labelStyle={{ color: '#ffffff' }}
										/>
										<Bar
											dataKey='revenue'
											fill='#22c55e'
											radius={[8, 8, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
								<div className='mt-4 text-center text-sm text-foreground/60'>
									Средний чек: {formatMoney(revenue.average_order_value)}
								</div>
							</>
						) : (
							<EmptyState icon='💰' message='Пока нет данных о выручке' />
						)}
					</motion.div>

					{/* Orders & Users Section */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{/* Orders */}
						<motion.div
							variants={item}
							className='bg-element-bg rounded-2xl p-6'
						>
							<h2 className='text-2xl font-bold text-foreground mb-6'>
								📦 Заказы
							</h2>
							{orders ? (
								<>
									<ResponsiveContainer width='100%' height={250}>
										<PieChart>
											<Pie
												data={orderStatusData}
												cx='50%'
												cy='50%'
												labelLine={false}
												label={({ name, percent }) =>
													`${name}: ${((percent || 0) * 100).toFixed(0)}%`
												}
												outerRadius={80}
												fill='#8884d8'
												dataKey='value'
											>
												{orderStatusData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</Pie>
											<Tooltip
												contentStyle={tooltipStyle}
												labelStyle={{ color: '#ffffff' }}
												itemStyle={tooltipItemStyle}
												cursor={{ fill: 'transparent' }}
											/>
										</PieChart>
									</ResponsiveContainer>
									<div className='mt-4 space-y-2'>
										{orderStatusData.map((item) => (
											<div
												key={item.name}
												className='flex items-center justify-between text-sm'
											>
												<div className='flex items-center gap-2'>
													<div
														className='w-3 h-3 rounded-full'
														style={{ backgroundColor: item.color }}
													/>
													<span className='text-foreground/70'>
														{item.name}
													</span>
												</div>
												<span className='text-foreground font-semibold'>
													{item.value}
												</span>
											</div>
										))}
									</div>
								</>
							) : (
								<EmptyState icon='📦' message='Пока нет заказов' />
							)}
						</motion.div>

						{/* Users */}
						<motion.div
							variants={item}
							className='bg-element-bg rounded-2xl p-6'
						>
							<h2 className='text-2xl font-bold text-foreground mb-6'>
								👥 Пользователи
							</h2>
							{users ? (
								<>
									<ResponsiveContainer width='100%' height={250}>
										<BarChart data={userGrowthData}>
											<CartesianGrid strokeDasharray='3 3' stroke='#ffffff10' />
											<XAxis dataKey='period' stroke='#ffffff60' />
											<YAxis stroke='#ffffff60' />
											<Tooltip
												contentStyle={tooltipStyle}
												formatter={(value) => [
													value as number,
													'Пользователей',
												]}
												labelStyle={{ color: '#ffffff' }}
											/>
											<Bar
												dataKey='count'
												fill='#8b5cf6'
												radius={[8, 8, 0, 0]}
											/>
										</BarChart>
									</ResponsiveContainer>
									<div className='mt-4 grid grid-cols-3 gap-4'>
										<div className='text-center'>
											<div className='text-sm text-foreground/70'>Всего</div>
											<div className='text-xl font-bold text-foreground'>
												{users.total_users}
											</div>
										</div>
										<div className='text-center'>
											<div className='text-sm text-foreground/70'>Админы</div>
											<div className='text-xl font-bold text-foreground'>
												{users.admin_users}
											</div>
										</div>
										{users.banned_users > 0 && (
											<div className='text-center'>
												<div className='text-sm text-red-400'>Забанено</div>
												<div className='text-xl font-bold text-red-400'>
													{users.banned_users}
												</div>
											</div>
										)}
									</div>
								</>
							) : (
								<EmptyState icon='👥' message='Пока нет пользователей' />
							)}
						</motion.div>
					</div>

					{/* Products */}
					<motion.div variants={item} className='bg-element-bg rounded-2xl p-6'>
						<h2 className='text-2xl font-bold text-foreground mb-6'>
							🛍️ Товары
						</h2>
						{products ? (
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
								<div>
									<ResponsiveContainer width='100%' height={200}>
										<PieChart>
											<Pie
												data={productStatusData}
												cx='50%'
												cy='50%'
												innerRadius={60}
												outerRadius={80}
												fill='#8884d8'
												paddingAngle={5}
												dataKey='value'
											>
												{productStatusData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</Pie>
											<Tooltip
												contentStyle={tooltipStyle}
												labelStyle={{ color: '#ffffff' }}
												itemStyle={tooltipItemStyle}
												cursor={{ fill: 'transparent' }}
											/>
										</PieChart>
									</ResponsiveContainer>
								</div>
								<div className='space-y-4'>
									<div className='bg-background/50 rounded-xl p-4'>
										<div className='text-sm text-foreground/70 mb-1'>
											Всего товаров
										</div>
										<div className='text-2xl font-bold text-foreground'>
											{products.total_products}
										</div>
									</div>
									<div className='bg-background/50 rounded-xl p-4'>
										<div className='text-sm text-foreground/70 mb-1'>
											Активных
										</div>
										<div className='text-2xl font-bold text-green-400'>
											{products.active_products}
										</div>
									</div>
									{products.out_of_stock_products > 0 && (
										<div className='bg-red-500/10 rounded-xl p-4'>
											<div className='text-sm text-red-400 mb-1'>
												⚠️ Нет в наличии
											</div>
											<div className='text-2xl font-bold text-red-400'>
												{products.out_of_stock_products}
											</div>
										</div>
									)}
									{products.low_stock_products > 0 && (
										<div className='bg-orange-500/10 rounded-xl p-4'>
											<div className='text-sm text-orange-400 mb-1'>
												⚡ Мало на складе
											</div>
											<div className='text-2xl font-bold text-orange-400'>
												{products.low_stock_products}
											</div>
										</div>
									)}
								</div>
							</div>
						) : (
							<EmptyState icon='🛍️' message='Пока нет товаров' />
						)}
					</motion.div>

					{/* Top Products */}
					<motion.div variants={item} className='bg-element-bg rounded-2xl p-6'>
						<h2 className='text-2xl font-bold text-foreground mb-6'>
							🏆 Топ товаров
						</h2>
						{topProducts && topProducts.length > 0 ? (
							<div className='space-y-3'>
								{topProducts.map((product, index) => {
									const maxRevenue = Math.max(
										...topProducts.map((p) => p.revenue)
									)
									const percentage = (product.revenue / maxRevenue) * 100

									return (
										<div
											key={product.product_id}
											className='bg-background/50 rounded-xl p-4'
										>
											<div className='flex items-center gap-4 mb-2'>
												<div className='text-2xl font-bold text-foreground/40'>
													#{index + 1}
												</div>
												<div className='flex-1'>
													<div className='text-foreground font-semibold'>
														{product.product_title}
													</div>
													<div className='text-sm text-foreground/60'>
														{product.orders_count} заказов •{' '}
														{formatMoney(product.revenue)}
													</div>
												</div>
											</div>
											<div className='w-full bg-background rounded-full h-2'>
												<div
													className='bg-linear-to-r from-primary to-primary-hover h-2 rounded-full transition-all duration-500'
													style={{ width: `${percentage}%` }}
												/>
											</div>
										</div>
									)
								})}
							</div>
						) : (
							<EmptyState icon='🏆' message='Пока нет проданных товаров' />
						)}
					</motion.div>

					{/* Recent Orders */}
					<motion.div variants={item} className='bg-element-bg rounded-2xl p-6'>
						<h2 className='text-2xl font-bold text-foreground mb-6'>
							📦 Последние заказы
						</h2>
						{recentOrders && recentOrders.length > 0 ? (
							<div className='overflow-x-auto'>
								<table className='w-full'>
									<thead>
										<tr className='border-b border-white/10'>
											<th className='text-left py-3 px-4 text-sm text-foreground/70'>
												ID
											</th>
											<th className='text-left py-3 px-4 text-sm text-foreground/70'>
												Пользователь
											</th>
											<th className='text-left py-3 px-4 text-sm text-foreground/70'>
												Статус
											</th>
											<th className='text-left py-3 px-4 text-sm text-foreground/70'>
												Сумма
											</th>
											<th className='text-left py-3 px-4 text-sm text-foreground/70'>
												Дата
											</th>
										</tr>
									</thead>
									<tbody>
										{recentOrders.map((order) => (
											<tr
												key={order.id}
												className='border-b border-white/5 hover:bg-background/50 transition-colors'
											>
												<td className='py-3 px-4 text-foreground'>
													#{order.id}
												</td>
												<td className='py-3 px-4 text-foreground'>
													User #{order.user_id}
												</td>
												<td className='py-3 px-4'>
													<span
														className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
															order.status
														)}`}
													>
														{getStatusText(order.status)}
													</span>
												</td>
												<td className='py-3 px-4 text-foreground font-semibold'>
													{formatMoney(order.amount)}
												</td>
												<td className='py-3 px-4 text-foreground/60 text-sm'>
													{formatDate(order.created_at)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<EmptyState icon='📦' message='Пока нет заказов' />
						)}
					</motion.div>

					{/* Recent Users */}
					<motion.div variants={item} className='bg-element-bg rounded-2xl p-6'>
						<h2 className='text-2xl font-bold text-foreground mb-6'>
							👥 Последние пользователи
						</h2>
						{recentUsers && recentUsers.length > 0 ? (
							<div className='space-y-3'>
								{recentUsers.map((user) => (
									<div
										key={user.id}
										className='bg-background/50 rounded-xl p-4 flex items-center gap-4'
									>
										<div className='flex-1'>
											<div className='text-foreground font-semibold'>
												{user.first_name || 'Без имени'}
												{user.username && (
													<span className='text-foreground/60 text-sm ml-2'>
														@{user.username}
													</span>
												)}
											</div>
											<div className='text-sm text-foreground/60'>
												ID: {user.telegram_id} • {formatDate(user.created_at)}
											</div>
										</div>
										<div className='flex gap-2'>
											{user.is_admin && (
												<span className='px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400'>
													Админ
												</span>
											)}
											{user.is_banned && (
												<span className='px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400'>
													Забанен
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<EmptyState icon='👥' message='Пока нет пользователей' />
						)}
					</motion.div>
				</motion.div>
			</div>
		</div>
	)
}
