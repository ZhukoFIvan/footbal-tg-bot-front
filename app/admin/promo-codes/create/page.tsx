'use client'

import { useRouter } from 'next/navigation'
import { useCreatePromoCodeMutation } from '@/app/store/api/promoCodesApi'
import { PromoCodeForm } from '@/app/components/admin/forms/PromoCodeForm'
import { Button } from '@/components/ui/button'

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
		<div className='min-h-screen bg-background p-6'>
			<div className='max-w-2xl mx-auto'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-3xl font-bold text-foreground'>
						Создать промокод
					</h1>
					<Button
						onClick={() => router.push('/admin/promo-codes')}
						variant='outline'
						className='border-white/10'
					>
						← Назад
					</Button>
				</div>

				<div className='bg-element-bg rounded-2xl p-6'>
					<PromoCodeForm onSubmit={handleSubmit} isLoading={isLoading} />
				</div>
			</div>
		</div>
	)
}

