'use client'

import React, { useState } from 'react'
import { Review } from '@/app/store/api/reviewsApi'
import { StarRating } from './StarRating'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

interface ReviewItemProps {
	review: Review
	onEdit?: (review: Review) => void
	onDelete?: (reviewId: number) => void
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
	review,
	onEdit,
	onDelete,
}) => {
	const [showActions, setShowActions] = useState(false)

	// Правильно парсим ISO дату
	const createdDate = parseISO(review.created_at)
	const updatedDate = parseISO(review.updated_at)
	const timeAgo = formatDistanceToNow(createdDate, {
		addSuffix: true,
		locale: ru,
	})

	// Проверяем разницу больше 1 секунды (чтобы избежать ложных срабатываний)
	const isEdited = Math.abs(updatedDate.getTime() - createdDate.getTime()) > 1000
	
	// Безопасное получение имени и первой буквы
	const displayName = review.user.display_name || review.user.first_name || 'User'
	const avatarLetter = displayName.charAt(0).toUpperCase()

	return (
		<div className="py-4 border-b border-foreground/10 last:border-0">
			<div className="flex items-start justify-between gap-3">
				{/* Аватар и информация */}
				<div className="flex gap-3 flex-1">
					{/* Аватар */}
					<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
						{avatarLetter}
					</div>

					{/* Контент */}
					<div className="flex-1 min-w-0">
						{/* Имя и рейтинг */}
						<div className="flex items-center gap-2 mb-1">
							<span className="font-medium text-foreground truncate">
								{displayName}
							</span>
							{review.user.username && (
								<span className="text-sm text-foreground/60">
									@{review.user.username}
								</span>
							)}
						</div>

						<div className="flex items-center gap-2 mb-2">
							<StarRating rating={review.rating} size="sm" />
							<span className="text-xs text-foreground/60">
								{timeAgo}
								{isEdited && ' (изменено)'}
							</span>
							{/* Статус модерации (только для собственных неодобренных отзывов) */}
							{review.status && (
								<span
									className={`text-xs px-2 py-0.5 rounded-full ${
										review.status === 'pending'
											? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
											: 'bg-red-500/20 text-red-600 dark:text-red-400'
									}`}
								>
									{review.status === 'pending' ? 'На модерации' : 'Отклонен'}
								</span>
							)}
						</div>

						{/* Комментарий */}
						{review.comment && (
							<p className="text-sm text-foreground/80 whitespace-pre-wrap break-words">
								{review.comment}
							</p>
						)}
					</div>
				</div>

				{/* Действия для своих отзывов */}
				{review.is_own && (onEdit || onDelete) && (
					<div className="relative">
						<button
							onClick={() => setShowActions(!showActions)}
							className="p-2 hover:bg-element-bg rounded-full transition-colors"
						>
							<svg
								className="w-5 h-5 text-foreground/60"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
								/>
							</svg>
						</button>

						{showActions && (
							<>
								<div
									className="fixed inset-0 z-10"
									onClick={() => setShowActions(false)}
								/>
								<div className="absolute right-0 mt-1 w-40 bg-background rounded-lg shadow-lg border border-foreground/20 py-1 z-20">
									{onEdit && (
										<button
											onClick={() => {
												onEdit(review)
												setShowActions(false)
											}}
											className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-element-bg flex items-center gap-2"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												/>
											</svg>
											Редактировать
										</button>
									)}
									{onDelete && (
										<button
											onClick={() => {
												onDelete(review.id)
												setShowActions(false)
											}}
											className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
											Удалить
										</button>
									)}
								</div>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

