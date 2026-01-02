'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Category as CategoryType } from '@/app/store/api/categoriesApi'

interface CategoryProps {
	category: CategoryType
	onClick?: () => void
	index?: number // индекс для чередования поворота
}

// Функция для получения полного URL изображения
const getImageUrl = (imagePath: string | null) => {
	if (!imagePath) return '/placeholder.png'
	if (imagePath.startsWith('http')) return imagePath
	
	// Убираем /api из URL для uploads (картинки лежат на корне домена)
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
	const baseUrl = apiUrl.replace('/api', '')
	
	// Добавляем слэш если его нет
	const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
	return `${baseUrl}${path}`
}

export default function Category({
	category,
	onClick,
	index = 0,
}: CategoryProps) {
	const [imageLoaded, setImageLoaded] = useState(false)
	const isFlipped = index % 2 === 1
	return (
		<div
			onClick={onClick}
			className='bg-element-bg/60 backdrop-blur-xl relative overflow-hidden rounded-3xl cursor-pointer h-[100px] w-full border border-white/5'
		>
			{/* Скелетон пока картинка загружается */}
			{!imageLoaded && (
				<div className='absolute inset-0 bg-element-bg animate-pulse z-20' />
			)}

			<div
				className={`absolute inset-0 w-full h-full flex items-center justify-center ${
					isFlipped ? 'scale-x-[-1]' : ''
				}`}
			>
				<Image
					src='/assets/arrow.svg'
					alt='background'
					fill
					className='object-contain'
				/>
			</div>
			<div className='absolute top-[-10px] left-[-10px] w-[50px] h-[50px] transform -rotate-12'>
				<Image
					src={getImageUrl(category.additional_image)}
					alt=''
					fill
					className='object-contain'
					unoptimized
				/>
			</div>

			<div className='absolute bottom-[-10px] right-[-10px] w-[50px] h-[50px] transform -rotate-12'>
				<Image
					src={getImageUrl(category.additional_image)}
					alt=''
					fill
					className='object-contain'
					unoptimized
				/>
			</div>

			{/* Центральное изображение и текст */}
			<div className='absolute inset-0 flex flex-col items-center justify-center z-10'>
				<div className='w-[40px] h-[40px] mb-2'>
					<Image
						src={getImageUrl(category.main_image)}
						alt={category.title}
						width={40}
						height={40}
						className={`object-contain transition-opacity duration-300 ${
							imageLoaded ? 'opacity-100' : 'opacity-0'
						}`}
						unoptimized
						onLoad={() => setImageLoaded(true)}
						priority
					/>
				</div>

				<h3
					className={`text-white font-semibold text-xl text-center px-4 transition-opacity duration-300 ${
						imageLoaded ? 'opacity-100' : 'opacity-0'
					}`}
				>
					{category.title.toUpperCase()}
				</h3>
			</div>
		</div>
	)
}
