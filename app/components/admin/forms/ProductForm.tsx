'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader2, Save } from 'lucide-react'
import { FormInput } from './fields/FormInput'
import { FormTextarea } from './fields/FormTextarea'
import { FormSelect } from './fields/FormSelect'
import { FormCheckbox } from './fields/FormCheckbox'
import { ImageUpload } from './fields/ImageUpload'
import {
	productCreateSchema,
	productUpdateSchema,
	ProductCreateInput,
	ProductUpdateInput,
} from './schemas/validationSchemas'

interface Category {
	id: number
	title: string
}

interface Section {
	id: number
	name: string
}

interface Badge {
	id: number
	title: string
}

interface ProductFormProps {
	mode: 'create' | 'update'
	defaultValues?: Partial<ProductCreateInput | ProductUpdateInput>
	onSubmit: (
		data: ProductCreateInput | ProductUpdateInput,
		images?: File[]
	) => void | Promise<void>
	isSubmitting?: boolean
	categories: Category[]
	sections: Section[]
	badges: Badge[]
	existingImages?: string[]
	onDeleteExisting?: (index: number, url: string) => void
	submitText?: string
}

export function ProductForm({
	mode,
	defaultValues,
	onSubmit,
	isSubmitting = false,
	categories,
	sections,
	badges,
	existingImages,
	onDeleteExisting,
	submitText = 'Сохранить',
}: ProductFormProps) {
	const schema = mode === 'create' ? productCreateSchema : productUpdateSchema

	const form = useForm<ProductCreateInput | ProductUpdateInput>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: '',
			slug: '',
			description: '',
			price: undefined,
			old_price: undefined,
			promotion_text: '',
			currency: 'RUB',
			stock_count: 0,
			category_id: undefined,
			section_id: undefined,
			badge_id: undefined,
			is_active: true,
			...defaultValues,
		},
	})

	const [images, setImages] = useState<File[]>([])

	const handleSubmit = async (
		data: ProductCreateInput | ProductUpdateInput
	) => {
		await onSubmit(data, images.length > 0 ? images : undefined)
	}

	const categoryOptions = [
		{ label: 'Без категории', value: '__EMPTY__' },
		...categories.map((cat) => ({ label: cat.title, value: cat.id })),
	]

	const sectionOptions = [
		{ label: 'Без секции', value: '__EMPTY__' },
		...sections.map((sec) => ({ label: sec.name, value: sec.id })),
	]

	const badgeOptions = [
		{ label: 'Без бейджа', value: '__EMPTY__' },
		...badges.map((badge) => ({ label: badge.title, value: badge.id })),
	]

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
				{/* Images */}
				<ImageUpload
					label='Изображения'
					description='Можно загрузить несколько изображений'
					multiple
					maxFiles={5}
					value={images}
					onChange={(files) => setImages((files as File[]) || [])}
					previewUrls={existingImages}
					onDeleteExisting={onDeleteExisting}
				/>

				<FormInput
					control={form.control}
					name='title'
					label='Название'
					required
					placeholder='Cyberpunk 2077'
				/>

				<FormInput
					control={form.control}
					name='slug'
					label='Slug (URL)'
					required={mode === 'create'}
					placeholder='cyberpunk-2077'
					description='Только латинские буквы, цифры и дефисы'
				/>

				{/* Description */}
				<FormTextarea
					control={form.control}
					name='description'
					label='Описание'
					placeholder='Футуристическая ролевая игра с открытым миром...'
					rows={6}
				/>

				{/* Price & Old Price */}
				<div className='grid grid-cols-2 gap-4'>
					<FormInput
						control={form.control}
						name='price'
						label='Цена'
						required={mode === 'create'}
						type='number'
						step='0.01'
						placeholder='1999'
					/>
					<FormInput
						control={form.control}
						name='old_price'
						label='Старая цена'
						type='number'
						step='0.01'
						placeholder='2999'
						description='Для отображения скидки'
					/>
				</div>

				{/* Promotion Text & Stock */}
				<div className='grid grid-cols-2 gap-4'>
					<FormInput
						control={form.control}
						name='promotion_text'
						label='Текст акции'
						placeholder='Скидка 33%'
					/>
					<FormInput
						control={form.control}
						name='stock_count'
						label='Количество на складе'
						type='number'
						placeholder='100'
					/>
				</div>

				{/* Category */}
				<FormSelect
					control={form.control}
					name='category_id'
					label='Категория'
					required={mode === 'create'}
					options={categoryOptions}
					placeholder='Выберите категорию'
				/>

				{/* Section */}
				<FormSelect
					control={form.control}
					name='section_id'
					label='Секция'
					options={sectionOptions}
					placeholder='Выберите секцию'
				/>

				{/* Badge */}
				<FormSelect
					control={form.control}
					name='badge_id'
					label='Бейдж'
					options={badgeOptions}
					placeholder='Выберите бейдж'
				/>

				{/* Currency */}
				<FormInput
					control={form.control}
					name='currency'
					label='Валюта'
					placeholder='RUB'
				/>

				{/* Active */}
				<FormCheckbox control={form.control} name='is_active' label='Активен' />

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
