'use client'

import { useRouter } from 'next/navigation'
import { useCreateSectionMutation, useUploadSectionImageMutation } from '@/app/store/api/adminApi'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { SectionForm } from '@/app/components/admin/forms/SectionForm'
import { SectionCreateInput } from '@/app/components/admin/forms/schemas/validationSchemas'

export default function CreateSectionPage() {
	const router = useRouter()
	const [createSection, { isLoading: creating }] = useCreateSectionMutation()
	const [uploadImage, { isLoading: uploading }] = useUploadSectionImageMutation()

	const handleSubmit = async (data: SectionCreateInput, image?: File) => {
		try {
			// 1. Создаем секцию
			const section = await createSection(data).unwrap()

			// 2. Загружаем изображение, если выбрано
			if (image) {
				await uploadImage({ 
					id: section.id, 
					file: image,
				}).unwrap()
			}

			router.push('/admin/sections')
		} catch (err) {
			console.error('Error creating section:', err)
			alert('Ошибка при создании секции')
		}
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
						<h1 className='text-2xl font-bold text-foreground'>Создать секцию</h1>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className='container mx-auto px-4 py-6 max-w-2xl'>
				<SectionForm
					mode='create'
					onSubmit={handleSubmit}
					isSubmitting={creating || uploading}
					submitText='Создать'
						/>
			</div>
		</div>
	)
}
