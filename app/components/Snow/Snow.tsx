'use client'

import { useEffect, useState } from 'react'
import './snow.css'

export default function Snow() {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	// Создаем 50 снежинок
	const snowflakes = Array.from({ length: 50 }, (_, i) => ({
		id: i,
		// Случайная задержка анимации (0-20 секунд)
		animationDelay: Math.random() * 20,
		// Случайная длительность падения (10-30 секунд)
		animationDuration: 10 + Math.random() * 20,
		// Случайная позиция по горизонтали
		left: Math.random() * 100,
		// Случайный размер (0.5-1.5em)
		fontSize: 0.5 + Math.random() * 1,
		// Случайная прозрачность (0.3-0.9)
		opacity: 0.3 + Math.random() * 0.6,
	}))

	return (
		<div className='snow-container'>
			{snowflakes.map((flake) => (
				<div
					key={flake.id}
					className='snowflake'
					style={{
						left: `${flake.left}%`,
						animationDelay: `${flake.animationDelay}s`,
						animationDuration: `${flake.animationDuration}s`,
						fontSize: `${flake.fontSize}em`,
						opacity: flake.opacity,
					}}
				>
					❄
				</div>
			))}
		</div>
	)
}
