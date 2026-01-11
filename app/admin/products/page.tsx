'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
	useGetAdminProductsQuery,
	useDeleteProductMutation,
} from '@/app/store/api/adminApi'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react'
import Loader from '@/app/components/Loader/Loader'
import Image from 'next/image'
import AdminHeader from '@/app/components/admin/shared/AdminHeader'
import { useAppSelector } from '@/app/store'
import { selectIsAuthenticated } from '@/app/store/slices/authSlice'

const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

const getImageUrl = (imagePath: string | null) => {
	if (!imagePath) return '/placeholder.png'
	if (imagePath.startsWith('http')) return imagePath
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
	const baseUrl = apiUrl.replace('/api', '')
	const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
	return `${baseUrl}${path}`
}

// Функция для получения первого изображения из массива или JSON-строки
const getFirstImage = (images: string[] | string | null): string | null => {
	if (!images) return null

	// Если это строка, пытаемся распарсить как JSON
	if (typeof images === 'string') {
		try {
			const parsed = JSON.parse(images)
			return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null
		} catch {
			// Если не JSON, возвращаем как есть
			return images
		}
	}

	// Если это массив, берем первый элемент
	return Array.isArray(images) && images.length > 0 ? images[0] : null
}

export default function AdminProductsPage() {
	const router = useRouter()
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	const { data: products, isLoading } = useGetAdminProductsQuery(
		{
			limit: 100,
			offset: 0,
		},
		{ skip: !isAuthenticated }
	)
	const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation()
	const [activeMenu, setActiveMenu] = useState<number | null>(null)
	const menuRef = useRef<HTMLDivElement>(null)

	// Сортировка товаров: приоритетные первыми
	const sortedProducts =
		products?.slice().sort((a, b) => {
			if (a.is_priority && !b.is_priority) return -1
			if (!a.is_priority && b.is_priority) return 1
			return 0
		}) || []

	// Закрываем меню при клике вне его
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setActiveMenu(null)
			}
		}

		if (activeMenu !== null) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [activeMenu])

	const handleDelete = async (id: number, title: string) => {
		if (confirm(`Удалить товар "${title}"?`)) {
			try {
				await deleteProduct(id).unwrap()
			} catch {
				alert('Не удалось удалить товар')
			}
		}
		setActiveMenu(null)
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			<AdminHeader
				title='Товары'
				actions={
					<Button
						onClick={() => router.push('/admin/products/create')}
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
				) : sortedProducts && sortedProducts.length > 0 ? (
					<div className='space-y-3'>
						{sortedProducts.map((product) => (
							<div
								key={product.id}
								className='bg-element-bg rounded-2xl p-4 flex gap-4'
							>
								{/* Image */}
								<div className='w-16 h-16 rounded-xl overflow-hidden bg-element-bg/60 shrink-0'>
									<Image
										src={getImageUrl(getFirstImage(product.images))}
										alt={product.title}
										width={64}
										height={64}
										className='w-full h-full object-contain'
										unoptimized
									/>
								</div>

								{/* Info */}
								<div className='flex-1 min-w-0'>
									<div className='flex items-center gap-2 mb-1'>
										<h3 className='text-foreground font-medium line-clamp-1'>
											{product.title}
										</h3>
										{product.is_priority && (
											<span className='text-yellow-500 text-sm'>★</span>
										)}
									</div>
									<div className='flex items-center gap-3 text-sm'>
										<span className='text-primary font-semibold'>
											{rub(product.price)}
										</span>
										<span className='text-foreground/50'>
											Остаток: {product.stock_count}
										</span>
										{!product.is_active && (
											<span className='text-destructive text-xs'>
												Неактивен
											</span>
										)}
									</div>
								</div>

								{/* Actions */}
								<div
									className='relative'
									ref={activeMenu === product.id ? menuRef : null}
								>
									<Button
										onClick={() =>
											setActiveMenu(
												activeMenu === product.id ? null : product.id
											)
										}
										variant='ghost'
										size='icon'
										className='w-8 h-8'
									>
										<MoreVertical className='w-4 h-4' />
									</Button>

									{activeMenu === product.id && (
										<div className='absolute right-0 top-10 bg-element-bg border border-white/10 rounded-xl p-2 min-w-[150px] shadow-xl z-10'>
											<button
												onClick={() => {
													setActiveMenu(null)
													router.push(`/admin/products/${product.id}`)
												}}
												className='w-full flex items-center gap-2 px-3 py-2 hover:bg-element-bg/60 rounded-lg text-foreground text-sm'
											>
												<Edit className='w-4 h-4' />
												Редактировать
											</button>
											<button
												onClick={() => handleDelete(product.id, product.title)}
												disabled={deleting}
												className='w-full flex items-center gap-2 px-3 py-2 hover:bg-destructive/10 rounded-lg text-destructive text-sm disabled:opacity-50'
											>
												<Trash2 className='w-4 h-4' />
												{deleting ? 'Удаление...' : 'Удалить'}
											</button>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='text-center py-12'>
						<p className='text-foreground/50'>Товары не найдены</p>
					</div>
				)}
			</div>
		</div>
	)
}
