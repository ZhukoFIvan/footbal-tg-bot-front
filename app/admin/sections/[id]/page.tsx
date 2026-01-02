'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import {
	useGetAdminSectionsQuery,
	useUpdateSectionMutation,
	useUploadSectionImageMutation,
} from '@/app/store/api/adminApi'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Loader from '@/app/components/Loader/Loader'
import { SectionForm } from '@/app/components/admin/forms/SectionForm'
import { SectionUpdateInput } from '@/app/components/admin/forms/schemas/validationSchemas'

const getImageUrl = (imagePath: string | null) => {
	if (!imagePath) return null
	if (imagePath.startsWith('http')) return imagePath
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
	const baseUrl = apiUrl.replace('/api', '')
	return `${baseUrl}${imagePath}`
}

export default function EditSectionPage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params)
	const router = useRouter()
	const sectionId = parseInt(resolvedParams.id)

	const { data: sections, isLoading } = useGetAdminSectionsQuery()
	const [updateSection, { isLoading: updating }] = useUpdateSectionMutation()
	const [uploadImage, { isLoading: uploading }] = useUploadSectionImageMutation()

	const section = sections?.find((s) => s.id === sectionId)

	const handleSubmit = async (data: SectionUpdateInput, image?: File) => {
		try {
			// 1. Обновляем данные секции
			await updateSection({
				id: sectionId,
				data,
			}).unwrap()

			// 2. Загружаем изображение, если выбрано
			if (image) {
				await uploadImage({
					id: sectionId,
					file: image,
				}).unwrap()
			}

			router.push('/admin/sections')
		} catch (err) {
			console.error('Error updating section:', err)
			alert('Ошибка при обновлении секции')
		}
	}

	if (isLoading || !section) {
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
						<Button onClick={() => router.push('/admin/sections')} variant='ghost' size='icon'>
							<ArrowLeft className='w-5 h-5' />
						</Button>
						<h1 className='text-2xl font-bold text-foreground'>Редактировать секцию</h1>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className='container mx-auto px-4 py-6 max-w-2xl'>
				<SectionForm
					mode='update'
					defaultValues={{
						name: section.name,
						route: section.route,
						rest_time: section.rest_time,
						sort_order: section.sort_order,
						is_active: section.is_active,
					}}
					onSubmit={handleSubmit}
					isSubmitting={updating || uploading}
					existingImage={getImageUrl(section.image_url)}
				/>
			</div>
		</div>
	)
}
