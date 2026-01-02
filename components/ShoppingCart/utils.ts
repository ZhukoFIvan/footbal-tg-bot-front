export const formatRub = (n: number) =>
	new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
