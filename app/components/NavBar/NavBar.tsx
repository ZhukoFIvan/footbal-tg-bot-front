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
			<div className='bg-element-bg backdrop-blur-xl rounded-full border border-white/20 shadow-2xl'>
				<ul className='flex items-center justify-center gap-7 px-6 py-3'>
					{navItems.map(({ href, icon: Icon, label }) => {
						const isActive = pathname === href
						return (
							<li key={href}>
								<Link
									href={href}
									className={cn(
										'flex items-center justify-center w-12 h-10 rounded-full transition-all duration-300',
										isActive
											? 'bg-[rgba(94,94,94,0.18)] scale-110'
											: 'hover:bg-element-bg/50'
									)}
									aria-label={label}
								>
									<Icon
										className={cn(
											'w-6 h-6 transition-all duration-300',
											isActive
												? 'text-primary [filter:drop-shadow(0_0_10px_rgba(33,188,96,0.5))_drop-shadow(0_0_20px_rgba(33,188,96,0.6))_drop-shadow(0_0_24px_rgba(33,188,96,0.8))]'
												: 'text-foreground/70 hover:text-primary'
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
