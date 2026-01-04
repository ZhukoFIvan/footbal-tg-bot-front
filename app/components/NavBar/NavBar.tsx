'use client'
import { cn } from '@/lib/utils'
import { House, List, ShoppingCart, Star } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
	const pathname = usePathname()
	const isAdminPage = pathname.includes('/admin')

	const navItems = [
		{ href: '/', icon: House, label: 'Главная' },
		{ href: '/catalog', icon: List, label: 'Каталог' },
		{ href: '/bonus', icon: Star, label: 'Бонусы' },
		{ href: '/cart', icon: ShoppingCart, label: 'Корзина' },
	]

	if (isAdminPage) {
		return null
	}

	return (
		<nav className='fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[300px] h-[65px]'>
			{/* iOS/Telegram-style ultra-transparent glass */}
			<div className='relative overflow-hidden rounded-full isolate'>
				{/* Subtle animated gradient */}
				<div
					className='absolute inset-0 rounded-full -z-10 animate-[liquidFlow_20s_ease-in-out_infinite] opacity-50 bg-[length:400%_400%]'
					style={{
						backgroundImage:
							'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 25%, rgba(33,188,96,0.02) 50%, rgba(255,255,255,0.01) 75%, rgba(255,255,255,0.02) 100%)',
					}}
				/>

				{/* Ultra-transparent glass blur layer - iOS style */}
				<div className='absolute inset-0 bg-black/10 backdrop-blur-[40px] backdrop-saturate-180 rounded-full -z-10' />

				{/* Subtle border */}
				<div className='absolute inset-0 rounded-full border border-white/10 pointer-events-none' />

				{/* Very subtle glow */}
				<div className='absolute inset-0 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.15),0_0_0_0.5px_rgba(255,255,255,0.06)_inset] pointer-events-none' />

				<ul className='flex items-center justify-center gap-7 px-6 py-3 relative z-10'>
					{navItems.map(({ href, icon: Icon, label }) => {
						const isActive = pathname === href
						return (
							<li key={href}>
								<Link
									href={href}
									className={cn(
										'relative flex items-center justify-center w-12 h-10 rounded-full transition-all duration-300 overflow-hidden group',
										'before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-500',
										isActive
											? 'bg-white/10 scale-110 before:bg-[radial-gradient(circle_at_center,rgba(33,188,96,0.15)_0%,rgba(33,188,96,0.05)_40%,transparent_70%)] before:animate-[ripple_3s_ease-in-out_infinite]'
											: 'hover:bg-white/[0.06] hover:scale-105 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full group-hover:before:translate-x-full'
									)}
									aria-label={label}
								>
									<Icon
										className={cn(
											'w-6 h-6 transition-all duration-300 relative z-10',
											isActive
												? 'text-primary animate-[pulseGlow_2s_ease-in-out_infinite] [filter:drop-shadow(0_0_8px_rgba(33,188,96,0.4))_drop-shadow(0_0_16px_rgba(33,188,96,0.5))]'
												: 'text-foreground/80 group-hover:text-primary'
										)}
										strokeWidth={2.5}
									/>
								</Link>
							</li>
						)
					})}
				</ul>
			</div>
		</nav>
	)
}
