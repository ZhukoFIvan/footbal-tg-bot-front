'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useGetProductsQuery } from '../store/api/productsApi'
import { useGetSectionsQuery } from '../store/api/sectionsApi'
import CategoryFilter from '../components/CategoryFilter/CategoryFilter'
import ProductCard from '../components/ProductCard/ProductCard'
import ProductDrawer from '../components/ProductDrawer/ProductDrawer'
import Loader from '../components/Loader/Loader'
import { Product } from '../store/api/productsApi'

function CatalogContent() {
	const searchParams = useSearchParams()
	const sectionIdParam = searchParams.get('section_id')
	const categoryIdParam = searchParams.get('category_id')

	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
		categoryIdParam ? parseInt(categoryIdParam) : null
	)
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)

	// Получаем секции для отображения названия
	const { data: sections } = useGetSectionsQuery()
	const currentSection = sections?.find(
		(s) => s.id === (sectionIdParam ? parseInt(sectionIdParam) : null)
	)

	// Обновляем selectedCategoryId при изменении URL параметра
	useEffect(() => {
		if (categoryIdParam) {
			setTimeout(() => setSelectedCategoryId(parseInt(categoryIdParam)), 0)
		} else if (!sectionIdParam) {
			// Сбрасываем только если нет section_id
			setTimeout(() => setSelectedCategoryId(null), 0)
		}
	}, [categoryIdParam, sectionIdParam])

	// Параметры для запроса
	const queryParams = {
		...(selectedCategoryId && { category_id: selectedCategoryId }),
		...(sectionIdParam && { section_id: parseInt(sectionIdParam) }),
	}

	const { data: products, isLoading, error } = useGetProductsQuery(queryParams)

	// Сортировка товаров: приоритетные первыми
	const sortedProducts =
		products?.slice().sort((a, b) => {
			if (a.is_priority && !b.is_priority) return -1
			if (!a.is_priority && b.is_priority) return 1
			return 0
		}) || []

	const handleCategoryChange = (categoryId: number | null) => {
		setSelectedCategoryId(categoryId)
	}

	const handleProductClick = (product: Product) => {
		setSelectedProduct(product)
		setIsDrawerOpen(true)
	}

	const handleCloseDrawer = () => {
		setIsDrawerOpen(false)
		setTimeout(() => setSelectedProduct(null), 300)
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			<div className='sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5'>
				<div className='container mx-auto px-4 py-3'>
					<h1 className='text-2xl font-bold text-foreground mb-1'>
						{currentSection ? currentSection.name : 'Каталог товаров'}
					</h1>

					{!sectionIdParam && (
						<CategoryFilter
							selectedCategoryId={selectedCategoryId}
							onCategoryChange={handleCategoryChange}
						/>
					)}
				</div>
			</div>

			{/* Content */}
			<div className='container mx-auto px-4 py-6'>
				{isLoading && <Loader />}

				{error && (
					<div className='flex items-center justify-center py-12'>
						<div className='text-center'>
							<p className='text-destructive text-lg font-semibold mb-2'>
								Ошибка загрузки товаров
							</p>
							<p className='text-muted-foreground'>
								Попробуйте обновить страницу
							</p>
						</div>
					</div>
				)}

				{!isLoading &&
					!error &&
					sortedProducts &&
					sortedProducts.length === 0 && (
						<div className='flex items-center justify-center py-12'>
							<p className='text-muted-foreground text-lg'>Товары не найдены</p>
						</div>
					)}

				{!isLoading &&
					!error &&
					sortedProducts &&
					sortedProducts.length > 0 && (
						<div className='grid grid-cols-2 gap-4'>
							{sortedProducts.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
									onClick={() => handleProductClick(product)}
								/>
							))}
						</div>
					)}
			</div>

			<ProductDrawer
				product={selectedProduct}
				isOpen={isDrawerOpen}
				onClose={handleCloseDrawer}
			/>
		</div>
	)
}

export default function Catalog() {
	return (
		<Suspense fallback={<Loader />}>
			<CatalogContent />
		</Suspense>
	)
}
