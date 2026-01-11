'use client'

import React from 'react'
import { StarRating } from './StarRating'

interface RatingDistributionProps {
	rating: {
		average_rating: number
		reviews_count: number
		rating_distribution: Record<string, number>
	}
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
	rating,
}) => {
	const { average_rating, reviews_count, rating_distribution } = rating

	const getPercentage = (count: number) => {
		if (reviews_count === 0) return 0
		return (count / reviews_count) * 100
	}

	return (
		<div className='space-y-4'>
			{/* Общий рейтинг */}
			<div className='flex items-center gap-4'>
				<div className='text-center'>
					<div className='text-4xl font-bold text-foreground'>
						{average_rating.toFixed(1)}
					</div>
					<StarRating rating={average_rating} size='sm' />
					<div className='text-sm text-foreground/60 mt-1'>
						{reviews_count}{' '}
						{reviews_count === 1
							? 'отзыв'
							: reviews_count < 5
							? 'отзыва'
							: 'отзывов'}
					</div>
				</div>

				{/* Распределение оценок */}
				<div className='flex-1 space-y-2'>
					{[5, 4, 3, 2, 1].map((star) => {
						const count =
							rating_distribution[
								star.toString() as keyof typeof rating_distribution
							]
						const percentage = getPercentage(count)

						return (
							<div key={star} className='flex items-center gap-2'>
								<span className='text-sm text-foreground/70 w-3'>{star}</span>
								<svg
									className='w-4 h-4 text-yellow-400'
									fill='currentColor'
									viewBox='0 0 24 24'
								>
									<path d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z' />
								</svg>
								<div className='flex-1 h-2 bg-foreground/20 rounded-full overflow-hidden'>
									<div
										className='h-full bg-yellow-400 transition-all duration-300'
										style={{ width: `${percentage}%` }}
									/>
								</div>
								<span className='text-sm text-foreground/60 w-8 text-right'>
									{count}
								</span>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
