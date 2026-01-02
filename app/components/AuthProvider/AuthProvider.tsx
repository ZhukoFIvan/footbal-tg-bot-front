'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
	restoreAuth,
	setAuth,
	selectIsAuthenticated,
	selectIsTestMode,
} from '@/app/store/slices/authSlice'
import { useTelegramAuthMutation } from '@/app/store/api/authApi'

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const dispatch = useAppDispatch()
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	const isTestMode = useAppSelector(selectIsTestMode)
	const [telegramAuth] = useTelegramAuthMutation()

	const handleTelegramAuth = async () => {
		try {
			// Проверяем наличие Telegram WebApp
			if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
				console.log('Telegram WebApp not available')
				return
			}

			const initData = window.Telegram.WebApp.initData

			// Если нет initData - используем тестовый режим
			if (!initData) {
				console.log('No initData, staying in test mode')
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
				console.log('✅ Authorized successfully')
				console.log('✅ Admin status saved:', response.is_admin)
			}
		} catch (error) {
			console.error('Authorization error:', error)
		}
	}

	useEffect(() => {
		dispatch(restoreAuth())

		if (!isAuthenticated && !isTestMode) {
			handleTelegramAuth()
		}
	}, [])

	return <>{children}</>
}
