'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { PromoCode } from '@/app/store/api/promoCodesApi'

const promoCodeSchema = z.object({
	code: z
		.string()
		.min(3, 'Минимум 3 символа')
		.max(50, 'Максимум 50 символов')
		.toUpperCase(),
	discount_type: z.enum(['percent', 'fixed']),
	discount_value: z.coerce
		.number()
		.positive('Должно быть положительным числом'),
	min_order_amount: z.coerce.number().nullable().optional(),
	max_discount: z.coerce.number().nullable().optional(),
	usage_limit: z.coerce.number().int().nullable().optional(),
	valid_from: z.string().nullable().optional(),
	valid_until: z.string().nullable().optional(),
	is_active: z.boolean().default(true),
})

type PromoCodeFormValues = z.infer<typeof promoCodeSchema>

interface PromoCodeFormProps {
	initialData?: PromoCode | null
	onSubmit: (data: PromoCodeFormValues) => Promise<void>
	isLoading?: boolean
}

export function PromoCodeForm({
	initialData,
	onSubmit,
	isLoading,
}: PromoCodeFormProps) {
	const form = useForm<PromoCodeFormValues>({
		resolver: zodResolver(promoCodeSchema),
		defaultValues: {
			code: initialData?.code || '',
			discount_type: initialData?.discount_type || 'percent',
			discount_value: initialData?.discount_value || 0,
			min_order_amount: initialData?.min_order_amount || null,
			max_discount: initialData?.max_discount || null,
			usage_limit: initialData?.usage_limit || null,
			valid_from: initialData?.valid_from
				? new Date(initialData.valid_from).toISOString().slice(0, 16)
				: null,
			valid_until: initialData?.valid_until
				? new Date(initialData.valid_until).toISOString().slice(0, 16)
				: null,
			is_active: initialData?.is_active ?? true,
		},
	})

	const discountType = form.watch('discount_type')

	const handleSubmit = async (data: PromoCodeFormValues) => {
		// Преобразуем пустые строки в null для дат
		const processedData = {
			...data,
			valid_from: data.valid_from || null,
			valid_until: data.valid_until || null,
			min_order_amount:
				data.min_order_amount && data.min_order_amount > 0
					? data.min_order_amount
					: null,
			max_discount:
				data.max_discount && data.max_discount > 0 ? data.max_discount : null,
			usage_limit:
				data.usage_limit && data.usage_limit > 0 ? data.usage_limit : null,
		}

		await onSubmit(processedData)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='code'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>Код промокода</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='SUMMER2025'
									className='bg-background border-white/10 text-foreground'
									onChange={(e) =>
										field.onChange(e.target.value.toUpperCase())
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='discount_type'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>Тип скидки</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className='bg-background border-white/10 text-foreground'>
										<SelectValue placeholder='Выберите тип' />
									</SelectTrigger>
								</FormControl>
								<SelectContent className='bg-element-bg border-white/10'>
									<SelectItem value='percent'>Процент (%)</SelectItem>
									<SelectItem value='fixed'>Фиксированная сумма (₽)</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='discount_value'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>
								Размер скидки{' '}
								{discountType === 'percent' ? '(0-100%)' : '(в рублях)'}
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									type='number'
									step={discountType === 'percent' ? '1' : '0.01'}
									min='0'
									max={discountType === 'percent' ? '100' : undefined}
									placeholder={discountType === 'percent' ? '20' : '500'}
									className='bg-background border-white/10 text-foreground'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{discountType === 'percent' && (
					<FormField
						control={form.control}
						name='max_discount'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>
									Максимальная скидка (₽, опционально)
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ''}
										type='number'
										step='0.01'
										min='0'
										placeholder='1000'
										className='bg-background border-white/10 text-foreground'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<FormField
					control={form.control}
					name='min_order_amount'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>
								Минимальная сумма заказа (₽, опционально)
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value ?? ''}
									type='number'
									step='0.01'
									min='0'
									placeholder='2000'
									className='bg-background border-white/10 text-foreground'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='usage_limit'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>
								Лимит использований (опционально)
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value ?? ''}
									type='number'
									min='1'
									placeholder='100'
									className='bg-background border-white/10 text-foreground'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='valid_from'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>
								Дата начала (опционально)
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value ?? ''}
									type='datetime-local'
									className='bg-background border-white/10 text-foreground'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='valid_until'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>
								Дата окончания (опционально)
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value ?? ''}
									type='datetime-local'
									className='bg-background border-white/10 text-foreground'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='is_active'
					render={({ field }) => (
						<FormItem className='flex items-center justify-between bg-element-bg rounded-xl p-4'>
							<div>
								<FormLabel className='text-foreground'>Активен</FormLabel>
								<p className='text-sm text-foreground/70'>
									Можно ли использовать промокод
								</p>
							</div>
							<FormControl>
								<Switch checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
						</FormItem>
					)}
				/>

				<div className='flex gap-4'>
					<Button
						type='submit'
						disabled={isLoading}
						className='flex-1 bg-primary hover:bg-primary-hover'
					>
						{isLoading
							? 'Сохранение...'
							: initialData
							? 'Обновить промокод'
							: 'Создать промокод'}
					</Button>
				</div>
			</form>
		</Form>
	)
}

