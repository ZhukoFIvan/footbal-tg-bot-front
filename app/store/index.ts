// Экспорт store и типов
export { store } from './store'
export type { RootState } from './store'

// Экспорт типизированных хуков
export { useAppDispatch, useAppSelector } from './hooks'

// Экспорт API
export { sectionsApi, useGetSectionsQuery } from './api/sectionsApi'

export {
	settingsApi,
	useGetSiteSettingsQuery,
	useGetAdminSiteSettingsQuery,
	useUpdateSiteSettingsMutation,
} from './api/settingsApi'
