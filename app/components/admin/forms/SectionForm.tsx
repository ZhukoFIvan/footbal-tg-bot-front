'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader2, Save } from 'lucide-react'
import { FormInput } from './fields/FormInput'
import { FormCheckbox } from './fields/FormCheckbox'
import { ImageUpload } from './fields/ImageUpload'
import {
	sectionCreateSchema,
	sectionUpdateSchema,
	SectionCreateInput,
	SectionUpdateInput,
} from './schemas/validationSchemas'

interface SectionFormProps {
	mode: 'create' | 'update'
	defaultValues?: Partial<SectionCreateInput | SectionUpdateInput>
	onSubmit: (data: SectionCreateInput | SectionUpdateInput, image?: File) => void | Promise<void>
	isSubmitting?: boolean
	existingImage?: string | null
	submitText?: string
}

export function SectionForm({ mode, defaultValues, onSubmit, isSubmitting = false, existingImage, submitText = 'Сохранить' }: SectionFormProps) {
	const schema = mode === 'create' ? sectionCreateSchema : sectionUpdateSchema

	const form = useForm<SectionCreateInput | SectionUpdateInput>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			route: '',
			rest_time: undefined,
			sort_order: 0,
			is_active: true,
			...defaultValues,
		},
	})

	const [image, setImage] = useState<File | null>(null)

	const handleSubmit = async (data: SectionCreateInput | SectionUpdateInput) => {
		await onSubmit(data, image || undefined)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
				{/* Image */}
				<ImageUpload
					label='Изображение'
					aspectRatio='video'
					value={image}
					onChange={(file) => setImage(file as File | null)}
					previewUrls={existingImage}
				/>

				{/* Name */}
				<FormInput control={form.control} name='name' label='Название' required placeholder='Хиты продаж' />

				{/* Route */}
				<FormInput
					control={form.control}
					name='route'
					label='Route (путь)'
					placeholder='hits'
					description='URL путь для секции'
				/>

				{/* Rest Time */}
				<FormInput
					control={form.control}
					name='rest_time'
					label='Время до окончания акции (секунды)'
					type='number'
					placeholder='604800'
					description='Оставьте пустым, если акция бессрочная'
				/>

				{/* Sort Order */}
				<FormInput
					control={form.control}
					name='sort_order'
					label='Порядок сортировки'
					type='number'
					placeholder='0'
					description='Чем меньше число, тем выше в списке'
				/>

				{/* Active */}
				<FormCheckbox control={form.control} name='is_active' label='Активна' />

				{/* Submit Button */}
				<Button
					type='submit'
					disabled={isSubmitting}
					className='w-full bg-primary hover:bg-primary-hover'
				>
					{isSubmitting ? (
						<Loader2 className='w-4 h-4 mr-2 animate-spin' />
					) : (
						<Save className='w-4 h-4 mr-2' />
					)}
					{isSubmitting ? 'Сохранение...' : submitText}
				</Button>
			</form>
		</Form>
	)
}
