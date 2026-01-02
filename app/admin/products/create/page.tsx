'use client'

import { useRouter } from 'next/navigation'
import {
	useCreateProductMutation,
	useUploadProductImagesMutation,
	useGetAdminCategoriesQuery,
	useGetAdminSectionsQuery,
	useGetAdminBadgesQuery,
} from '@/app/store/api/adminApi'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Loader from '@/app/components/Loader/Loader'
import { ProductForm } from '@/app/components/admin/forms/ProductForm'
import {
	ProductCreateInput,
	ProductUpdateInput,
} from '@/app/components/admin/forms/schemas/validationSchemas'

export default function CreateProductPage() {
	const router = useRouter()

	const { data: categories, isLoading: categoriesLoading } =
		useGetAdminCategoriesQuery()
	const { data: sections, isLoading: sectionsLoading } =
		useGetAdminSectionsQuery()
	const { data: badges, isLoading: badgesLoading } = useGetAdminBadgesQuery()

	const [createProduct, { isLoading: creating }] = useCreateProductMutation()
	const [uploadImages, { isLoading: uploading }] =
		useUploadProductImagesMutation()

	const handleSubmit = async (
		data: ProductCreateInput | ProductUpdateInput,
		images?: File[]
	) => {
		try {
			// 1. Создаем товар
			const product = await createProduct(data).unwrap()

			// 2. Загружаем изображения, если они выбраны
			if (images && images.length > 0) {
				const formData = new FormData()
				images.forEach((file) => {
					formData.append('files', file)
				})

				await uploadImages({
					id: product.id,
					body: formData,
				}).unwrap()
			}

			router.push('/admin/products')
		} catch (err) {
			console.error('Error creating product:', err)
			alert('Ошибка при создании продукта')
		}
	}

	if (categoriesLoading || sectionsLoading || badgesLoading) {
		return <Loader />
	}

	// Защита от SSR гидратации - не рендерим форму до полной загрузки на клиенте
	if (!categories || !sections || !badges) {
		return <Loader />
	}

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
							Создать продукт
						</h1>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className='container mx-auto px-4 py-6 max-w-2xl'>
				<ProductForm
					mode='create'
					onSubmit={handleSubmit}
					isSubmitting={creating || uploading}
					categories={categories || []}
					sections={sections || []}
					badges={badges || []}
					submitText='Создать'
				/>
			</div>
		</div>
	)
}
