'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { Section as SectionType } from '@/app/store/api/sectionsApi'

interface SectionProps {
	section: SectionType
	onClick?: () => void
}

// Функция для получения полного URL изображения
const getImageUrl = (imagePath: string | null) => {
	if (!imagePath) {
		return '/placeholder.png'
	}
	if (imagePath.startsWith('http')) {
		return imagePath
	}
	
	// Убираем /api из URL для uploads (картинки лежат на корне домена)
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
	const baseUrl = apiUrl.replace('/api', '')
	
	// Добавляем слэш если его нет
	const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
	return `${baseUrl}${path}`
}

export default function Section({ section, onClick }: SectionProps) {
	// Состояние для тика таймера (обновляется каждую секунду)
	const [tick, setTick] = useState(0)
	const [imageLoaded, setImageLoaded] = useState(false)

	const initialRestTime = section.rest_time || 0

	// Обновляем тик каждую секунду
	useEffect(() => {
		if (initialRestTime <= 0) return

		const interval = setInterval(() => {
			setTick((prev) => prev + 1)
		}, 1000)

		return () => clearInterval(interval)
	}, [initialRestTime])

	// Вычисляем оставшееся время на основе начального времени и тиков
	const remainingSeconds = Math.max(0, initialRestTime - tick)

	// Функция для форматирования времени
	const formatRestTime = (seconds: number) => {
		if (seconds <= 0) return null

		const days = Math.floor(seconds / (24 * 60 * 60))
		const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
		const minutes = Math.floor((seconds % (60 * 60)) / 60)
		const secs = seconds % 60

		// Если больше 1 дня - показываем дни
		if (days > 0) {
			return `Осталось ${days} ${getDayWord(days)}`
		}

		// Если меньше дня - показываем часы и минуты
		if (hours > 0) {
			return `Осталось ${hours}:${String(minutes).padStart(2, '0')}:${String(
				secs
			).padStart(2, '0')}`
		}

		// Если только минуты
		return `Осталось ${minutes}:${String(secs).padStart(2, '0')}`
	}

	const getDayWord = (days: number) => {
		if (days === 1) return 'день'
		if (days >= 2 && days <= 4) return 'дня'
		return 'дней'
	}

	const restTimeText = formatRestTime(remainingSeconds)

	const showTimer = restTimeText

	return (
		<div onClick={onClick} className='cursor-pointer'>
			<div className='relative w-full aspect-video overflow-hidden rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]'>
				{!imageLoaded && (
					<div className='absolute inset-0 bg-element-bg animate-pulse' />
				)}
				<Image
					src={getImageUrl(section.image)}
					alt={section.name}
					fill
					className={`object-cover transition-opacity duration-300 ${
						imageLoaded ? 'opacity-100' : 'opacity-0'
					}`}
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					onLoad={() => setImageLoaded(true)}
					priority
				/>
			</div>

			{showTimer && (
				<div className='mt-2 bg-element-bg rounded-3xl px-4 py-3 flex items-center gap-2 justify-center'>
					<Clock className='w-5 h-5 text-white' />
					<span className='text-base font-semibold text-foreground'>
						{restTimeText}
					</span>
				</div>
			)}
		</div>
	)
}
