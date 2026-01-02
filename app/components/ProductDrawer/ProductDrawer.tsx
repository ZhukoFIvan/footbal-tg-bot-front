'use client'

import { Product } from '@/app/store/api/productsApi'
import { X, Check, ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from '@/components/ui/carousel'
import { useAddToServerCartMutation } from '@/app/store/api/serverCartApi'
import { useIsInCart } from '@/app/store/hooks/useCart'
import { useRouter } from 'next/navigation'
import { ProductReviews } from '../Reviews/ProductReviews'
import { useGetProductRatingQuery } from '@/app/store/api/reviewsApi'

const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

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

// Функция для парсинга images (может быть массив или JSON-строка)
const parseImages = (images: string[] | string | null): string[] => {
	if (!images) return []

	// Если это строка, пытаемся распарсить как JSON
	if (typeof images === 'string') {
		try {
			const parsed = JSON.parse(images)
			return Array.isArray(parsed) ? parsed : [images]
		} catch {
			// Если не JSON, возвращаем как массив из одного элемента
			return [images]
		}
	}

	// Если это массив, возвращаем как есть
	return Array.isArray(images) ? images : []
}

const calculateDiscount = (price: number, oldPrice: number | null) => {
	if (!oldPrice || oldPrice <= price) return null
	return Math.round(((oldPrice - price) / oldPrice) * 100)
}

interface ProductDrawerProps {
	product: Product | null
	isOpen: boolean
	onClose: () => void
}

export default function ProductDrawer({
	product,
	isOpen,
	onClose,
}: ProductDrawerProps) {
	const router = useRouter()
	const isInCart = useIsInCart(product?.id || 0)
	const [addToCart, { isLoading }] = useAddToServerCartMutation()
	const [api, setApi] = useState<CarouselApi>()
	const [current, setCurrent] = useState(0)
	const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})
	const [showReviews, setShowReviews] = useState(false)

	// Получаем рейтинг товара
	const { data: rating } = useGetProductRatingQuery(product?.id || 0, {
		skip: !product?.id,
	})

	// Для примера создаем массив изображений (в реальности они должны приходить с бэка)
	const images = product
		? parseImages(product.images).map((img) => getImageUrl(img))
		: []

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
			// Сбрасываем карусель с небольшой задержкой после закрытия
			const timer = setTimeout(() => {
				setCurrent(0)
			}, 300)
			return () => clearTimeout(timer)
		}
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	useEffect(() => {
		if (!api) return

		const updateCurrent = () => {
			setCurrent(api.selectedScrollSnap())
		}

		updateCurrent()
		api.on('select', updateCurrent)

		return () => {
			api.off('select', updateCurrent)
		}
	}, [api])

	if (!product) return null

	const discount = calculateDiscount(product.price, product.old_price)

	const handleAddToCart = async () => {
		if (!isInCart && product) {
			try {
				await addToCart({
					product_id: product.id,
					quantity: 1,
				}).unwrap()
			} catch {
				alert('Не удалось добавить товар в корзину')
			}
		}
	}

	const handleGoToCart = () => {
		onClose()
		router.push('/cart')
	}

	return (
		<>
			{/* Overlay */}
			<div
				className={cn(
					'fixed inset-0 bg-background/80 backdrop-blur-sm z-60 transition-opacity duration-300',
					isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				)}
				onClick={onClose}
			/>

			{/* Drawer */}
			<div
				className={cn(
					'fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-70 transition-transform duration-300 ease-out max-h-[90vh] overflow-y-auto',
					isOpen ? 'translate-y-0' : 'translate-y-full'
				)}
			>
				<Button
					onClick={onClose}
					size='icon'
					variant='ghost'
					className='absolute top-4 right-4 w-10 h-10 rounded-full bg-element-bg hover:bg-element-bg/80 z-10'
				>
					<X className='w-5 h-5 text-foreground' />
				</Button>

				<div className='flex justify-center pt-3 pb-2'>
					<div className='w-12 h-1 bg-foreground/20 rounded-full' />
				</div>

				<div className='px-6 pb-6'>
					{/* Image carousel */}
					<div className='relative mb-6'>
						<Carousel setApi={setApi} className='w-full'>
							<CarouselContent>
								{images.map((img, idx) => (
									<CarouselItem key={idx}>
										<div className='relative aspect-square w-full overflow-hidden rounded-2xl bg-element-bg/60'>
											{/* Скелетон пока картинка загружается */}
											{!loadedImages[idx] && (
												<div className='absolute inset-0 bg-element-bg animate-pulse z-5' />
											)}

											{/* Badge */}
											{product.badge && idx === 0 && (
												<div className='absolute left-3 bottom-3 z-10'>
													<span
														className='relative inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold'
														style={{
															backgroundColor: product.badge.color,
															color: product.badge.text_color,
														}}
													>
														{product.badge.title}
														<span
															className='absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0'
															style={{
																borderTop: '8px solid transparent',
																borderBottom: '8px solid transparent',
																borderLeft: `8px solid ${product.badge.color}`,
															}}
														/>
													</span>
												</div>
											)}

											{/* Discount */}
											{discount && idx === 0 && (
												<div className='absolute right-3 top-3 text-sm font-bold text-white z-10 bg-primary/60 backdrop-blur-md rounded-full px-2 py-1'>
													-{discount}%
												</div>
											)}

											{/* Image */}
											<div className='flex h-full w-full items-center justify-center p-8'>
												<Image
													src={img}
													alt={product.title}
													width={300}
													height={300}
													className={`object-contain transition-opacity duration-300 ${
														loadedImages[idx] ? 'opacity-100' : 'opacity-0'
													}`}
													unoptimized
													onLoad={() =>
														setLoadedImages((prev) => ({
															...prev,
															[idx]: true,
														}))
													}
													priority={idx === 0}
												/>
											</div>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>

							{/* Navigation arrows - только если больше 1 изображения */}
							{images.length > 1 && (
								<>
									<CarouselPrevious className='left-2 bg-element-bg/80 backdrop-blur-sm hover:bg-element-bg border-none text-foreground' />
									<CarouselNext className='right-2 bg-element-bg/80 backdrop-blur-sm hover:bg-element-bg border-none text-foreground' />
								</>
							)}
						</Carousel>

						{/* Dots indicator */}
						{images.length > 1 && (
							<div className='flex justify-center gap-1.5 mt-3'>
								{images.map((_, idx) => (
									<button
										key={idx}
										onClick={() => api?.scrollTo(idx)}
										className={cn(
											'h-1.5 rounded-full transition-all',
											idx === current
												? 'bg-primary w-4'
												: 'bg-foreground/30 w-1.5'
										)}
									/>
								))}
							</div>
						)}
					</div>

					{/* Title */}
					<h2 className='text-2xl font-bold text-foreground mb-3'>
						{product.title}
					</h2>

					{/* Description */}
					{product.description && (
						<p className='text-sm text-foreground/70 mb-4 leading-relaxed'>
							{product.description}
						</p>
					)}

					{/* Promotion text */}
					{product.promotion_text && (
						<div className='bg-primary/10 border border-primary/20 rounded-2xl px-4 py-3 mb-4'>
							<p className='text-sm text-primary font-medium'>
								{product.promotion_text}
							</p>
						</div>
					)}

					{/* Price */}
					<div className='flex items-baseline gap-3 mb-6'>
						<div className='text-3xl font-bold text-foreground'>
							{rub(product.price)}
						</div>
						{product.old_price && (
							<div className='text-lg text-foreground/40 line-through'>
								{rub(product.old_price)}
							</div>
						)}
					</div>

					{/* Buy button or "In Cart" button */}
					{!isInCart ? (
						<Button
							onClick={handleAddToCart}
							disabled={isLoading}
							className='w-full rounded-full bg-primary hover:bg-primary-hover text-white h-14 text-base font-semibold
                     shadow-[0_0_20px_rgba(33,188,96,0.3)]'
						>
							{isLoading ? (
								'Добавление...'
							) : (
								<>
									<ShoppingCart className='w-5 h-5 mr-2' />
									Купить
								</>
							)}
						</Button>
					) : (
						<Button
							onClick={handleGoToCart}
							className='w-full rounded-full bg-primary hover:bg-primary-hover text-white h-14 text-base font-semibold
                     shadow-[0_0_20px_rgba(33,188,96,0.3)]'
						>
							<Check className='w-5 h-5 mr-2' />
							Перейти в корзину
						</Button>
					)}

					{/* Stock info */}
					{product.stock_count > 0 && product.stock_count < 10 && (
						<p className='text-center text-sm text-foreground/50 mt-3'>
							Осталось {product.stock_count} шт.
						</p>
					)}

					{/* Reviews Section */}
					<div className='mt-6 border-t border-foreground/10 pt-6'>
						{/* Reviews Toggle Button */}
						<button
							onClick={() => setShowReviews(!showReviews)}
							className='w-full flex items-center justify-between p-4 bg-element-bg rounded-2xl hover:bg-element-bg/80 transition-colors'
						>
							<div className='flex items-center gap-3'>
								<Star className='w-5 h-5 text-yellow-500 fill-yellow-500' />
								<div className='text-left'>
									<div className='font-semibold text-foreground'>
										Отзывы
										{rating && rating.reviews_count > 0 && (
											<span className='ml-2 text-foreground/60'>
												({rating.reviews_count})
											</span>
										)}
									</div>
									{rating && rating.reviews_count > 0 && (
										<div className='text-sm text-foreground/60'>
											Средняя оценка: {rating.average_rating.toFixed(1)} ⭐
										</div>
									)}
								</div>
							</div>
							<svg
								className={cn(
									'w-5 h-5 text-foreground/60 transition-transform',
									showReviews && 'rotate-180'
								)}
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M19 9l-7 7-7-7'
								/>
							</svg>
						</button>

						{/* Reviews Content */}
						{showReviews && (
							<div className='mt-4'>
								<ProductReviews productId={product.id} />
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
