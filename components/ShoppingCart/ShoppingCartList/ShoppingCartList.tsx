import { useState } from 'react'
import {
	useGetCartQuery,
	useRemoveCartItemMutation,
	useUpdateCartItemMutation,
} from '@/app/store/api/serverCartApi'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'

export const ShoppingCartList = () => {
	const [updateCartItem] = useUpdateCartItemMutation()
	const [removeCartItem] = useRemoveCartItemMutation()
	const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})
	const { data: serverCart } = useGetCartQuery()

	const getImageUrl = (imagePath: string | null) => {
		if (!imagePath) return '/placeholder.png'
		if (imagePath.startsWith('http')) return imagePath
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
		const baseUrl = apiUrl.replace('/api', '')
		const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
		return `${baseUrl}${path}`
	}

	const handleIncrement = async (itemId: number, currentQty: number) => {
		try {
			await updateCartItem({ itemId, quantity: currentQty + 1 }).unwrap()
		} catch {
			alert('Не удалось обновить количество')
		}
	}

	const handleDecrement = async (itemId: number, currentQty: number) => {
		try {
			if (currentQty > 1) {
				await updateCartItem({ itemId, quantity: currentQty - 1 }).unwrap()
			} else {
				await removeCartItem(itemId).unwrap()
			}
		} catch {
			alert('Не удалось обновить количество')
		}
	}

	const handleRemove = async (itemId: number) => {
		try {
			await removeCartItem(itemId).unwrap()
		} catch (error) {
			console.error('Failed to remove item:', error)
		}
	}

	const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

	const sortedItems = serverCart?.items
		? [...serverCart.items].sort((a, b) => a.id - b.id)
		: []

	return (
		<div className='space-y-4 mb-6'>
			<h1 className='text-2xl font-bold text-foreground'>Корзина</h1>
			{sortedItems.map((item) => (
				<div key={item.id} className='bg-element-bg rounded-2xl p-4 flex gap-4'>
					{/* Image */}
					<div className='w-20 h-20 rounded-xl overflow-hidden bg-element-bg/60 shrink-0 relative'>
						{/* Скелетон пока картинка загружается */}
						{!loadedImages[item.id] && (
							<div className='absolute inset-0 bg-element-bg animate-pulse' />
						)}
						<Image
							src={getImageUrl(item.product_image)}
							alt={item.product_title}
							width={80}
							height={80}
							className={`w-full h-full object-contain transition-opacity duration-300 ${
								loadedImages[item.id] ? 'opacity-100' : 'opacity-0'
							}`}
							unoptimized
							onLoad={() =>
								setLoadedImages((prev) => ({ ...prev, [item.id]: true }))
							}
							priority
						/>
					</div>

					<div className='flex-1 min-w-0'>
						<h3 className='text-foreground font-medium line-clamp-2 mb-2'>
							{item.product_title}
						</h3>
						<div className='flex items-center gap-2'>
							<span className='text-lg font-semibold text-foreground'>
								{rub(item.product_price)}
							</span>
							{item.product_old_price && (
								<span className='text-sm text-foreground/40 line-through'>
									{rub(item.product_old_price)}
								</span>
							)}
						</div>

						<div className='flex items-center gap-2 mt-3'>
							<div className='flex items-center bg-element-bg/60 rounded-full p-1'>
								<Button
									onClick={() => handleDecrement(item.id, item.quantity)}
									size='icon'
									variant='ghost'
									className='w-8 h-8 rounded-full hover:bg-element-bg'
								>
									<Minus className='w-4 h-4' />
								</Button>
								<span className='text-foreground font-semibold px-3'>
									{item.quantity}
								</span>
								<Button
									onClick={() => handleIncrement(item.id, item.quantity)}
									size='icon'
									className='w-8 h-8 rounded-full bg-primary hover:bg-primary-hover'
								>
									<Plus className='w-4 h-4 text-white' />
								</Button>
							</div>

							<Button
								onClick={() => handleRemove(item.id)}
								size='icon'
								variant='ghost'
								className='w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10'
							>
								<Trash2 className='w-4 h-4' />
							</Button>
						</div>
					</div>

					<div className='text-right'>
						<div className='text-xl font-bold text-foreground'>
							{rub(item.subtotal)}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
