import { z } from 'zod'

// ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ВАЛИДАЦИИ ============

// Валидация slug (только латиница, цифры, дефисы)
export const validateSlug = (slug: string): boolean => {
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

// Валидация HEX цвета
export const validateHexColor = (color: string): boolean => {
	return /^#[0-9A-F]{6}$/i.test(color)
}

// ============ СХЕМЫ ВАЛИДАЦИИ ============

// Секции (Sections)
export const sectionCreateSchema = z.object({
	name: z
		.string()
		.min(1, 'Название обязательно')
		.max(255, 'Название не должно превышать 255 символов'),
	route: z
		.string()
		.max(255, 'Route не должен превышать 255 символов')
		.optional()
		.nullable(),
	rest_time: z
		.number()
		.int('Rest time должно быть целым числом')
		.positive('Rest time должно быть положительным')
		.optional()
		.nullable(),
	sort_order: z
		.number()
		.int('Порядок сортировки должен быть целым числом')
		.optional()
		.default(0),
	is_active: z.boolean().optional().default(true),
})

export const sectionUpdateSchema = z.object({
	name: z
		.string()
		.min(1, 'Название обязательно')
		.max(255, 'Название не должно превышать 255 символов')
		.optional(),
	route: z
		.string()
		.max(255, 'Route не должен превышать 255 символов')
		.optional()
		.nullable(),
	rest_time: z
		.number()
		.int('Rest time должно быть целым числом')
		.positive('Rest time должно быть положительным')
		.optional()
		.nullable(),
	sort_order: z
		.number()
		.int('Порядок сортировки должен быть целым числом')
		.optional(),
	is_active: z.boolean().optional(),
})

// Категории (Categories)
export const categoryCreateSchema = z.object({
	title: z
		.string()
		.min(1, 'Название обязательно')
		.max(255, 'Название не должно превышать 255 символов'),
	slug: z
		.string()
		.min(1, 'Slug обязателен')
		.max(255, 'Slug не должен превышать 255 символов')
		.refine(validateSlug, {
			message:
				'Slug должен содержать только латинские буквы, цифры и дефисы (например: action-games)',
		}),
	description: z
		.string()
		.max(1000, 'Описание не должно превышать 1000 символов')
		.optional()
		.nullable(),
	sort_order: z
		.number()
		.int('Порядок сортировки должен быть целым числом')
		.optional()
		.default(0),
	show_on_main: z.boolean().optional().default(false),
	is_active: z.boolean().optional().default(true),
})

export const categoryUpdateSchema = z.object({
	title: z
		.string()
		.min(1, 'Название обязательно')
		.max(255, 'Название не должно превышать 255 символов')
		.optional(),
	slug: z
		.string()
		.min(1, 'Slug обязателен')
		.max(255, 'Slug не должен превышать 255 символов')
		.refine(validateSlug, {
			message:
				'Slug должен содержать только латинские буквы, цифры и дефисы (например: action-games)',
		})
		.optional(),
	description: z
		.string()
		.max(1000, 'Описание не должно превышать 1000 символов')
		.optional()
		.nullable(),
	sort_order: z
		.number()
		.int('Порядок сортировки должен быть целым числом')
		.optional(),
	show_on_main: z.boolean().optional(),
	is_active: z.boolean().optional(),
})

// Товары (Products)
export const productCreateSchema = z.object({
	category_id: z
		.number()
		.int('ID категории должен быть целым числом')
		.positive('ID категории должен быть положительным'),
	title: z
		.string()
		.min(1, 'Название обязательно')
		.max(255, 'Название не должно превышать 255 символов'),
	slug: z
		.string()
		.min(1, 'Slug обязателен')
		.max(255, 'Slug не должен превышать 255 символов')
		.refine(validateSlug, {
			message: 'Slug должен содержать только латинские буквы, цифры и дефисы',
		}),
	price: z.number().nonnegative('Цена должна быть >= 0'),
	section_id: z
		.number()
		.int('ID секции должен быть целым числом')
		.positive('ID секции должен быть положительным')
		.optional()
		.nullable(),
	badge_id: z
		.number()
		.int('ID бейджа должен быть целым числом')
		.positive('ID бейджа должен быть положительным')
		.optional()
		.nullable(),
	description: z
		.string()
		.max(5000, 'Описание не должно превышать 5000 символов')
		.optional()
		.nullable(),
	old_price: z
		.number()
		.nonnegative('Старая цена должна быть >= 0')
		.optional()
		.nullable(),
	promotion_text: z
		.string()
		.max(255, 'Текст акции не должен превышать 255 символов')
		.optional()
		.nullable(),
	currency: z
		.string()
		.max(10, 'Валюта не должна превышать 10 символов')
		.optional()
		.default('RUB'),
	stock_count: z
		.number()
		.int('Количество на складе должно быть целым числом')
		.nonnegative('Количество на складе должно быть >= 0')
		.optional()
		.default(0),
	is_active: z.boolean().optional().default(true),
})

export const productUpdateSchema = z.object({
	category_id: z
		.number()
		.int('ID категории должен быть целым числом')
		.positive('ID категории должен быть положительным')
		.optional(),
	section_id: z
		.number()
		.int('ID секции должен быть целым числом')
		.positive('ID секции должен быть положительным')
		.optional()
		.nullable(),
	badge_id: z
		.number()
		.int('ID бейджа должен быть целым числом')
		.positive('ID бейджа должен быть положительным')
		.optional()
		.nullable(),
	title: z
		.string()
		.min(1, 'Название обязательно')
		.max(255, 'Название не должно превышать 255 символов')
		.optional(),
	slug: z
		.string()
		.min(1, 'Slug обязателен')
		.max(255, 'Slug не должен превышать 255 символов')
		.refine(validateSlug, {
			message: 'Slug должен содержать только латинские буквы, цифры и дефисы',
		})
		.optional(),
	description: z
		.string()
		.max(5000, 'Описание не должно превышать 5000 символов')
		.optional()
		.nullable(),
	price: z.number().nonnegative('Цена должна быть >= 0').optional(),
	old_price: z
		.number()
		.nonnegative('Старая цена должна быть >= 0')
		.optional()
		.nullable(),
	promotion_text: z
		.string()
		.max(255, 'Текст акции не должен превышать 255 символов')
		.optional()
		.nullable(),
	currency: z
		.string()
		.max(10, 'Валюта не должна превышать 10 символов')
		.optional(),
	stock_count: z
		.number()
		.int('Количество на складе должно быть целым числом')
		.nonnegative('Количество на складе должно быть >= 0')
		.optional(),
	is_active: z.boolean().optional(),
})

// Бейджи (Badges)
export const badgeCreateSchema = z.object({
	title: z
		.string()
		.min(1, 'Название обязательно')
		.max(100, 'Название не должно превышать 100 символов'),
	color: z
		.string()
		.refine(validateHexColor, {
			message: 'Цвет должен быть в формате HEX (например: #FF5722)',
		})
		.optional()
		.default('#FF5722'),
	text_color: z
		.string()
		.refine(validateHexColor, {
			message: 'Цвет текста должен быть в формате HEX (например: #FFFFFF)',
		})
		.optional()
		.default('#FFFFFF'),
	is_active: z.boolean().optional().default(true),
})

export const badgeUpdateSchema = z.object({
	title: z
		.string()
		.min(1, 'Название обязательно')
		.max(100, 'Название не должно превышать 100 символов')
		.optional(),
	color: z
		.string()
		.refine(validateHexColor, {
			message: 'Цвет должен быть в формате HEX (например: #FF5722)',
		})
		.optional(),
	text_color: z
		.string()
		.refine(validateHexColor, {
			message: 'Цвет текста должен быть в формате HEX (например: #FFFFFF)',
		})
		.optional(),
	is_active: z.boolean().optional(),
})

// Баннеры (Banners)
export const bannerCreateSchema = z.object({
	title: z
		.string()
		.min(1, 'Название обязательно')
		.max(255, 'Название не должно превышать 255 символов'),
	description: z
		.string()
		.max(1000, 'Описание не должно превышать 1000 символов')
		.optional()
		.nullable(),
	link: z
		.string()
		.max(500, 'Ссылка не должна превышать 500 символов')
		.optional()
		.nullable(),
	sort_order: z
		.number()
		.int('Порядок сортировки должен быть целым числом')
		.optional()
		.default(0),
	is_active: z.boolean().optional().default(true),
})

export const bannerUpdateSchema = z.object({
	title: z
		.string()
		.min(1, 'Название обязательно')
		.max(255, 'Название не должно превышать 255 символов')
		.optional(),
	description: z
		.string()
		.max(1000, 'Описание не должно превышать 1000 символов')
		.optional()
		.nullable(),
	link: z
		.string()
		.max(500, 'Ссылка не должна превышать 500 символов')
		.optional()
		.nullable(),
	sort_order: z
		.number()
		.int('Порядок сортировки должен быть целым числом')
		.optional(),
	is_active: z.boolean().optional(),
})

// Бонусы (Bonus)
export const bonusAddSchema = z.object({
	user_id: z
		.number()
		.int('ID пользователя должен быть целым числом')
		.positive('ID пользователя должен быть положительным'),
	amount: z.number().positive('Сумма должна быть положительной'),
	description: z
		.string()
		.min(1, 'Описание обязательно')
		.max(500, 'Описание не должно превышать 500 символов'),
})

export const bonusSubtractSchema = z.object({
	user_id: z
		.number()
		.int('ID пользователя должен быть целым числом')
		.positive('ID пользователя должен быть положительным'),
	amount: z.number().positive('Сумма должна быть положительной'),
	description: z
		.string()
		.min(1, 'Описание обязательно')
		.max(500, 'Описание не должно превышать 500 символов'),
})

export const bonusSetBalanceSchema = z.object({
	user_id: z
		.number()
		.int('ID пользователя должен быть целым числом')
		.positive('ID пользователя должен быть положительным'),
	new_balance: z.number().nonnegative('Новый баланс должен быть >= 0'),
	description: z
		.string()
		.max(500, 'Описание не должно превышать 500 символов')
		.optional()
		.nullable(),
})

// ============ ТИПЫ ДЛЯ TYPESCRIPT ============

export type SectionCreateInput = z.infer<typeof sectionCreateSchema>
export type SectionUpdateInput = z.infer<typeof sectionUpdateSchema>

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>

export type ProductCreateInput = z.infer<typeof productCreateSchema>
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>

export type BadgeCreateInput = z.infer<typeof badgeCreateSchema>
export type BadgeUpdateInput = z.infer<typeof badgeUpdateSchema>

export type BannerCreateInput = z.infer<typeof bannerCreateSchema>
export type BannerUpdateInput = z.infer<typeof bannerUpdateSchema>

export type BonusAddInput = z.infer<typeof bonusAddSchema>
export type BonusSubtractInput = z.infer<typeof bonusSubtractSchema>
export type BonusSetBalanceInput = z.infer<typeof bonusSetBalanceSchema>
