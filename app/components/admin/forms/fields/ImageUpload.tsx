'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'

interface ImageUploadProps {
	label: string
	description?: string
	required?: boolean
	multiple?: boolean
	value?: File | File[] | string | string[] | null
	onChange: (files: File | File[] | null) => void
	previewUrls?: string | string[] | null
	onDeleteExisting?: (index: number, url: string) => void
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
	onDeleteExisting,
	aspectRatio = 'auto',
	maxFiles = 10,
	error,
}: ImageUploadProps) {
	const [localPreviews, setLocalPreviews] = useState<string[]>([])
	const [deletedIndices, setDeletedIndices] = useState<number[]>([])

	// Получаем массив превью из существующих и новых изображений
	const getPreviews = useCallback((): { url: string; isExisting: boolean; originalIndex?: number }[] => {
		const result: { url: string; isExisting: boolean; originalIndex?: number }[] = []

		// Добавляем существующие изображения (которые не удалены)
		if (previewUrls) {
			const existingUrls = Array.isArray(previewUrls) ? previewUrls : [previewUrls]
			existingUrls.forEach((url, index) => {
				if (!deletedIndices.includes(index)) {
					result.push({ url, isExisting: true, originalIndex: index })
				}
			})
		}

		// Добавляем новые изображения
		localPreviews.forEach((url) => {
			result.push({ url, isExisting: false })
		})

		return result
	}, [localPreviews, previewUrls, deletedIndices])

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
				onChange(combinedFiles as File[])
			} else {
				setLocalPreviews(previews)
				onChange(newFiles[0])
			}
		})
	}

	const handleRemove = (imageData: { url: string; isExisting: boolean; originalIndex?: number }, displayIndex: number) => {
		if (imageData.isExisting && imageData.originalIndex !== undefined) {
			// Удаляем существующее изображение
			setDeletedIndices(prev => {
				if (!prev.includes(imageData.originalIndex!)) {
					return [...prev, imageData.originalIndex!]
				}
				return prev
			})
			
			// Вызываем колбэк для удаления на сервере
			if (onDeleteExisting) {
				onDeleteExisting(imageData.originalIndex, imageData.url)
			}
		} else {
			// Удаляем новое изображение из локального состояния
			// Найти индекс этого URL среди localPreviews
			const urlToRemove = imageData.url
			const indexInLocalPreviews = localPreviews.findIndex(url => url === urlToRemove)
			
			if (indexInLocalPreviews >= 0) {
				const newPreviews = localPreviews.filter((_, i) => i !== indexInLocalPreviews)
				setLocalPreviews(newPreviews)
				
				if (multiple && Array.isArray(value)) {
					const newFiles = value.filter((_, i) => i !== indexInLocalPreviews)
					onChange(newFiles.length > 0 ? (newFiles as File[]) : null)
				} else {
					onChange(null)
				}
			}
		}
	}

	const previews = getPreviews()
	const hasImages = previews.length > 0

	const aspectClass =
		aspectRatio === 'square'
			? 'aspect-square'
			: aspectRatio === 'video'
			? 'aspect-video'
			: 'aspect-auto min-h-[200px]'

	return (
		<FormItem>
			<div className='bg-element-bg rounded-2xl p-6'>
				<FormLabel className='text-sm font-medium text-foreground mb-3 block'>
					{label} {required && <span className='text-destructive'>*</span>}
				</FormLabel>

				{/* Preview */}
				{hasImages && (
					<div
						className={`${multiple ? 'grid grid-cols-3 gap-3' : 'w-full'} mb-3`}
					>
						{previews.map((imageData, idx) => (
							<div
								key={
									imageData.isExisting && imageData.originalIndex !== undefined
										? `existing-${imageData.originalIndex}`
										: `new-${imageData.url}`
								}
								className={`relative ${aspectClass} rounded-xl overflow-hidden bg-element-bg/60 group`}
							>
								<Image
									src={imageData.url}
									alt={`Preview ${idx + 1}`}
									fill
									className='object-cover'
									unoptimized
								/>
								<button
									type='button'
									onClick={() => handleRemove(imageData, idx)}
									className='absolute top-2 right-2 w-8 h-8 bg-background rounded-md flex items-center justify-center z-10'
								>
									<X className='w-5 h-5 text-white' />
								</button>
								{/* Indicator for existing vs new images */}
								{imageData.isExisting && imageData.originalIndex !== undefined && (
									<div className='absolute top-2 left-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded flex flex-col'>
										<span>Сохр. ID:{imageData.originalIndex}</span>
										<span>Позиция #{idx + 1}</span>
									</div>
								)}
								{multiple && !imageData.isExisting && (
									<div className='absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded'>
										#{idx + 1}
									</div>
								)}
								{!imageData.isExisting && (
									<div className='absolute top-2 left-2 bg-blue-500/80 text-white text-xs px-2 py-1 rounded'>
										Новое
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
							;(
								e.currentTarget.previousElementSibling as HTMLInputElement
							)?.click()
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
						Выбрано: {previews.length}{' '}
						{previews.length === 1 ? 'изображение' : 'изображений'}
						{maxFiles && ` (макс. ${maxFiles})`}
					</p>
				)}

				{description && (
					<FormDescription className='text-xs text-foreground/50 mt-1'>
						{description}
					</FormDescription>
				)}
				{error && (
					<FormMessage className='text-xs text-destructive mt-1'>
						{error}
					</FormMessage>
				)}
			</div>
		</FormItem>
	)
}
