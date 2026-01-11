declare global {
	interface Window {
		Telegram?: {
			WebApp: {
				initData: string
				initDataUnsafe: unknown
				version: string
				platform: string
				colorScheme: 'light' | 'dark'
				themeParams: Record<string, string>
				isExpanded: boolean
				viewportHeight: number
				viewportStableHeight: number
				headerColor: string
				backgroundColor: string
				isClosingConfirmationEnabled: boolean
				BackButton: unknown
				MainButton: unknown
				ready: () => void
				expand: () => void
				close: () => void
				openTelegramLink: (url: string) => void
			}
		}
	}
}

export {}
