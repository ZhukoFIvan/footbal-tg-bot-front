'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/app/store/hooks'
import {
	selectIsAdmin,
	selectIsAuthenticated,
} from '@/app/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import {
	Package,
	FolderOpen,
	Grid,
	Tag,
	LogOut,
	Gift,
	BarChart3,
	Settings,
	Ticket,
	Star,
} from 'lucide-react'

export default function AdminPage() {
	const router = useRouter()
	const isAdmin = useAppSelector(selectIsAdmin)
	const isAuthenticated = useAppSelector(selectIsAuthenticated)

	const handleLogout = () => {
		router.push('/')
	}

	// Если не авторизован или не админ - показываем сообщение
	if (!isAuthenticated || !isAdmin) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center px-4'>
				<div className='text-center max-w-md'>
					<div className='w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4'>
						<LogOut className='w-10 h-10 text-destructive' />
					</div>
					<h1 className='text-2xl font-bold text-foreground mb-2'>
						Доступ запрещен
					</h1>
					<p className='text-foreground/50 mb-6'>
						У вас нет прав администратора для доступа к этой странице
					</p>
					<Button
						onClick={() => router.push('/')}
						className='bg-primary hover:bg-primary-hover'
					>
						Вернуться на главную
					</Button>
				</div>
			</div>
		)
	}

	const sections = [
		{
			title: 'Товары',
			description: 'Управление товарами',
			icon: Package,
			href: '/admin/products',
			color: 'bg-blue-500/20 text-blue-500',
		},
		{
			title: 'Секции',
			description: 'Управление секциями',
			icon: FolderOpen,
			href: '/admin/sections',
			color: 'bg-purple-500/20 text-purple-500',
		},
		{
			title: 'Категории',
			description: 'Управление категориями',
			icon: Grid,
			href: '/admin/categories',
			color: 'bg-green-500/20 text-green-500',
		},
		{
			title: 'Бейджи',
			description: 'Управление бейджами',
			icon: Tag,
			href: '/admin/badges',
			color: 'bg-orange-500/20 text-orange-500',
		},
		{
			title: 'Промокоды',
			description: 'Управление промокодами и скидками',
			icon: Ticket,
			href: '/admin/promo-codes',
			color: 'bg-red-500/20 text-red-500',
		},
		{
			title: 'Отзывы',
			description: 'Модерация отзывов пользователей',
			icon: Star,
			href: '/admin/reviews',
			color: 'bg-amber-500/20 text-amber-500',
		},
		{
			title: 'Бонусы',
			description: 'Управление бонусами пользователей',
			icon: Gift,
			href: '/admin/bonus',
			color: 'bg-yellow-500/20 text-yellow-500',
		},
		{
			title: 'Статистика',
			description: 'Общая статистика магазина',
			icon: BarChart3,
			href: '/admin/stats',
			color: 'bg-pink-500/20 text-pink-500',
		},
		{
			title: 'Настройки',
			description: 'Настройки сайта (снег и др.)',
			icon: Settings,
			href: '/admin/settings',
			color: 'bg-cyan-500/20 text-cyan-500',
		},
	]

	return (
		<div className='min-h-screen bg-background pb-24'>
			{/* Header */}
			<div className='sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5'>
				<div className='container mx-auto px-4 py-6 flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold text-foreground'>Админ панель</h1>
						<p className='text-foreground/50 text-sm mt-1'>
							Управление контентом магазина
						</p>
					</div>
					<Button
						onClick={handleLogout}
						variant='ghost'
						size='icon'
						className='text-foreground/70 hover:text-destructive'
					>
						<LogOut className='w-5 h-5' />
					</Button>
				</div>
			</div>

			{/* Content */}
			<div className='container mx-auto px-4 py-8'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{sections.map((section) => {
						const Icon = section.icon
						return (
							<button
								key={section.href}
								onClick={() => router.push(section.href)}
								className='bg-element-bg rounded-2xl p-6 hover:bg-element-bg/80 transition-all active:scale-[0.98] text-left'
							>
								<div className='flex items-start gap-4'>
									<div
										className={`w-12 h-12 rounded-xl flex items-center justify-center ${section.color}`}
									>
										<Icon className='w-6 h-6' />
									</div>
									<div className='flex-1'>
										<h3 className='text-lg font-semibold text-foreground mb-1'>
											{section.title}
										</h3>
										<p className='text-sm text-foreground/50'>
											{section.description}
										</p>
									</div>
								</div>
							</button>
						)
					})}
				</div>
			</div>
		</div>
	)
}
