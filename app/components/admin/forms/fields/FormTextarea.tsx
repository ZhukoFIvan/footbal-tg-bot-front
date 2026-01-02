'use client'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface FormTextareaProps<TFieldValues extends FieldValues = FieldValues> {
	control: Control<TFieldValues>
	name: FieldPath<TFieldValues>
	label: string
	placeholder?: string
	description?: string
	disabled?: boolean
	required?: boolean
	rows?: number
}

export function FormTextarea<TFieldValues extends FieldValues = FieldValues>({
	control,
	name,
	label,
	placeholder,
	description,
	disabled = false,
	required = false,
	rows = 4,
}: FormTextareaProps<TFieldValues>) {
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
							<Textarea
								placeholder={placeholder}
								disabled={disabled}
								rows={rows}
								{...field}
								value={field.value ?? ''}
								className={`w-full bg-background border ${
									fieldState.error ? 'border-destructive focus:ring-destructive' : 'border-white/10 focus:ring-primary'
								} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 transition-all min-h-[120px] resize-y`}
							/>
						</FormControl>
						{description && <FormDescription className='text-xs text-foreground/50 mt-1'>{description}</FormDescription>}
						<FormMessage className='text-xs text-destructive mt-1' />
					</div>
				</FormItem>
			)}
		/>
	)
}

