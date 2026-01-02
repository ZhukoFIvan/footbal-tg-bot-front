'use client'

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface FormInputProps<TFieldValues extends FieldValues = FieldValues> {
	control: Control<TFieldValues>
	name: FieldPath<TFieldValues>
	label: string
	placeholder?: string
	description?: string
	type?: 'text' | 'email' | 'password' | 'number' | 'url'
	disabled?: boolean
	required?: boolean
	step?: string
	min?: string | number
	max?: string | number
}

export function FormInput<TFieldValues extends FieldValues = FieldValues>({
	control,
	name,
	label,
	placeholder,
	description,
	type = 'text',
	disabled = false,
	required = false,
	step,
	min,
	max,
}: FormInputProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<FormItem>
					<div className='bg-element-bg rounded-2xl p-6'>
						<FormLabel className='text-sm font-medium text-foreground mb-2'>
							{label} {required && <span className='text-destructive'>*</span>}
						</FormLabel>
						<FormControl>
							<Input
								type={type}
								placeholder={placeholder}
								disabled={disabled}
								step={step}
								min={min}
								max={max}
								{...field}
								value={field.value ?? ''}
								onChange={(e) => {
									const value =
										type === 'number'
											? e.target.value === ''
												? ''
												: Number(e.target.value)
											: e.target.value
									field.onChange(value)
								}}
								className={`border ${
									fieldState.error
										? 'border-destruыctive focus:ring-destructive'
										: 'border-white/10 focus:ring-primary'
								} text-foreground focus:outline-none focus:ring-2 transition-all`}
							/>
						</FormControl>
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
