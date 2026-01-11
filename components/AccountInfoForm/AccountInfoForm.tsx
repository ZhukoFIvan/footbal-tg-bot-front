'use client'

export interface AccountFormData {
	account_type: 'EA' | 'Facebook' | 'Google'
	account_email: string
	account_password: string
	account_name: string
}

interface AccountInfoFormProps {
	value: AccountFormData
	onChange: (data: AccountFormData) => void
	errors?: {
		account_type?: string
		account_email?: string
		account_password?: string
		account_name?: string
	}
}

export function AccountInfoForm({
	value,
	onChange,
	errors,
}: AccountInfoFormProps) {
	const accountTypes = [
		{ value: 'EA', label: 'EA (Electronic Arts)' },
		{ value: 'Facebook', label: 'Facebook' },
		{ value: 'Google', label: 'Google' },
	] as const

	const handleChange = (field: keyof AccountFormData, val: string) => {
		onChange({ ...value, [field]: val })
	}

	const getEmailLabel = () => {
		if (value.account_type === 'Facebook') {
			return 'Email или телефон'
		}
		return 'Email'
	}

	const isPasswordNeeded =
		value.account_type === 'Facebook' || value.account_type === 'Google'

	return (
		<div className='bg-element-bg rounded-2xl p-4 space-y-4'>
			<h3 className='text-lg font-semibold text-foreground mb-2'>
				Данные игрового аккаунта
			</h3>
			<p className='text-sm text-foreground/60 mb-4'>
				Укажите данные аккаунта для получения игрового ключа
			</p>

			{/* Account Type Select */}
			<div>
				<label className='text-sm font-medium text-foreground mb-2 block'>
					Тип аккаунта <span className='text-destructive'>*</span>
				</label>
				<select
					value={value.account_type}
					onChange={(e) =>
						handleChange(
							'account_type',
							e.target.value as 'EA' | 'Facebook' | 'Google'
						)
					}
					className={`w-full bg-background border ${
						errors?.account_type ? 'border-destructive' : 'border-white/10'
					} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
				>
					{accountTypes.map((type) => (
						<option key={type.value} value={type.value}>
							{type.label}
						</option>
					))}
				</select>
				{errors?.account_type && (
					<p className='text-destructive text-xs mt-1'>{errors.account_type}</p>
				)}
			</div>

			{/* Email/Phone Field */}
			<div>
				<label className='text-sm font-medium text-foreground mb-2 block'>
					{getEmailLabel()} <span className='text-destructive'>*</span>
				</label>
				<input
					type='text'
					placeholder={
						value.account_type === 'Facebook'
							? 'email@example.com или +7999...'
							: 'email@example.com'
					}
					value={value.account_email}
					onChange={(e) => handleChange('account_email', e.target.value)}
					className={`w-full bg-background border ${
						errors?.account_email ? 'border-destructive' : 'border-white/10'
					} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
				/>
				{errors?.account_email && (
					<p className='text-destructive text-xs mt-1'>
						{errors.account_email}
					</p>
				)}
			</div>

			{/* Password Field */}
			{isPasswordNeeded && (
				<div>
					<label className='text-sm font-medium text-foreground mb-2 block'>
						Пароль<span className='text-destructive'>*</span>
					</label>
					<input
						type='password'
						placeholder='Введите пароль'
						value={value.account_password}
						onChange={(e) => handleChange('account_password', e.target.value)}
						className={`w-full bg-background border ${
							errors?.account_password
								? 'border-destructive'
								: 'border-white/10'
						} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
					/>
					{errors?.account_password && (
						<p className='text-destructive text-xs mt-1'>
							{errors.account_password}
						</p>
					)}
				</div>
			)}

			{/* Account Name Field */}
			<div>
				<label className='text-sm font-medium text-foreground mb-2 block'>
					Имя аккаунта <span className='text-destructive'>*</span>
				</label>
				<input
					type='text'
					placeholder='Например: MyGameAccount'
					value={value.account_name}
					onChange={(e) => handleChange('account_name', e.target.value)}
					className={`w-full bg-background border ${
						errors?.account_name ? 'border-destructive' : 'border-white/10'
					} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
				/>
				{errors?.account_name && (
					<p className='text-destructive text-xs mt-1'>{errors.account_name}</p>
				)}
			</div>
		</div>
	)
}
