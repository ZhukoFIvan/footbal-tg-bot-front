'use client'

import {
	useGetAdminSiteSettingsQuery,
	useUpdateSiteSettingsMutation,
} from '@/app/store/api/settingsApi'
import Loader from '@/app/components/Loader/Loader'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import AdminHeader from '@/app/components/admin/shared/AdminHeader'

export default function AdminSettingsPage() {
	const { data: settings, isLoading, error } = useGetAdminSiteSettingsQuery()
	const [updateSettings, { isLoading: isUpdating }] =
		useUpdateSiteSettingsMutation()

	const handleToggleSnow = async (enabled: boolean) => {
		try {
			await updateSettings({ snow_enabled: enabled }).unwrap()
		} catch (err) {
			console.error('Failed to update settings:', err)
			alert('Не удалось обновить настройки')
		}
	}

	if (isLoading) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	if (error) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center p-4'>
				<div className='text-center'>
					<p className='text-destructive text-lg font-semibold mb-2'>
						Ошибка загрузки настроек
					</p>
					<p className='text-muted-foreground'>Попробуйте обновить страницу</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background pb-24'>
			<AdminHeader title='Настройки сайта' />

			{/* Content */}
			<div className='container mx-auto px-4 py-6 max-w-2xl'>
				<div className='bg-element-bg/60 backdrop-blur-xl rounded-2xl p-6 border border-white/5'>
					<div className='space-y-6'>
						{/* Снег */}
						<div className='flex items-center justify-between'>
							<div className='space-y-1'>
								<Label
									htmlFor='snow-toggle'
									className='text-lg font-semibold text-foreground'
								>
									Снег на сайте ❄️
								</Label>
								<p className='text-sm text-foreground/60'>
									Включить падающий снег для всех пользователей
								</p>
							</div>
							<Switch
								id='snow-toggle'
								checked={settings?.snow_enabled ?? false}
								onCheckedChange={handleToggleSnow}
								disabled={isUpdating}
								className='data-[state=checked]:bg-primary'
							/>
						</div>

						{isUpdating && (
							<div className='flex items-center gap-2 text-sm text-foreground/60'>
								<Loader />
								<span>Сохранение...</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
