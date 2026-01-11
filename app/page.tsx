'use client'

import SectionsList from './components/Sections/SectionsList'
import CategoriesList from './components/Categories/CategoriesList'
import MainScreenCategories from './components/MainScreenCategories/MainScreenCategories'
import Image from 'next/image'
import Link from 'next/link'
import { useAppSelector } from './store/hooks'
import { selectIsAdmin } from './store/slices/authSlice'
import { useGetSectionsQuery } from './store'
import { useGetCategoriesQuery } from './store/api/categoriesApi'
import { useGetMainScreenCategoriesQuery } from './store/api/categoriesApi'
import Loader from './components/Loader/Loader'
import { useEffect } from 'react'

export default function Home() {
	useEffect(() => {
		if (typeof window.Telegram === 'undefined') return
		const tg = window.Telegram.WebApp as any
		if (!tg) return
		tg.ready()
		tg.expand()

		// Отключаем вертикальные свайпы для закрытия приложения
		if (typeof tg.setSwipeBehavior === 'function') {
			tg.setSwipeBehavior({ allow_vertical_swipe: false })
		}

		tg.onEvent('viewportChanged', () => {
			if (!tg.isExpanded) {
				tg.expand()
			}
		})
	}, [])

	const isAdmin = useAppSelector(selectIsAdmin)

	// Получаем все данные сразу (без кеширования)
	const { isLoading: isSectionsLoading } = useGetSectionsQuery()
	const { isLoading: isCategoriesLoading } = useGetCategoriesQuery()
	const { isLoading: isMainCategoriesLoading } =
		useGetMainScreenCategoriesQuery({
			limit_per_category: 8,
		})

	// Показываем лоадер пока не загружены ВСЕ данные
	const isLoading =
		isSectionsLoading || isCategoriesLoading || isMainCategoriesLoading

	if (isLoading) {
		return (
			<div className='relative min-h-screen bg-background overflow-hidden flex items-center justify-center'>
				<div className='relative z-10'>
					<Loader />
				</div>
			</div>
		)
	}

	return (
		<div className='relative min-h-screen bg-background overflow-hidden pb-24'>
			<div className='absolute inset-0 pointer-events-none'>
				<Image
					src='/assets/lightning.svg'
					alt=''
					fill
					className='object-cover'
					priority
				/>
			</div>

			<main className='relative container mx-auto py-8'>
				<section className='mb-8'>
					<SectionsList />
				</section>
				<section className='mb-8'>
					<CategoriesList />
				</section>

				<section className='mb-8'>
					<MainScreenCategories />
				</section>

				<div className='flex flex-col items-center gap-3 px-4 pb-8'>
					<Link
						href='/user-agreement'
						className='text-foreground/50 text-sm hover:text-foreground/70 transition-colors'
					>
						Пользовательское соглашение
					</Link>

					{isAdmin && (
						<Link
							href='/admin'
							className='text-primary text-sm font-medium hover:text-primary-hover transition-colors flex items-center gap-2 mb-10'
						>
							<span>Перейти в админ панель</span>
						</Link>
					)}
				</div>
			</main>
		</div>
	)
}
