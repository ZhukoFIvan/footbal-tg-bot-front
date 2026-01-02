'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Check, ShoppingCart } from 'lucide-react'
import { Product } from '@/app/store/api/productsApi'
import { Button } from '@/components/ui/button'
import { useAddToServerCartMutation } from '@/app/store/api/serverCartApi'
import { useIsInCart } from '@/app/store/hooks/useCart'
import { useRouter } from 'next/navigation'

const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

// Функция для получения полного URL изображения
const getImageUrl = (imagePath: string | null) => {
	if (!imagePath) return '/placeholder.png'
	if (imagePath.startsWith('http')) return imagePath

	// Убираем /api из URL для uploads (картинки лежат на корне домена)
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
	const baseUrl = apiUrl.replace('/api', '')

	// Добавляем слэш если его нет
	const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
	return `${baseUrl}${path}`
}

// Функция для получения первого изображения из массива или JSON-строки
const getFirstImage = (images: string[] | string | null): string | null => {
	if (!images) return null

	// Если это строка, пытаемся распарсить как JSON
	if (typeof images === 'string') {
		try {
			const parsed = JSON.parse(images)
			return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null
		} catch {
			// Если не JSON, возвращаем как есть
			return images
		}
	}

	// Если это массив, берем первый элемент
	return Array.isArray(images) && images.length > 0 ? images[0] : null
}

// Функция для расчета процента скидки
const calculateDiscount = (price: number, oldPrice: number | null) => {
	if (!oldPrice || oldPrice <= price) return null
	return Math.round(((oldPrice - price) / oldPrice) * 100)
}

interface ProductCardProps {
	product: Product
	onClick?: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
	const router = useRouter()
	const isInCart = useIsInCart(product.id)
	const [addToCart, { isLoading }] = useAddToServerCartMutation()
	const [imageLoaded, setImageLoaded] = useState(false)
	const discount = calculateDiscount(product.price, product.old_price)

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.stopPropagation()

		if (!isInCart) {
			try {
				await addToCart({
					product_id: product.id,
					quantity: 1,
				}).unwrap()
			} catch {
				alert(
					`Не удалось добавить товар в корзину. Проверьте консоль для деталей.`
				)
			}
		}
	}

	const handleGoToCart = (e: React.MouseEvent) => {
		e.stopPropagation()
		router.push('/cart')
	}

	return (
		<div
			onClick={onClick}
			className='rounded-3xl bg-element-bg p-4 cursor-pointer transition-transform active:scale-[0.98]'
		>
			<div className='relative aspect-square w-full overflow-hidden rounded-2xl bg-element-bg/60'>
				{!imageLoaded && (
					<div className='absolute inset-0 bg-element-bg animate-pulse' />
				)}

				{product.badge && (
					<div className='absolute left-0.5 bottom-0.5 z-10'>
						<span
							className='rounded-full px-3 py-1 text-xs font-semibold'
							style={{
								backgroundColor: product.badge.color,
								color: product.badge.text_color,
							}}
						>
							{product.badge.title}
						</span>
					</div>
				)}

				{discount && (
					<div className='absolute right-0.5 top-0.5 text-xs font-bold text-white z-10 bg-primary/60 backdrop-blur-md rounded-full px-1 py-0.5'>
						-{discount}%
					</div>
				)}

				<div className='flex h-full w-full items-center justify-center p-6'>
					<Image
						src={getImageUrl(getFirstImage(product.images))}
						alt={product.title}
						className={`object-contain transition-opacity duration-300 ${
							imageLoaded ? 'opacity-100' : 'opacity-0'
						}`}
						width={130}
						height={130}
						unoptimized
						onLoad={() => setImageLoaded(true)}
						priority
					/>
				</div>
			</div>

			{/* Title */}
			<div className='mt-3'>
				<p className='text-sm leading-snug text-foreground line-clamp-2'>
					{product.title}
				</p>

				{/* Price */}
				<div className='mt-2 flex items-baseline gap-2'>
					<div className='text-xl font-semibold tracking-tight text-foreground'>
						{rub(product.price)}
					</div>
					{product.old_price && (
						<div className='text-sm text-foreground/40 line-through'>
							{rub(product.old_price)}
						</div>
					)}
				</div>

				{/* Buy button or "In Cart" button */}
				{!isInCart ? (
					<Button
						onClick={handleAddToCart}
						disabled={isLoading}
						variant='outline'
						className='mt-3 w-full rounded-full border-white/10 bg-transparent hover:bg-element-bg/60 text-foreground h-10'
					>
						{isLoading ? (
							'Добавление...'
						) : (
							<>
								<ShoppingCart className='w-4 h-4 mr-2' />
								Купить
							</>
						)}
					</Button>
				) : (
					<Button
						onClick={handleGoToCart}
						variant='default'
						className='mt-3 w-full rounded-full bg-primary hover:bg-primary-hover text-white h-10'
					>
						<Check className='w-4 h-4 mr-2' />В корзине
					</Button>
				)}
			</div>
		</div>
	)
}
