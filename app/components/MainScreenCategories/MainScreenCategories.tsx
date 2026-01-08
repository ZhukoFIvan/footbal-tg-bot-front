'use client'

import { useGetMainScreenCategoriesQuery } from '@/app/store/api/categoriesApi'
import { useRouter } from 'next/navigation'
import ProductCard from '../ProductCard/ProductCard'
import { ChevronRight } from 'lucide-react'

export default function MainScreenCategories() {
	const router = useRouter()
	const { data: categories } = useGetMainScreenCategoriesQuery({
		limit_per_category: 8,
	})

	if (!categories || categories.length === 0) {
		return null
	}

	const handleShowAll = (categoryId: number) => {
		router.push(`/catalog?category_id=${categoryId}`)
	}

	return (
		<div className='space-y-8'>
			{categories.map(({ category, products, total_products }) => {
				// Сортировка товаров: приоритетные первыми
				const sortedProducts = [...products].sort((a, b) => {
					if (a.is_priority && !b.is_priority) return -1
					if (!a.is_priority && b.is_priority) return 1
					return 0
				})

				return (
				<div key={category.id}>
					<div className='flex items-center justify-between mb-4 px-4'>
						<div className='flex items-center gap-2'>
							<h2 className='text-2xl font-bold text-foreground'>
								{category.title}
							</h2>
							<span className='text-sm text-white bg-primary rounded-full px-3 py-0.3'>
								{total_products}
							</span>
						</div>
						<button
							onClick={() => handleShowAll(category.id)}
							className='flex items-center gap-1 text-white bg-element-bg/60 backdrop-blur-xl rounded-full px-4 py-2 text-sm font-medium'
						>
							Смотреть все
							<ChevronRight className='w-4 h-4' />
						</button>
					</div>

					{sortedProducts.length > 0 ? (
						<div
							className='overflow-x-auto scrollbar-hide touch-pan-x'
							style={{
								WebkitOverflowScrolling: 'touch',
								scrollBehavior: 'smooth',
							}}
						>
							<div className='flex gap-3 px-4 pb-2'>
								{sortedProducts.map((product) => (
									<div key={product.id} className='flex-shrink-0 w-[160px]'>
										<ProductCard product={product} />
									</div>
								))}
							</div>
						</div>
					) : (
						<p className='text-foreground/50 text-center py-8 px-4'>
							В этой категории пока нет товаров
						</p>
					)}
				</div>
				)
			})}
		</div>
	)
}
