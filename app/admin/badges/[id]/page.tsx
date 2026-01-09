'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useGetAdminBadgesQuery, useUpdateBadgeMutation } from '@/app/store/api/adminApi'
import { useAppSelector } from '@/app/store/hooks'
import { selectIsAuthenticated } from '@/app/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Loader from '@/app/components/Loader/Loader'
import { BadgeForm } from '@/app/components/admin/forms/BadgeForm'
import { BadgeUpdateInput } from '@/app/components/admin/forms/schemas/validationSchemas'

export default function EditBadgePage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params)
	const router = useRouter()
	const badgeId = parseInt(resolvedParams.id)
	const isAuthenticated = useAppSelector(selectIsAuthenticated)

	const { data: badges, isLoading } = useGetAdminBadgesQuery(undefined, {
		skip: !isAuthenticated,
	})
	const [updateBadge, { isLoading: updating }] = useUpdateBadgeMutation()

	const badge = badges?.find((b) => b.id === badgeId)

	const handleSubmit = async (data: BadgeUpdateInput) => {
		try {
			await updateBadge({
				id: badgeId,
				data,
			}).unwrap()
			router.push('/admin/badges')
		} catch (err) {
			console.error('Error updating badge:', err)
			alert('Ошибка при обновлении бейджа')
		}
	}

	if (isLoading || !badge) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			{/* Header */}
			<div className='sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5'>
				<div className='container mx-auto px-4 py-4'>
					<div className='flex items-center gap-3'>
						<Button onClick={() => router.push('/admin/badges')} variant='ghost' size='icon'>
							<ArrowLeft className='w-5 h-5' />
						</Button>
						<h1 className='text-2xl font-bold text-foreground'>Редактировать бейдж</h1>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className='container mx-auto px-4 py-6 max-w-2xl'>
				<BadgeForm
					mode='update'
					defaultValues={{
						title: badge.title,
						color: badge.color,
						text_color: badge.text_color,
						is_active: badge.is_active,
					}}
					onSubmit={handleSubmit}
					isSubmitting={updating}
				/>
			</div>
		</div>
	)
}
