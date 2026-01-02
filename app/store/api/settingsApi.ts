import { baseApi } from './baseApi'

// Типы для настроек сайта
interface SiteSettings {
	snow_enabled: boolean
}

export const settingsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Публичный endpoint - получение настроек сайта
		getSiteSettings: builder.query<SiteSettings, void>({
			query: () => '/settings',
			providesTags: ['SiteSettings'],
		}),

		// Админский endpoint - получение настроек
		getAdminSiteSettings: builder.query<SiteSettings, void>({
			query: () => '/admin/site-settings',
			providesTags: ['SiteSettings'],
		}),

		// Админский endpoint - обновление настроек
		updateSiteSettings: builder.mutation<
			SiteSettings,
			Partial<SiteSettings>
		>({
			query: (settings) => ({
				url: '/admin/site-settings',
				method: 'PATCH',
				body: settings,
			}),
			invalidatesTags: ['SiteSettings'],
		}),
	}),
})

// Экспортируем хуки для использования в компонентах
export const {
	useGetSiteSettingsQuery,
	useGetAdminSiteSettingsQuery,
	useUpdateSiteSettingsMutation,
} = settingsApi
