'use client'

import { ReactNode } from 'react'

interface AdminLayoutProps {
	children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
	// Просто оборачиваем children без изменений
	// Каждая страница сама управляет своим header
	return <>{children}</>
}
