'use client'

import { useRouter } from 'next/navigation'
import { useCreateCategoryMutation } from '@/app/store/api/adminApi'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CategoryForm } from '@/app/components/admin/forms/CategoryForm'
import {
	CategoryCreateInput,
	CategoryUpdateInput,
} from '@/app/components/admin/forms/schemas/validationSchemas'

export default function CreateCategoryPage() {
	const router = useRouter()
	const [createCategory, { isLoading: creating }] = useCreateCategoryMutation()

	const handleSubmit = async (
		data: CategoryCreateInput | CategoryUpdateInput,
		images: { main?: File; additional?: File },
		_deletedImages?: { main?: boolean; additional?: boolean }
	) => {
		try {
			// 1. Создаем категорию
			const category = await createCategory(data).unwrap()

			// 2. Загружаем главное изображение, если выбрано
			if (images.main) {
				const formData = new FormData()
				formData.append('file', images.main)

				await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${category.id}/main-image`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
						body: formData,
					}
				)
			}

			// 3. Загружаем дополнительное изображение, если выбрано
			if (images.additional) {
				const formData = new FormData()
				formData.append('file', images.additional)

				await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${category.id}/additional-image`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
						body: formData,
					}
				)
			}

			router.push('/admin/categories')
		} catch (err) {
			console.error('Error creating category:', err)
			alert('Ошибка при создании категории')
		}
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
							Создать категорию
						</h1>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className='container mx-auto px-4 py-6 max-w-2xl'>
				<CategoryForm
					mode='create'
					onSubmit={handleSubmit}
					isSubmitting={creating}
					submitText='Создать'
				/>
			</div>
		</div>
	)
}
