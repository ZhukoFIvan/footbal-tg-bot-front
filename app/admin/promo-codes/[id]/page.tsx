'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import {
	useGetAdminPromoCodeQuery,
	useUpdatePromoCodeMutation,
} from '@/app/store/api/promoCodesApi'
import { PromoCodeForm } from '@/app/components/admin/forms/PromoCodeForm'
import { Button } from '@/components/ui/button'

export default function EditPromoCodePage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const resolvedParams = use(params)
	const promoId = parseInt(resolvedParams.id)
	const router = useRouter()

	const { data: promoCode, isLoading: loadingPromo } =
		useGetAdminPromoCodeQuery(promoId)
	const [updatePromoCode, { isLoading: updating }] =
		useUpdatePromoCodeMutation()

	const handleSubmit = async (data: unknown) => {
		try {
			await updatePromoCode({ id: promoId, data: data as never }).unwrap()
			alert('Промокод обновлён!')
			router.push('/admin/promo-codes')
		} catch (error: unknown) {
			if (error && typeof error === 'object' && 'data' in error) {
				const errorData = error.data as { detail?: string }
				alert(`Ошибка: ${errorData.detail || 'Не удалось обновить промокод'}`)
			} else {
				alert('Ошибка при обновлении промокода')
			}
		}
	}

	if (loadingPromo) {
		return (
			<div className='min-h-screen bg-background p-6'>
				<div className='max-w-2xl mx-auto'>
					<p className='text-foreground/70'>Загрузка...</p>
				</div>
			</div>
		)
	}

	if (!promoCode) {
		return (
			<div className='min-h-screen bg-background p-6'>
				<div className='max-w-2xl mx-auto'>
					<p className='text-destructive'>Промокод не найден</p>
					<Button
						onClick={() => router.push('/admin/promo-codes')}
						className='mt-4'
					>
						← Назад к списку
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background p-6'>
			<div className='max-w-2xl mx-auto'>
				<div className='flex justify-between items-center mb-6'>
					<div>
						<h1 className='text-3xl font-bold text-foreground mb-1'>
							Редактировать промокод
						</h1>
						<p className='text-foreground/70'>
							Использований: {promoCode.usage_count}
							{promoCode.usage_limit ? ` / ${promoCode.usage_limit}` : ''}
						</p>
					</div>
					<Button
						onClick={() => router.push('/admin/promo-codes')}
						variant='outline'
						className='border-white/10'
					>
						← Назад
					</Button>
				</div>

				<div className='bg-element-bg rounded-2xl p-6'>
					<PromoCodeForm
						initialData={promoCode}
						onSubmit={handleSubmit}
						isLoading={updating}
					/>
				</div>
			</div>
		</div>
	)
}

