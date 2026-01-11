'use client'

import React, { useState, useEffect } from 'react'
import { StarRating } from './StarRating'
import { Review } from '@/app/store/api/reviewsApi'

interface ReviewFormProps {
	editingReview?: Review | null
	onSubmit: (data: { rating: number; comment: string }) => void
	onCancel?: () => void
	isLoading?: boolean
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
	editingReview,
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const [rating, setRating] = useState(editingReview?.rating || 0)
	const [comment, setComment] = useState(editingReview?.comment || '')
	const [error, setError] = useState('')

	useEffect(() => {
		if (editingReview) {
			setRating(editingReview.rating)
			setComment(editingReview.comment || '')
		}
	}, [editingReview])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (rating === 0) {
			setError('Пожалуйста, выберите оценку')
			return
		}

		if (comment.length > 1000) {
			setError('Комментарий не должен превышать 1000 символов')
			return
		}

		setError('')
		onSubmit({ rating, comment: comment.trim() })
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Заголовок */}
			<div>
				<h3 className="text-lg font-semibold text-foreground mb-2">
					{editingReview ? 'Редактировать отзыв' : 'Оставить отзыв'}
				</h3>
			</div>

			{/* Оценка */}
			<div>
				<label className="block text-sm font-medium text-foreground mb-2">
					Ваша оценка <span className="text-red-500">*</span>
				</label>
				<StarRating
					rating={rating}
					size="lg"
					interactive
					onRatingChange={setRating}
				/>
			</div>

			{/* Комментарий */}
			<div>
				<label
					htmlFor="comment"
					className="block text-sm font-medium text-foreground mb-2"
				>
					Комментарий (необязательно)
				</label>
				<textarea
					id="comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder="Расскажите о вашем опыте покупок в нашем магазине..."
					rows={4}
					maxLength={1000}
					className="w-full px-3 py-2 bg-element-bg border border-foreground/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-foreground placeholder:text-foreground/50"
				/>
				<div className="flex justify-between mt-1">
					<span className="text-xs text-foreground/60">
						{comment.length}/1000 символов
					</span>
				</div>
			</div>

			{/* Ошибка */}
			{error && (
				<div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
					{error}
				</div>
			)}

			{/* Кнопки */}
			<div className="flex gap-3">
				<button
					type="submit"
					disabled={isLoading || rating === 0}
					className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:bg-foreground/20 disabled:cursor-not-allowed transition-colors font-medium"
				>
					{isLoading
						? 'Отправка...'
						: editingReview
						? 'Сохранить'
						: 'Отправить отзыв'}
				</button>
				{(editingReview || onCancel) && (
					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						className="px-4 py-2 border border-foreground/20 text-foreground rounded-lg hover:bg-element-bg transition-colors"
					>
						Отмена
					</button>
				)}
			</div>
		</form>
	)
}

