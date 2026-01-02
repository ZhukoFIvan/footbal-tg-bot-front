'use client'

import { useGetCategoriesQuery } from '@/app/store/api/categoriesApi'
import Category from './Category'
import { useRouter } from 'next/navigation'

export default function CategoriesList() {
	const router = useRouter()
	const { data: categories, error } = useGetCategoriesQuery()

	if (error) {
		return (
			<div className='flex items-center justify-center p-4'>
				<div className='text-center'>
					<p className='text-destructive text-lg font-semibold mb-2'>
						Ошибка загрузки категорий
					</p>
					<p className='text-muted-foreground'>Попробуйте обновить страницу</p>
				</div>
			</div>
		)
	}

	if (!categories || categories.length === 0) {
		return (
			<div className='flex items-center justify-center p-4'>
				<p className='text-muted-foreground text-lg'>Категории не найдены</p>
			</div>
		)
	}

	const handleCategoryClick = (categoryId: number) => {
		router.push(`/catalog?category_id=${categoryId}`)
	}

	const displayCategories = categories.slice(0, 3)

	return (
		<div className='flex flex-col gap-2 p-4'>
			{displayCategories.map((category, index) => (
				<Category
					key={category.id}
					category={category}
					index={index}
					onClick={() => handleCategoryClick(category.id)}
				/>
			))}
		</div>
	)
}
