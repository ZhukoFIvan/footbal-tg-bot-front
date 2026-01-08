'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import {
	useGetAdminCategoriesQuery,
	useUpdateCategoryMutation,
} from '@/app/store/api/adminApi'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Loader from '@/app/components/Loader/Loader'
import { CategoryForm } from '@/app/components/admin/forms/CategoryForm'
import { CategoryUpdateInput } from '@/app/components/admin/forms/schemas/validationSchemas'

const getImageUrl = (imagePath: string | null) => {
	if (!imagePath) return null
	if (imagePath.startsWith('http')) return imagePath
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
	const baseUrl = apiUrl.replace('/api', '')
	return `${baseUrl}${imagePath}`
}

export default function EditCategoryPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const resolvedParams = use(params)
	const router = useRouter()
	const categoryId = parseInt(resolvedParams.id)

	const { data: categories, isLoading } = useGetAdminCategoriesQuery()
	const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation()

	const category = categories?.find((c) => c.id === categoryId)

	const handleSubmit = async (
		data: CategoryUpdateInput,
		images: { main?: File; additional?: File },
		deletedImages?: { main?: boolean; additional?: boolean }
	) => {
		try {
			// 1. Обновляем данные категории
			await updateCategory({
				id: categoryId,
				data,
			}).unwrap()

			// 2. Удаляем главное изображение, если пользователь его удалил и не загрузил новое
			if (deletedImages?.main && !images.main) {
				await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${categoryId}/main-image`,
					{
						method: 'DELETE',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}
				)
			}

			// 3. Загружаем главное изображение, если выбрано
			// При POST на этот эндпоинт старая картинка автоматически заменяется на новую
			if (images.main) {
				const formData = new FormData()
				formData.append('file', images.main)

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${categoryId}/main-image`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
						body: formData,
					}
				)

				if (!response.ok) {
					throw new Error('Failed to upload main image')
				}
			}

			// 4. Удаляем дополнительное изображение, если пользователь его удалил и не загрузил новое
			if (deletedImages?.additional && !images.additional) {
				await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${categoryId}/additional-image`,
					{
						method: 'DELETE',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}
				)
			}

			// 5. Загружаем дополнительное изображение, если выбрано
			// При POST на этот эндпоинт старая картинка автоматически заменяется на новую
			if (images.additional) {
				const formData = new FormData()
				formData.append('file', images.additional)

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${categoryId}/additional-image`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
						body: formData,
					}
				)

				if (!response.ok) {
					throw new Error('Failed to upload additional image')
				}
			}

			router.push('/admin/categories')
		} catch (err) {
			console.error('Error updating category:', err)
			alert('Ошибка при обновлении категории')
		}
	}

	if (isLoading || !category) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			{/* Header */}
			<div className='sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5'>
				<div className='container mx-auto px-4 py-4'>
					<div className='flex items-center gap-3'>
						<Button
							onClick={() => router.push('/admin/categories')}
							variant='ghost'
							size='icon'
						>
							<ArrowLeft className='w-5 h-5' />
						</Button>
						<h1 className='text-2xl font-bold text-foreground'>
							Редактировать категорию
						</h1>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className='container mx-auto px-4 py-6 max-w-2xl'>
				<CategoryForm
					mode='update'
					defaultValues={{
						title: category.title,
						slug: category.slug,
						description: category.description,
						sort_order: category.sort_order,
						show_on_main: category.show_on_main,
						is_active: category.is_active,
					}}
					onSubmit={handleSubmit}
					isSubmitting={updating}
					existingMainImage={getImageUrl(category.main_image)}
					existingAdditionalImage={getImageUrl(category.additional_image)}
				/>
			</div>
		</div>
	)
}
