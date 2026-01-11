'use client'

import React, { useState } from 'react'
import {
	useGetShopReviewsQuery,
	useGetShopRatingQuery,
	useCreateReviewMutation,
	useUpdateReviewMutation,
	useDeleteReviewMutation,
	Review,
} from '@/app/store/api/reviewsApi'
import { RatingDistribution } from './RatingDistribution'
import { ReviewItem } from './ReviewItem'
import { ReviewForm } from './ReviewForm'
import Loader from '../Loader/Loader'

export const ProductReviews: React.FC = () => {
	const [showForm, setShowForm] = useState(false)
	const [editingReview, setEditingReview] = useState<Review | null>(null)

	// Queries
	const {
		data: reviews,
		isLoading: reviewsLoading,
		error: reviewsError,
		refetch: refetchReviews,
	} = useGetShopReviewsQuery()

	const {
		data: rating,
		isLoading: ratingLoading,
		error: ratingError,
		refetch: refetchRating,
	} = useGetShopRatingQuery()

	// Mutations
	const [createReview, { isLoading: isCreating }] = useCreateReviewMutation()
	const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation()
	const [deleteReview] = useDeleteReviewMutation()

	const handleSubmit = async (data: { rating: number; comment: string }) => {
		try {
			if (editingReview) {
				await updateReview({
					reviewId: editingReview.id,
					data,
				}).unwrap()
				setEditingReview(null)
			} else {
				await createReview(data).unwrap()
			}
			setShowForm(false)

			// Принудительно обновляем данные с задержкой
			setTimeout(() => {
				refetchReviews()
				refetchRating()
			}, 500)

			// Повторный запрос через 1 секунду (на случай если бэкенд медленный)
			setTimeout(() => {
				refetchRating()
			}, 1000)
		} catch (error) {
			console.error('Failed to submit review:', error)
			const errorMessage =
				error && typeof error === 'object' && 'data' in error
					? (error.data as { detail?: string })?.detail
					: undefined
			alert(errorMessage || 'Не удалось отправить отзыв')
		}
	}

	const handleEdit = (review: Review) => {
		setEditingReview(review)
		setShowForm(true)
	}

	const handleDelete = async (reviewId: number) => {
		if (!confirm('Вы уверены, что хотите удалить отзыв?')) {
			return
		}

		try {
			await deleteReview(reviewId).unwrap()

			// Принудительно обновляем данные с задержкой
			setTimeout(() => {
				refetchReviews()
				refetchRating()
			}, 500)

			// Повторный запрос через 1 секунду
			setTimeout(() => {
				refetchRating()
			}, 1000)
		} catch (error) {
			console.error('Failed to delete review:', error)
			const errorMessage =
				error && typeof error === 'object' && 'data' in error
					? (error.data as { detail?: string })?.detail
					: undefined
			alert(errorMessage || 'Не удалось удалить отзыв')
		}
	}

	const handleCancelForm = () => {
		setShowForm(false)
		setEditingReview(null)
	}

	// Проверяем, есть ли у пользователя свой отзыв
	const userReview = reviews?.find((r) => r.is_own)
	const canAddReview = !userReview && !showForm

	if (reviewsLoading || ratingLoading) {
		return (
			<div className='py-8'>
				<Loader />
			</div>
		)
	}

	if (reviewsError || ratingError) {
		return (
			<div className='p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500'>
				Не удалось загрузить отзывы
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			{/* Статистика рейтинга - показываем всегда если есть данные */}
			{rating && (
				<div className='p-4 bg-element-bg rounded-lg'>
					<RatingDistribution rating={rating} />
				</div>
			)}

			{/* Кнопка добавления отзыва */}
			{canAddReview && (
				<button
					onClick={() => setShowForm(true)}
					className='w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center justify-center gap-2'
				>
					<svg
						className='w-5 h-5'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 4v16m8-8H4'
						/>
					</svg>
					Оставить отзыв
				</button>
			)}

			{/* Форма добавления/редактирования отзыва */}
			{showForm && (
				<div className='p-4 bg-element-bg border border-foreground/20 rounded-lg'>
					<ReviewForm
						editingReview={editingReview}
						onSubmit={handleSubmit}
						onCancel={handleCancelForm}
						isLoading={isCreating || isUpdating}
					/>
				</div>
			)}

			{/* Список отзывов */}
			{reviews && reviews.length > 0 ? (
				<div className='space-y-1'>
					<h3 className='text-lg font-semibold text-foreground mb-3'>
						Отзывы ({reviews.length})
					</h3>
					<div className='divide-y divide-foreground/10'>
						{reviews.map((review) => (
							<ReviewItem
								key={review.id}
								review={review}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						))}
					</div>
				</div>
			) : (
				!showForm && (
					<div className='text-center py-8 text-foreground/60'>
						<svg
							className='w-16 h-16 mx-auto mb-3 text-foreground/30'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1.5}
								d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
							/>
						</svg>
						<p className='text-lg font-medium mb-1'>Пока нет отзывов</p>
						<p className='text-sm'>
							Будьте первым, кто оставит отзыв о нашем магазине!
						</p>
					</div>
				)
			)}
		</div>
	)
}
