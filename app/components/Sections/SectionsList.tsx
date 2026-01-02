'use client'

import { useGetSectionsQuery } from '@/app/store/api/sectionsApi'
import Section from './Section'
import { useRouter } from 'next/navigation'

export default function SectionsList() {
	const router = useRouter()
	const { data: sections, error } = useGetSectionsQuery()

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-[400px] p-4'>
				<div className='text-center'>
					<p className='text-destructive text-lg font-semibold mb-2'>
						Ошибка загрузки секций
					</p>
					<p className='text-muted-foreground'>Попробуйте обновить страницу</p>
				</div>
			</div>
		)
	}

	if (!sections || sections.length === 0) {
		return (
			<div className='flex items-center justify-center min-h-[400px] p-4'>
				<p className='text-muted-foreground text-lg'>Секции не найдены</p>
			</div>
		)
	}

	const handleSectionClick = (section: any) => {
		router.push(`/catalog?section_id=${section.id}`)
	}

	const [firstSection, ...restSections] = sections

	return (
		<div className='flex flex-col gap-2 p-4'>
			{firstSection && (
				<Section
					key={firstSection.id}
					section={firstSection}
					onClick={() => handleSectionClick(firstSection)}
				/>
			)}

			{restSections.length > 0 && (
				<div className='grid grid-cols-2 gap-2'>
					{restSections.map((section) => (
						<Section
							key={section.id}
							section={section}
							onClick={() => handleSectionClick(section)}
						/>
					))}
				</div>
			)}
		</div>
	)
}
