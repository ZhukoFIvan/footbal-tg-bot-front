'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader2, Save } from 'lucide-react'
import { FormInput } from './fields/FormInput'
import { FormColorPicker } from './fields/FormColorPicker'
import { FormCheckbox } from './fields/FormCheckbox'
import {
	badgeCreateSchema,
	badgeUpdateSchema,
	BadgeCreateInput,
	BadgeUpdateInput,
} from './schemas/validationSchemas'

interface BadgeFormProps {
	mode: 'create' | 'update'
	defaultValues?: Partial<BadgeCreateInput | BadgeUpdateInput>
	onSubmit: (data: BadgeCreateInput | BadgeUpdateInput) => void | Promise<void>
	isSubmitting?: boolean
	submitText?: string
}

export function BadgeForm({
	mode,
	defaultValues,
	onSubmit,
	isSubmitting = false,
	submitText = 'Сохранить',
}: BadgeFormProps) {
	const schema = mode === 'create' ? badgeCreateSchema : badgeUpdateSchema

	const form = useForm<BadgeCreateInput | BadgeUpdateInput>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: '',
			color: '#21BC60',
			text_color: '#FFFFFF',
			is_active: true,
			...defaultValues,
		},
	})

	const handleSubmit = async (data: BadgeCreateInput | BadgeUpdateInput) => {
		await onSubmit(data)
	}

	const watchedTitle = form.watch('title')
	const watchedColor = form.watch('color')
	const watchedTextColor = form.watch('text_color')

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
				{/* Preview */}
				<div className='bg-element-bg rounded-2xl p-6'>
					<label className='block text-sm font-medium text-foreground mb-3'>
						Предпросмотр
					</label>
					<div className='flex justify-center p-6 bg-background rounded-xl'>
						<span
							className='inline-flex items-center rounded-full px-4 py-2 text-base font-semibold'
							style={{
								backgroundColor: watchedColor || '#21BC60',
								color: watchedTextColor || '#FFFFFF',
							}}
						>
							{watchedTitle || 'Badge Preview'}
						</span>
					</div>
				</div>

				{/* Title */}
				<FormInput
					control={form.control}
					name='title'
					label='Название'
					required
					placeholder='Новинка'
				/>

				{/* Colors */}
				<div className='grid grid-cols-2 gap-4'>
					<FormColorPicker
						control={form.control}
						name='color'
						label='Цвет фона'
					/>
					<FormColorPicker
						control={form.control}
						name='text_color'
						label='Цвет текста'
					/>
				</div>

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
