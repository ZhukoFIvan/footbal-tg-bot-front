'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ReactNode } from 'react'

interface AdminHeaderProps {
	title: string
	actions?: ReactNode
}

export default function AdminHeader({ title, actions }: AdminHeaderProps) {
	const router = useRouter()

	return (
		<div className='sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5'>
			<div className='container mx-auto px-4 py-4 flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<Button
						onClick={() => router.push('/admin')}
						variant='ghost'
						size='icon'
					>
						<ArrowLeft className='w-5 h-5' />
					</Button>
					<h1 className='text-2xl font-bold text-foreground'>{title}</h1>
				</div>
				{actions && <div>{actions}</div>}
			</div>
		</div>
	)
}
