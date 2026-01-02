import { useRouter } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const EmptyCart = () => {
	const router = useRouter()

	return (
		<div className='container mx-auto px-4 py-12 text-center'>
			<div className='max-w-md mx-auto'>
				<div className='w-24 h-24 bg-element-bg rounded-full flex items-center justify-center mx-auto mb-6'>
					<ShoppingBag className='w-12 h-12 text-foreground/50' />
				</div>
				<h2 className='text-2xl font-bold text-foreground mb-2'>
					В корзине пока пусто
				</h2>
				<p className='text-foreground/70 mb-6'>
					Загляните{' '}
					<Link href='/catalog' className='text-primary hover:underline'>
						на главную
					</Link>{' '}
					— соберите там товары, которые могут вам понравиться
				</p>
				<Button
					onClick={() => router.push('/catalog')}
					className='bg-primary hover:bg-primary-hover text-white px-8'
				>
					К товарам
				</Button>
			</div>
		</div>
	)
}
