'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

interface ImageUploadProps {
	label: string
	description?: string
	required?: boolean
	multiple?: boolean
	value?: File | File[] | string | string[] | null
	onChange: (files: File | File[] | null) => void
	previewUrls?: string | string[] | null
	aspectRatio?: 'square' | 'video' | 'auto'
	maxFiles?: number
	error?: string
}

export function ImageUpload({
	label,
	description,
	required = false,
	multiple = false,
	value,
	onChange,
	previewUrls,
	aspectRatio = 'auto',
	maxFiles = 10,
	error,
}: ImageUploadProps) {
	const [localPreviews, setLocalPreviews] = useState<string[]>([])

	// Получаем массив превью из value или previewUrls
	const getPreviews = useCallback((): string[] => {
		// Приоритет локальным превью из File объектов
		if (localPreviews.length > 0) {
			return localPreviews
		}

		// Используем previewUrls если есть
		if (previewUrls) {
			return Array.isArray(previewUrls) ? previewUrls : [previewUrls]
		}

		return []
	}, [localPreviews, previewUrls])

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files || files.length === 0) return

		const newFiles = Array.from(files)

		// Создаем превью для новых файлов
		const readers = newFiles.map((file) => {
			return new Promise<string>((resolve) => {
				const reader = new FileReader()
				reader.onloadend = () => resolve(reader.result as string)
				reader.readAsDataURL(file)
			})
		})

		Promise.all(readers).then((previews) => {
			if (multiple) {
				const existingFiles = Array.isArray(value) ? value : value ? [value] : []
				const combinedFiles = [...existingFiles, ...newFiles].slice(0, maxFiles)
				setLocalPreviews([...localPreviews, ...previews].slice(0, maxFiles))
				onChange(combinedFiles as any)
			} else {
				setLocalPreviews(previews)
				onChange(newFiles[0])
			}
		})
	}

	const handleRemove = (index: number) => {
		if (multiple && Array.isArray(value)) {
			const newFiles = value.filter((_, i) => i !== index)
			const newPreviews = localPreviews.filter((_, i) => i !== index)
			setLocalPreviews(newPreviews)
			onChange(newFiles.length > 0 ? newFiles : null)
		} else {
			setLocalPreviews([])
			onChange(null)
		}
	}

	const previews = getPreviews()
	const hasImages = previews.length > 0

	const aspectClass =
		aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'video' ? 'aspect-video' : 'aspect-auto min-h-[200px]'

	return (
		<FormItem>
			<div className='bg-element-bg rounded-2xl p-6'>
				<FormLabel className='text-sm font-medium text-foreground mb-3 block'>
					{label} {required && <span className='text-destructive'>*</span>}
				</FormLabel>

				{/* Preview */}
				{hasImages && (
					<div className={`${multiple ? 'grid grid-cols-3 gap-3' : 'w-full'} mb-3`}>
						{previews.map((preview, idx) => (
							<div
								key={idx}
								className={`relative ${aspectClass} rounded-xl overflow-hidden bg-element-bg/60 group`}
							>
								<Image src={preview} alt={`Preview ${idx + 1}`} fill className='object-cover' unoptimized />
								<button
									type='button'
									onClick={() => handleRemove(idx)}
									className='absolute top-2 right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10'
								>
									<X className='w-5 h-5 text-white' />
								</button>
								{multiple && (
									<div className='absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded'>
										#{idx + 1}
									</div>
								)}
							</div>
						))}
					</div>
				)}

				{/* Upload Button */}
				<label className='block'>
					<input
						type='file'
						accept='image/*'
						multiple={multiple}
						onChange={handleFileSelect}
						className='hidden'
					/>
					<Button
						type='button'
						variant='outline'
						className='w-full'
						onClick={(e) => {
							e.preventDefault()
							;(e.currentTarget.previousElementSibling as HTMLInputElement)?.click()
						}}
					>
						<Upload className='w-4 h-4 mr-2' />
						{hasImages
							? multiple
								? 'Добавить еще'
								: 'Изменить изображение'
							: multiple
								? 'Выбрать изображения'
								: 'Выбрать изображение'}
					</Button>
				</label>

				{/* Info */}
				{multiple && hasImages && (
					<p className='text-sm text-foreground/50 mt-2'>
						Выбрано: {previews.length} {previews.length === 1 ? 'изображение' : 'изображений'}
						{maxFiles && ` (макс. ${maxFiles})`}
					</p>
				)}

				{description && <FormDescription className='text-xs text-foreground/50 mt-1'>{description}</FormDescription>}
				{error && <FormMessage className='text-xs text-destructive mt-1'>{error}</FormMessage>}
			</div>
		</FormItem>
	)
}

