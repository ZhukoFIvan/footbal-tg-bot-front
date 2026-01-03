'use client'

import { useRouter } from 'next/navigation'
import { useCreatePromoCodeMutation } from '@/app/store/api/promoCodesApi'
import { PromoCodeForm } from '@/app/components/admin/forms/PromoCodeForm'
import AdminHeader from '@/app/components/admin/shared/AdminHeader'

export default function CreatePromoCodePage() {
	const router = useRouter()
	const [createPromoCode, { isLoading }] = useCreatePromoCodeMutation()

	const handleSubmit = async (data: unknown) => {
		try {
			await createPromoCode(data as never).unwrap()
			alert('Промокод создан!')
			router.push('/admin/promo-codes')
		} catch (error: unknown) {
			if (error && typeof error === 'object' && 'data' in error) {
				const errorData = error.data as { detail?: string }
				alert(`Ошибка: ${errorData.detail || 'Не удалось создать промокод'}`)
			} else {
				alert('Ошибка при создании промокода')
			}
		}
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			<AdminHeader title='Создать промокод' />
			<div className='container mx-auto px-4 py-6'>
				<div className='max-w-2xl mx-auto'>
					<div className='bg-element-bg rounded-2xl p-6'>
						<PromoCodeForm onSubmit={handleSubmit} isLoading={isLoading} />
					</div>
				</div>
			</div>
		</div>
	)
}
