'use client'

import { useGetCategoriesQuery } from '@/app/store/api/categoriesApi'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CategoryFilterProps {
	selectedCategoryId: number | null
	onCategoryChange: (categoryId: number | null) => void
}

export default function CategoryFilter({
	selectedCategoryId,
	onCategoryChange,
}: CategoryFilterProps) {
	const { data: categories, isLoading } = useGetCategoriesQuery()

	if (isLoading) {
		return (
			<div className='flex gap-2 overflow-hidden px-4 py-2'>
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className='h-10 w-24 rounded-full bg-element-bg animate-pulse shrink-0'
					/>
				))}
			</div>
		)
	}

	if (!categories || categories.length === 0) {
		return null
	}

	return (
		<div className='relative'>
			<div className='flex gap-2 overflow-x-scroll py-2 scrollbar-hide'>
				<Button
					onClick={() => onCategoryChange(null)}
					variant={selectedCategoryId === null ? 'default' : 'secondary'}
					className={cn(
						'rounded-full text-sm font-medium shrink-0 whitespace-nowrap h-9',
						selectedCategoryId === null
							? 'bg-primary text-white hover:bg-primary-hover '
							: 'bg-element-bg text-foreground/70 hover:text-foreground hover:bg-element-bg/80'
					)}
				>
					Все
				</Button>

				{categories.map((category) => (
					<Button
						key={category.id}
						onClick={() => onCategoryChange(category.id)}
						variant={
							selectedCategoryId === category.id ? 'default' : 'secondary'
						}
						className={cn(
							'rounded-full text-sm font-medium shrink-0 whitespace-nowrap h-9',
							selectedCategoryId === category.id
								? 'bg-primary text-white hover:bg-primary-hover'
								: 'bg-element-bg text-foreground/70 hover:text-foreground hover:bg-element-bg/80'
						)}
					>
						{category.title}
					</Button>
				))}
			</div>

			{/* Градиенты по краям для эффекта fade */}
			<div className='absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-background to-transparent pointer-events-none' />
			<div className='absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-background to-transparent pointer-events-none' />
		</div>
	)
}
