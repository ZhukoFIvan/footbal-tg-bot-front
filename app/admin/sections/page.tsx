'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	useGetAdminSectionsQuery,
	useDeleteSectionMutation,
} from '@/app/store/api/adminApi'
import { useAppSelector } from '@/app/store/hooks'
import { selectIsAuthenticated } from '@/app/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, MoreVertical, Clock } from 'lucide-react'
import Loader from '@/app/components/Loader/Loader'
import Image from 'next/image'
import AdminHeader from '@/app/components/admin/shared/AdminHeader'

const getImageUrl = (imagePath: string | null) => {
	if (!imagePath) return '/placeholder.png'
	if (imagePath.startsWith('http')) return imagePath
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
	const baseUrl = apiUrl.replace('/api', '')
	return `${baseUrl}${imagePath}`
}

export default function AdminSectionsPage() {
	const router = useRouter()
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	const { data: sections, isLoading } = useGetAdminSectionsQuery(undefined, {
		skip: !isAuthenticated,
	})
	const [deleteSection] = useDeleteSectionMutation()
	const [activeMenu, setActiveMenu] = useState<number | null>(null)

	const handleDelete = async (id: number) => {
		if (confirm('Удалить секцию?')) {
			await deleteSection(id)
		}
		setActiveMenu(null)
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			<AdminHeader
				title='Секции'
				actions={
					<Button
						onClick={() => router.push('/admin/sections/create')}
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
				) : sections && sections.length > 0 ? (
					<div className='space-y-3'>
						{sections.map((section) => (
							<div
								key={section.id}
								className='bg-element-bg rounded-2xl p-4 flex gap-4'
							>
								{/* Image */}
								<div className='w-20 h-20 rounded-xl overflow-hidden bg-element-bg/60 shrink-0'>
									<Image
										src={getImageUrl(section.image)}
										alt={section.name}
										width={80}
										height={80}
										className='w-full h-full object-cover'
										unoptimized
									/>
								</div>

								{/* Info */}
								<div className='flex-1 min-w-0'>
									<h3 className='text-foreground font-medium mb-1'>
										{section.name}
									</h3>
									<div className='flex items-center gap-3 text-sm text-foreground/50'>
										{section.route && <span>Route: {section.route}</span>}
										{section.end_time && (
											<span className='flex items-center gap-1'>
												<Clock className='w-3 h-3' />
												До:{' '}
												{new Date(section.end_time).toLocaleDateString('ru-RU')}
											</span>
										)}
										{!section.is_active && (
											<span className='text-destructive text-xs'>
												Неактивна
											</span>
										)}
									</div>
								</div>

								{/* Actions */}
								<div className='relative'>
									<Button
										onClick={() =>
											setActiveMenu(
												activeMenu === section.id ? null : section.id
											)
										}
										variant='ghost'
										size='icon'
										className='w-8 h-8'
									>
										<MoreVertical className='w-4 h-4' />
									</Button>

									{activeMenu === section.id && (
										<div className='absolute right-0 top-10 bg-element-bg border border-white/10 rounded-xl p-2 min-w-[150px] shadow-xl z-10'>
											<button
												onClick={() =>
													router.push(`/admin/sections/${section.id}`)
												}
												className='w-full flex items-center gap-2 px-3 py-2 hover:bg-element-bg/60 rounded-lg text-foreground text-sm'
											>
												<Edit className='w-4 h-4' />
												Редактировать
											</button>
											<button
												onClick={() => handleDelete(section.id)}
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
						<p className='text-foreground/50'>Секции не найдены</p>
						<Button
							onClick={() => router.push('/admin/sections/create')}
							className='mt-4 bg-primary hover:bg-primary-hover'
						>
							<Plus className='w-4 h-4 mr-2' />
							Создать первую секцию
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
