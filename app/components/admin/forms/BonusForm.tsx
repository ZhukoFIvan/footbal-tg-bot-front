'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { FormInput } from './fields/FormInput'
import { FormTextarea } from './fields/FormTextarea'
import {
	bonusAddSchema,
	bonusSubtractSchema,
	bonusSetBalanceSchema,
	BonusAddInput,
	BonusSubtractInput,
	BonusSetBalanceInput,
} from './schemas/validationSchemas'

type BonusFormMode = 'add' | 'subtract' | 'set'
type BonusFormData = BonusAddInput | BonusSubtractInput | BonusSetBalanceInput

interface BonusFormProps {
	mode: BonusFormMode
	userId: number
	onSubmit: (data: BonusFormData) => void | Promise<void>
	isSubmitting?: boolean
	onCancel?: () => void
}

export function BonusForm({
	mode,
	userId,
	onSubmit,
	isSubmitting = false,
	onCancel,
}: BonusFormProps) {
	const getSchema = () => {
		switch (mode) {
			case 'add':
				return bonusAddSchema
			case 'subtract':
				return bonusSubtractSchema
			case 'set':
				return bonusSetBalanceSchema
		}
	}

	const form = useForm<BonusFormData>({
		resolver: zodResolver(getSchema()),
		defaultValues:
			mode === 'set'
				? {
						user_id: userId,
						new_balance: 0,
						description: '',
				  }
				: {
						user_id: userId,
						amount: 0,
						description: '',
				  },
	})

	const handleSubmit = async (data: BonusFormData) => {
		await onSubmit(data)
	}

	const getTitle = () => {
		switch (mode) {
			case 'add':
				return 'Начислить бонусы'
			case 'subtract':
				return 'Списать бонусы'
			case 'set':
				return 'Установить баланс'
		}
	}

	const getAmountLabel = () => {
		return mode === 'set' ? 'Новый баланс' : 'Сумма'
	}

	const getAmountFieldName = () => {
		return mode === 'set' ? 'new_balance' : 'amount'
	}

	const isDescriptionRequired = mode !== 'set'

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
				{/* Title (not a field) */}
				<h2 className='text-xl font-bold text-foreground'>{getTitle()}</h2>

				{/* Amount / New Balance */}
				<FormInput
					control={form.control}
					name={getAmountFieldName() as keyof BonusFormData}
					label={getAmountLabel()}
					required
					type='number'
					step='0.01'
					min={mode === 'set' ? '0' : '0.01'}
					placeholder='0'
				/>

				{/* Description */}
				<FormTextarea
					control={form.control}
					name='description'
					label='Описание'
					required={isDescriptionRequired}
					placeholder={
						mode === 'add'
							? 'Причина начисления...'
							: mode === 'subtract'
							? 'Причина списания...'
							: 'Причина изменения баланса...'
					}
					rows={3}
				/>

				{/* Buttons */}
				<div className='flex gap-3 mt-6'>
					{onCancel && (
						<Button
							type='button'
							onClick={onCancel}
							variant='outline'
							className='flex-1'
							disabled={isSubmitting}
						>
							Отмена
						</Button>
					)}
					<Button
						type='submit'
						className='flex-1 bg-primary hover:bg-primary-hover'
						disabled={isSubmitting}
					>
						{isSubmitting && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
						Подтвердить
					</Button>
				</div>
			</form>
		</Form>
	)
}
