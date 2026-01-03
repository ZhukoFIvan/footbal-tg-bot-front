'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader2, Save } from 'lucide-react'
import { FormInput } from './fields/FormInput'
import { FormTextarea } from './fields/FormTextarea'
import { FormCheckbox } from './fields/FormCheckbox'
import { ImageUpload } from './fields/ImageUpload'
import {
	categoryCreateSchema,
	categoryUpdateSchema,
	CategoryCreateInput,
	CategoryUpdateInput,
} from './schemas/validationSchemas'

interface CategoryFormProps {
	mode: 'create' | 'update'
	defaultValues?: Partial<CategoryCreateInput | CategoryUpdateInput>
	onSubmit: (
		data: CategoryCreateInput | CategoryUpdateInput,
		images: { main?: File; additional?: File }
	) => void | Promise<void>
	isSubmitting?: boolean
	existingMainImage?: string | null
	existingAdditionalImage?: string | null
	submitText?: string
}

export function CategoryForm({
	mode,
	defaultValues,
	onSubmit,
	isSubmitting = false,
	existingMainImage,
	existingAdditionalImage,
	submitText = 'Сохранить',
}: CategoryFormProps) {
	const schema = mode === 'create' ? categoryCreateSchema : categoryUpdateSchema

	const form = useForm<CategoryCreateInput | CategoryUpdateInput>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: '',
			slug: '',
			description: '',
			sort_order: 0,
			show_on_main: false,
			is_active: true,
			...defaultValues,
		},
	})

	const [mainImage, setMainImage] = useState<File | null>(null)
	const [additionalImage, setAdditionalImage] = useState<File | null>(null)

	const handleSubmit = async (
		data: CategoryCreateInput | CategoryUpdateInput
	) => {
		await onSubmit(data, {
			main: mainImage || undefined,
			additional: additionalImage || undefined,
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
				{/* Images */}
				<div className='grid gap-4'>
					<ImageUpload
						label='Главное изображение'
						aspectRatio='square'
						value={mainImage}
						onChange={(file: File | File[] | null) =>
							setMainImage(file as File | null)
						}
						previewUrls={existingMainImage}
					/>
					<ImageUpload
						label='Дополнительное изображение'
						aspectRatio='square'
						value={additionalImage}
						onChange={(file: File | File[] | null) =>
							setAdditionalImage(file as File | null)
						}
						previewUrls={existingAdditionalImage}
					/>
				</div>

				{/* Title */}
				<FormInput
					control={form.control}
					name='title'
					label='Название'
					required
					placeholder='Action'
				/>

				{/* Slug */}
				<FormInput
					control={form.control}
					name='slug'
					label='Slug (URL)'
					required={mode === 'create'}
					placeholder='action-games'
					description='Только латинские буквы, цифры и дефисы'
				/>

				{/* Description */}
				<FormTextarea
					control={form.control}
					name='description'
					label='Описание'
					placeholder='Динамичные игры с захватывающим геймплеем'
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

				{/* Show on Main */}
				<FormCheckbox
					control={form.control}
					name='show_on_main'
					label='Показывать на главной странице'
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
