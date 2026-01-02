'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
	restoreAuth,
	setAuth,
	selectIsAuthenticated,
} from '@/app/store/slices/authSlice'
import { useTelegramAuthMutation } from '@/app/store/api/authApi'

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const dispatch = useAppDispatch()
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	const [telegramAuth] = useTelegramAuthMutation()

	const handleTelegramAuth = async () => {
		try {
			if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
				return
			}

			const initData = window.Telegram.WebApp.initData

			if (!initData) {
				return
			}

			const response = await telegramAuth({ initData }).unwrap()

			if (response.ok) {
				dispatch(
					setAuth({
						token: response.access_token,
						userId: response.user_id,
						telegramId: response.telegram_id,
						isAdmin: response.is_admin,
					})
				)
			}
		} catch {
		}
	}

	useEffect(() => {
		dispatch(restoreAuth())

		if (!isAuthenticated) {
			handleTelegramAuth()
		}
	}, [])

	return <>{children}</>
}
