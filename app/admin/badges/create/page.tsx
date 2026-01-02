'use client'

import { useRouter } from 'next/navigation'
import { useCreateBadgeMutation } from '@/app/store/api/adminApi'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { BadgeForm } from '@/app/components/admin/forms/BadgeForm'
import {
	BadgeCreateInput,
	BadgeUpdateInput,
} from '@/app/components/admin/forms/schemas/validationSchemas'

export default function CreateBadgePage() {
	const router = useRouter()
	const [createBadge, { isLoading: creating }] = useCreateBadgeMutation()

	const handleSubmit = async (data: BadgeCreateInput | BadgeUpdateInput) => {
		try {
			await createBadge(data).unwrap()
			router.push('/admin/badges')
		} catch (err) {
			console.error('Error creating badge:', err)
			alert('Ошибка при создании бейджа')
		}
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			{/* Header */}
			<div className='sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5'>
				<div className='container mx-auto px-4 py-4'>
					<div className='flex items-center gap-3'>
						<Button
							onClick={() => router.push('/admin/badges')}
							variant='ghost'
							size='icon'
						>
							<ArrowLeft className='w-5 h-5' />
						</Button>
						<h1 className='text-2xl font-bold text-foreground'>
							Создать бейдж
						</h1>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className='container mx-auto px-4 py-6 max-w-2xl'>
				<BadgeForm
					mode='create'
					onSubmit={handleSubmit}
					isSubmitting={creating}
					submitText='Создать'
				/>
			</div>
		</div>
	)
}
