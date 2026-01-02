'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import {
	useGetAdminProductQuery,
	useUpdateProductMutation,
	useUploadProductImagesMutation,
	useGetAdminCategoriesQuery,
	useGetAdminSectionsQuery,
	useGetAdminBadgesQuery,
} from '@/app/store/api/adminApi'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Loader from '@/app/components/Loader/Loader'
import { ProductForm } from '@/app/components/admin/forms/ProductForm'
import { ProductUpdateInput } from '@/app/components/admin/forms/schemas/validationSchemas'

const getImageUrl = (imagePath: string | null) => {
	if (!imagePath) return null
	if (imagePath.startsWith('http')) return imagePath
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
	const baseUrl = apiUrl.replace('/api', '')
	return `${baseUrl}${imagePath}`
}

// Функция для парсинга images (может быть массив или JSON-строка)
const parseImages = (images: string[] | string | null): string[] => {
	if (!images) return []

	// Если это строка, пытаемся распарсить как JSON
	if (typeof images === 'string') {
		try {
			const parsed = JSON.parse(images)
			return Array.isArray(parsed) ? parsed : [images]
		} catch {
			// Если не JSON, возвращаем как массив из одного элемента
			return [images]
		}
	}

	// Если это массив, возвращаем как есть
	return Array.isArray(images) ? images : []
}

export default function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const resolvedParams = use(params)
	const router = useRouter()
	const productId = parseInt(resolvedParams.id)

	const {
		data: product,
		isLoading: productLoading,
		error: productError,
	} = useGetAdminProductQuery(productId)
	const { data: categories, isLoading: categoriesLoading } =
		useGetAdminCategoriesQuery()
	const { data: sections, isLoading: sectionsLoading } =
		useGetAdminSectionsQuery()
	const { data: badges, isLoading: badgesLoading } = useGetAdminBadgesQuery()

	const [updateProduct, { isLoading: updating }] = useUpdateProductMutation()
	const [uploadImages, { isLoading: uploading }] =
		useUploadProductImagesMutation()

	const handleSubmit = async (data: ProductUpdateInput, images?: File[]) => {
		try {
			await updateProduct({
				id: productId,
				data,
			}).unwrap()

			if (images && images.length > 0) {
				const formData = new FormData()
				images.forEach((file) => {
					formData.append('files', file)
				})

				await uploadImages({
					id: productId,
					body: formData,
				}).unwrap()
			}

			router.push('/admin/products')
		} catch (err) {
			console.error('Error updating product:', err)
			alert('Ошибка при обновлении продукта')
		}
	}

	if (productLoading || categoriesLoading || sectionsLoading || badgesLoading) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	if (productError) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-destructive text-lg font-semibold mb-2'>
						Ошибка загрузки товара
					</p>
					<p className='text-foreground/70 text-sm mb-4'>
						{JSON.stringify(productError)}
					</p>
					<Button onClick={() => router.push('/admin/products')}>
						Вернуться к списку
					</Button>
				</div>
			</div>
		)
	}

	if (!product) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-foreground/70 text-lg mb-4'>Товар не найден</p>
					<Button onClick={() => router.push('/admin/products')}>
						Вернуться к списку
					</Button>
				</div>
			</div>
		)
	}

	const existingImageUrls =
		parseImages(product.images)
			.map((img) => getImageUrl(img))
			.filter((url): url is string => url !== null) || []

	return (
		<div className='min-h-screen bg-background pb-24'>
			{/* Header */}
			<div className='sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5'>
				<div className='container mx-auto px-4 py-4'>
					<div className='flex items-center gap-3'>
						<Button
							onClick={() => router.push('/admin/products')}
							variant='ghost'
							size='icon'
						>
							<ArrowLeft className='w-5 h-5' />
						</Button>
						<h1 className='text-2xl font-bold text-foreground'>
							Редактировать продукт
						</h1>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className='container mx-auto px-4 py-6 max-w-2xl'>
				<ProductForm
					mode='update'
					defaultValues={{
						title: product.title,
						slug: product.slug,
						description: product.description,
						price: product.price,
						old_price: product.old_price,
						promotion_text: product.promotion_text,
						currency: product.currency,
						stock_count: product.stock_count,
						category_id: product.category_id,
						section_id: product.section_id,
						badge_id: product.badge_id,
						is_active: product.is_active,
					}}
					onSubmit={handleSubmit}
					isSubmitting={updating || uploading}
					categories={categories || []}
					sections={sections || []}
					badges={badges || []}
					existingImages={existingImageUrls}
				/>
			</div>
		</div>
	)
}
