'use client'

import { useEffect, useState } from 'react'
import './snow.css'

const SNOWFLAKE_COUNT = 30

const generateSnowflakes = () =>
	Array.from({ length: SNOWFLAKE_COUNT }, (_, i) => ({
		id: i,
		animationDelay: Math.random() * 20,
		animationDuration: 10 + Math.random() * 20,
		left: Math.random() * 100,
		fontSize: 0.5 + Math.random() * 1,
		opacity: 0.3 + Math.random() * 0.6,
	}))

export default function Snow() {
	const [mounted, setMounted] = useState(false)
	// Создаем снежинки только один раз при монтировании
	const [snowflakes] = useState(generateSnowflakes)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

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
				/>
			))}
		</div>
	)
}
