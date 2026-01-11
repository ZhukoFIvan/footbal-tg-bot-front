'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	useGetAdminReviewsQuery,
	useGetAdminReviewStatsQuery,
	useModerateReviewMutation,
	useDeleteAdminReviewMutation,
} from '@/app/store/api/reviewsApi'
import { useAppSelector } from '@/app/store/hooks'
import { selectIsAuthenticated } from '@/app/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import {
	Check,
	X,
	Trash2,
	Star,
	User,
	Clock,
	AlertCircle,
} from 'lucide-react'
import Loader from '@/app/components/Loader/Loader'
import AdminHeader from '@/app/components/admin/shared/AdminHeader'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

export default function AdminReviewsPage() {
	const router = useRouter()
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
	const isAuthenticated = useAppSelector(selectIsAuthenticated)

	// Queries
	const { data: stats, isLoading: statsLoading } = useGetAdminReviewStatsQuery(
		undefined,
		{ skip: !isAuthenticated }
	)
	const {
		data: reviews,
		isLoading: reviewsLoading,
	} = useGetAdminReviewsQuery(
		{
			status: statusFilter === 'all' ? undefined : statusFilter,
		},
		{ skip: !isAuthenticated }
	)

	// Mutations
	const [moderateReview] = useModerateReviewMutation()
	const [deleteReview] = useDeleteAdminReviewMutation()

	const handleApprove = async (reviewId: number) => {
		try {
			await moderateReview({ reviewId, action: 'approve' }).unwrap()
		} catch (error) {
			console.error('Failed to approve review:', error)
		}
	}

	const handleReject = async (reviewId: number) => {
		try {
			await moderateReview({ reviewId, action: 'reject' }).unwrap()
		} catch (error) {
			console.error('Failed to reject review:', error)
		}
	}

	const handleDelete = async (reviewId: number) => {
		if (confirm('Удалить отзыв?')) {
			try {
				await deleteReview(reviewId).unwrap()
			} catch (error) {
				console.error('Failed to delete review:', error)
			}
		}
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'text-yellow-500'
			case 'approved':
				return 'text-green-500'
			case 'rejected':
				return 'text-red-500'
			default:
				return 'text-foreground/50'
		}
	}

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending':
				return 'На модерации'
			case 'approved':
				return 'Одобрен'
			case 'rejected':
				return 'Отклонен'
			default:
				return status
		}
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			<AdminHeader title='Модерация отзывов' />

			{/* Stats */}
			<div className='container mx-auto px-4 py-6'>
				{statsLoading ? (
					<div className='h-20'>
						<Loader />
					</div>
				) : stats ? (
					<div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
						<div className='bg-element-bg rounded-2xl p-4'>
							<div className='text-foreground/50 text-sm mb-1'>Всего</div>
							<div className='text-2xl font-bold text-foreground'>
								{stats.total}
							</div>
						</div>
						<div className='bg-element-bg rounded-2xl p-4'>
							<div className='text-foreground/50 text-sm mb-1'>
								На модерации
							</div>
							<div className='text-2xl font-bold text-yellow-500'>
								{stats.pending}
							</div>
						</div>
						<div className='bg-element-bg rounded-2xl p-4'>
							<div className='text-foreground/50 text-sm mb-1'>Одобрено</div>
							<div className='text-2xl font-bold text-green-500'>
								{stats.approved}
							</div>
						</div>
						<div className='bg-element-bg rounded-2xl p-4'>
							<div className='text-foreground/50 text-sm mb-1'>Отклонено</div>
							<div className='text-2xl font-bold text-red-500'>
								{stats.rejected}
							</div>
						</div>
					</div>
				) : null}

				{/* Filter Tabs */}
				<div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
					{[
						{ key: 'pending' as StatusFilter, label: 'На модерации' },
						{ key: 'all' as StatusFilter, label: 'Все' },
						{ key: 'approved' as StatusFilter, label: 'Одобренные' },
						{ key: 'rejected' as StatusFilter, label: 'Отклоненные' },
					].map((tab) => (
						<button
							key={tab.key}
							onClick={() => setStatusFilter(tab.key)}
							className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
								statusFilter === tab.key
									? 'bg-primary text-white'
									: 'bg-element-bg text-foreground/70 hover:bg-element-bg/80'
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Reviews List */}
				{reviewsLoading ? (
					<Loader />
				) : reviews && reviews.length > 0 ? (
					<div className='space-y-4'>
						{reviews.map((review) => (
							<div
								key={review.id}
								className='bg-element-bg rounded-2xl p-4 space-y-4'
							>
								{/* Header */}
								<div className='flex items-start justify-between gap-4'>
									<div className='flex-1 space-y-2'>
										{/* User */}
										<div className='flex items-center gap-2 text-sm text-foreground/70'>
											<User className='w-4 h-4 text-foreground/50' />
											<span>
												{review.user.first_name || 'Пользователь'}{' '}
												{review.user.last_name || ''}
												{review.user.username && (
													<span className='text-foreground/50'>
														{' '}
														@{review.user.username}
													</span>
												)}
											</span>
										</div>

										{/* Time */}
										<div className='flex items-center gap-2 text-sm text-foreground/50'>
											<Clock className='w-4 h-4' />
											<span>
												{formatDistanceToNow(new Date(review.created_at), {
													addSuffix: true,
													locale: ru,
												})}
											</span>
										</div>
									</div>

									{/* Status Badge */}
									<div
										className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
											review.status
										)} bg-current/10`}
									>
										{getStatusText(review.status)}
									</div>
								</div>

								{/* Rating */}
								<div className='flex items-center gap-1'>
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-5 h-5 ${
												i < review.rating
													? 'text-yellow-500 fill-yellow-500'
													: 'text-foreground/20'
											}`}
										/>
									))}
								</div>

								{/* Comment */}
								{review.comment && (
									<p className='text-foreground/80 text-sm leading-relaxed'>
										{review.comment}
									</p>
								)}

								{/* Actions */}
								{review.status === 'pending' && (
									<div className='flex gap-2 pt-2'>
										<Button
											onClick={() => handleApprove(review.id)}
											className='flex-1 bg-green-600 hover:bg-green-700 text-white'
											size='sm'
										>
											<Check className='w-4 h-4 mr-2' />
											Одобрить
										</Button>
										<Button
											onClick={() => handleReject(review.id)}
											className='flex-1 bg-red-600 hover:bg-red-700 text-white'
											size='sm'
										>
											<X className='w-4 h-4 mr-2' />
											Отклонить
										</Button>
										<Button
											onClick={() => handleDelete(review.id)}
											variant='ghost'
											size='icon'
											className='text-destructive hover:text-destructive'
										>
											<Trash2 className='w-4 h-4' />
										</Button>
									</div>
								)}

								{review.status !== 'pending' && (
									<div className='flex gap-2 pt-2'>
										<Button
											onClick={() => handleDelete(review.id)}
											variant='ghost'
											size='sm'
											className='text-destructive hover:text-destructive'
										>
											<Trash2 className='w-4 h-4 mr-2' />
											Удалить
										</Button>
									</div>
								)}
							</div>
						))}
					</div>
				) : (
					<div className='text-center py-12'>
						<div className='w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4'>
							<AlertCircle className='w-8 h-8 text-foreground/30' />
						</div>
						<p className='text-foreground/50'>Отзывов нет</p>
					</div>
				)}
			</div>
		</div>
	)
}
