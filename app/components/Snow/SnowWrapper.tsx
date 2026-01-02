'use client'

import { useGetSiteSettingsQuery } from '@/app/store/api/settingsApi'
import Snow from './Snow'

export default function SnowWrapper() {
	const { data: settings } = useGetSiteSettingsQuery()

	// Если настройки не загружены или снег выключен - не показываем
	if (!settings?.snow_enabled) {
		return null
	}

	return <Snow />
}
