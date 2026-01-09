'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	useGetAdminBadgesQuery,
	useDeleteBadgeMutation,
} from '@/app/store/api/adminApi'
import { useAppSelector } from '@/app/store/hooks'
import { selectIsAuthenticated } from '@/app/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, MoreVertical, Tag } from 'lucide-react'
import Loader from '@/app/components/Loader/Loader'
import AdminHeader from '@/app/components/admin/shared/AdminHeader'

export default function AdminBadgesPage() {
	const router = useRouter()
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	const { data: badges, isLoading } = useGetAdminBadgesQuery(undefined, {
		skip: !isAuthenticated,
	})
	const [deleteBadge] = useDeleteBadgeMutation()
	const [activeMenu, setActiveMenu] = useState<number | null>(null)

	const handleDelete = async (id: number) => {
		if (confirm('Удалить бейдж?')) {
			await deleteBadge(id)
		}
		setActiveMenu(null)
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			<AdminHeader
				title='Бейджи'
				actions={
					<Button
						onClick={() => router.push('/admin/badges/create')}
						className='bg-primary hover:bg-primary-hover'
						size='sm'
					>
						<Plus className='w-4 h-4 mr-2' />
						Добавить
					</Button>
				}
			/>

			{/* Content */}
			<div className='container mx-auto px-4 py-6'>
				{isLoading ? (
					<Loader />
				) : badges && badges.length > 0 ? (
					<div className='space-y-3'>
						{badges.map((badge) => (
							<div
								key={badge.id}
								className='bg-element-bg rounded-2xl p-4 flex gap-4 items-center'
							>
								{/* Badge Preview */}
								<div className='flex-shrink-0'>
									<span
										className='inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold'
										style={{
											backgroundColor: badge.color,
											color: badge.text_color,
										}}
									>
										{badge.title}
									</span>
								</div>

								{/* Info */}
								<div className='flex-1 min-w-0'>
									<div className='flex items-center gap-3 text-sm text-foreground/50'>
										<span>Цвет: {badge.color}</span>
										<span>Текст: {badge.text_color}</span>
										{!badge.is_active && (
											<span className='text-destructive text-xs'>
												Неактивен
											</span>
										)}
									</div>
								</div>

								{/* Actions */}
								<div className='relative'>
									<Button
										onClick={() =>
											setActiveMenu(activeMenu === badge.id ? null : badge.id)
										}
										variant='ghost'
										size='icon'
										className='w-8 h-8'
									>
										<MoreVertical className='w-4 h-4' />
									</Button>

									{activeMenu === badge.id && (
										<div className='absolute right-0 top-10 bg-element-bg border border-white/10 rounded-xl p-2 min-w-[150px] shadow-xl z-10'>
											<button
												onClick={() => router.push(`/admin/badges/${badge.id}`)}
												className='w-full flex items-center gap-2 px-3 py-2 hover:bg-element-bg/60 rounded-lg text-foreground text-sm'
											>
												<Edit className='w-4 h-4' />
												Редактировать
											</button>
											<button
												onClick={() => handleDelete(badge.id)}
												className='w-full flex items-center gap-2 px-3 py-2 hover:bg-destructive/10 rounded-lg text-destructive text-sm'
											>
												<Trash2 className='w-4 h-4' />
												Удалить
											</button>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='text-center py-12'>
						<div className='w-20 h-20 bg-element-bg rounded-full flex items-center justify-center mx-auto mb-4'>
							<Tag className='w-10 h-10 text-foreground/50' />
						</div>
						<p className='text-foreground/50 mb-4'>Бейджи не найдены</p>
						<Button
							onClick={() => router.push('/admin/badges/create')}
							className='bg-primary hover:bg-primary-hover'
						>
							<Plus className='w-4 h-4 mr-2' />
							Создать первый бейдж
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
