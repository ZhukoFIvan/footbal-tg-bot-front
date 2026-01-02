'use client'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface FormColorPickerProps<TFieldValues extends FieldValues = FieldValues> {
	control: Control<TFieldValues>
	name: FieldPath<TFieldValues>
	label: string
	description?: string
	disabled?: boolean
	required?: boolean
}

export function FormColorPicker<TFieldValues extends FieldValues = FieldValues>({
	control,
	name,
	label,
	description,
	disabled = false,
	required = false,
}: FormColorPickerProps<TFieldValues>) {
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
						<FormControl>
							<div className='space-y-2'>
								{/* Color Picker */}
								<input
									type='color'
									value={field.value ?? '#000000'}
									onChange={(e) => field.onChange(e.target.value.toUpperCase())}
									disabled={disabled}
									className='w-full h-12 bg-background border border-white/10 rounded-xl cursor-pointer'
								/>
								{/* Text Input для HEX */}
								<Input
									type='text'
									placeholder='#000000'
									disabled={disabled}
									{...field}
									value={field.value ?? ''}
									onChange={(e) => field.onChange(e.target.value.toUpperCase())}
									className={`w-full bg-background border ${
										fieldState.error ? 'border-destructive focus:ring-destructive' : 'border-white/10 focus:ring-primary'
									} rounded-xl px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 transition-all`}
								/>
							</div>
						</FormControl>
						{description && <FormDescription className='text-xs text-foreground/50 mt-1'>{description}</FormDescription>}
						<FormMessage className='text-xs text-destructive mt-1' />
					</div>
				</FormItem>
			)}
		/>
	)
}

