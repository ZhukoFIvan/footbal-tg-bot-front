'use client'

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface SelectOption {
	label: string
	value: string | number
}

interface FormSelectProps<TFieldValues extends FieldValues = FieldValues> {
	control: Control<TFieldValues>
	name: FieldPath<TFieldValues>
	label: string
	placeholder?: string
	description?: string
	options: SelectOption[]
	disabled?: boolean
	required?: boolean
}

export function FormSelect<TFieldValues extends FieldValues = FieldValues>({
	control,
	name,
	label,
	placeholder = 'Выберите...',
	description,
	options,
	disabled = false,
	required = false,
}: FormSelectProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<FormItem>
					<div className='bg-element-bg rounded-2xl p-6'>
						<FormLabel className='text-sm font-medium text-foreground'>
							{label} {required && <span className='text-destructive'>*</span>}
						</FormLabel>
						<Select
							onValueChange={(value) => {
								// Обработка пустого значения (null/undefined)
								if (value === '__EMPTY__') {
									field.onChange(null)
									return
								}
								// Преобразуем значение обратно в число, если это было число
								const numValue = Number(value)
								field.onChange(isNaN(numValue) ? value : numValue)
							}}
							value={
								field.value == null || field.value === undefined
									? '__EMPTY__'
									: String(field.value)
							}
							disabled={disabled}
						>
							<FormControl>
								<SelectTrigger
									className={`w-full bg-background border ${
										fieldState.error
											? 'border-destructive focus:ring-destructive'
											: 'border-white/10 focus:ring-primary'
									} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 transition-all`}
								>
									<SelectValue placeholder={placeholder} />
								</SelectTrigger>
							</FormControl>
							<SelectContent className='bg-element-bg border-white/10'>
								{options.map((option) => (
									<SelectItem
										key={option.value === '' ? '__EMPTY__' : option.value}
										value={
											option.value === ''
												? '__EMPTY__'
												: option.value.toString()
										}
										className='text-foreground hover:bg-background focus:bg-background cursor-pointer'
									>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{description && (
							<FormDescription className='text-xs text-foreground/50 mt-1'>
								{description}
							</FormDescription>
						)}
						<FormMessage className='text-xs text-destructive mt-1' />
					</div>
				</FormItem>
			)}
		/>
	)
}
