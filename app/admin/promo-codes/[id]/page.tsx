'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import {
	useGetAdminPromoCodeQuery,
	useUpdatePromoCodeMutation,
} from '@/app/store/api/promoCodesApi'
import { PromoCodeForm } from '@/app/components/admin/forms/PromoCodeForm'
import { Button } from '@/components/ui/button'
import AdminHeader from '@/app/components/admin/shared/AdminHeader'
import Loader from '@/app/components/Loader/Loader'

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
			<div className='min-h-screen bg-background pb-24'>
				<AdminHeader title='Редактировать промокод' />
				<div className='container mx-auto px-4 py-6'>
					<Loader />
				</div>
			</div>
		)
	}

	if (!promoCode) {
		return (
			<div className='min-h-screen bg-background pb-24'>
				<AdminHeader title='Редактировать промокод' />
				<div className='container mx-auto px-4 py-6'>
					<div className='max-w-2xl mx-auto'>
						<p className='text-destructive mb-4'>Промокод не найден</p>
						<Button onClick={() => router.push('/admin/promo-codes')}>
							← Назад к списку
						</Button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			<AdminHeader title='Редактировать промокод' />
			<div className='container mx-auto px-4 py-6'>
				<div className='max-w-2xl mx-auto'>
					<p className='text-foreground/70 mb-6'>
						Использований: {promoCode.usage_count}
						{promoCode.usage_limit ? ` / ${promoCode.usage_limit}` : ' / ∞'}
					</p>

					<div className='bg-element-bg rounded-2xl p-6'>
						<PromoCodeForm
							initialData={promoCode}
							onSubmit={handleSubmit}
							isLoading={updating}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
