'use client'

import React from 'react'

interface StarRatingProps {
	rating: number
	maxRating?: number
	size?: 'sm' | 'md' | 'lg'
	showNumber?: boolean
	interactive?: boolean
	onRatingChange?: (rating: number) => void
}

export const StarRating: React.FC<StarRatingProps> = ({
	rating,
	maxRating = 5,
	size = 'md',
	showNumber = false,
	interactive = false,
	onRatingChange,
}) => {
	const [hoverRating, setHoverRating] = React.useState(0)

	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6',
	}

	const handleClick = (value: number) => {
		if (interactive && onRatingChange) {
			onRatingChange(value)
		}
	}

	const displayRating = interactive && hoverRating > 0 ? hoverRating : rating

	return (
		<div className="flex items-center gap-1">
			<div className="flex gap-0.5">
				{Array.from({ length: maxRating }, (_, index) => {
					const starValue = index + 1
					const isFilled = starValue <= displayRating
					const isPartial =
						!interactive &&
						starValue > displayRating &&
						starValue - 1 < displayRating

					return (
						<button
							key={index}
							type="button"
							disabled={!interactive}
							onClick={() => handleClick(starValue)}
							onMouseEnter={() =>
								interactive && setHoverRating(starValue)
							}
							onMouseLeave={() => interactive && setHoverRating(0)}
							className={`${sizeClasses[size]} ${
								interactive
									? 'cursor-pointer hover:scale-110 transition-transform'
									: 'cursor-default'
							}`}
						>
							{isPartial ? (
								<svg
									className="w-full h-full"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<defs>
										<linearGradient id={`grad-${index}`}>
											<stop
												offset={`${
													(displayRating - (starValue - 1)) * 100
												}%`}
												stopColor="#FFC107"
											/>
											<stop
												offset={`${
													(displayRating - (starValue - 1)) * 100
												}%`}
												stopColor="#E0E0E0"
											/>
										</linearGradient>
									</defs>
									<path
										d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
										fill={`url(#grad-${index})`}
										stroke="none"
									/>
								</svg>
							) : (
								<svg
									className="w-full h-full"
									viewBox="0 0 24 24"
									fill={isFilled ? '#FFC107' : '#E0E0E0'}
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
								</svg>
							)}
						</button>
					)
				})}
			</div>
			{showNumber && (
				<span className="text-sm font-medium text-gray-700">
					{rating.toFixed(1)}
				</span>
			)}
		</div>
	)
}

