'use client'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface FormCheckboxProps<TFieldValues extends FieldValues = FieldValues> {
	control: Control<TFieldValues>
	name: FieldPath<TFieldValues>
	label: string
	description?: string
	disabled?: boolean
}

export function FormCheckbox<TFieldValues extends FieldValues = FieldValues>({
	control,
	name,
	label,
	description,
	disabled = false,
}: FormCheckboxProps<TFieldValues>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<div className='bg-element-bg rounded-2xl p-6'>
						<div className='flex items-center gap-3'>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={disabled}
									className='w-5 h-5 text-primary bg-background border-white/10 rounded data-[state=checked]:bg-primary data-[state=checked]:border-primary'
								/>
							</FormControl>
							<FormLabel className='text-foreground font-medium cursor-pointer mb-0'>{label}</FormLabel>
						</div>
						{description && <FormDescription className='text-xs text-foreground/50 mt-2 ml-8'>{description}</FormDescription>}
						<FormMessage className='text-xs text-destructive mt-1 ml-8' />
					</div>
				</FormItem>
			)}
		/>
	)
}

