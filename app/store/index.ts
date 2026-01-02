// Экспорт store и типов
export { store } from './store'
export type { RootState, AppDispatch } from './store'

// Экспорт типизированных хуков
export { useAppDispatch, useAppSelector } from './hooks'

// Экспорт API
export { sectionsApi, useGetSectionsQuery } from './api/sectionsApi'
export type { Section } from './api/sectionsApi'

export { 
	settingsApi, 
	useGetSiteSettingsQuery, 
	useGetAdminSiteSettingsQuery,
	useUpdateSiteSettingsMutation 
} from './api/settingsApi'
export type { SiteSettings } from './api/settingsApi'

