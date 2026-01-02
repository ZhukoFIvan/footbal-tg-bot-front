import { useGetCartQuery } from '@/app/store/api/serverCartApi'
import { formatRub } from '../utils'
import { FC, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface BonusBlockProps {
	bonusToUse: number
	setBonusToUse: (bonusToUse: number) => void
}

export const BonusBlock: FC<BonusBlockProps> = ({
	bonusToUse,
	setBonusToUse,
}) => {
	const { data: serverCart } = useGetCartQuery(undefined)
	const [inputValue, setInputValue] = useState(bonusToUse.toString())

	const maxBonus = Math.min(
		serverCart?.bonus_balance || 0,
		serverCart?.max_bonus_usage || 0
	)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		// Разрешаем только цифры
		if (value === '' || /^\d+$/.test(value)) {
			setInputValue(value)
		}
	}

	const handleApplyBonus = () => {
		const value = parseInt(inputValue) || 0
		const validValue = Math.min(Math.max(0, value), maxBonus)
		setBonusToUse(validValue)
		setInputValue(validValue.toString())
	}

	const handleUseMax = () => {
		setBonusToUse(maxBonus)
		setInputValue(maxBonus.toString())
	}

	const handleClear = () => {
		setBonusToUse(0)
		setInputValue('0')
	}

	return (
		<div className='bg-element-bg rounded-2xl p-4 mb-4'>
			<h3 className='text-foreground font-semibold mb-3'>Бонусы</h3>
			<div className='space-y-2 text-sm mb-4'>
				<div className='flex justify-between'>
					<span className='text-foreground/70'>Доступно бонусов:</span>
					<span className='text-primary font-semibold'>
						{formatRub(serverCart?.bonus_balance || 0)}
					</span>
				</div>
				<div className='flex justify-between'>
					<span className='text-foreground/70'>Можно использовать:</span>
					<span className='text-foreground'>{formatRub(maxBonus)}</span>
				</div>
				<div className='flex justify-between'>
					<span className='text-foreground/70'>Будет начислено:</span>
					<span className='text-primary'>
						+{formatRub(serverCart?.bonus_will_earn || 0)}
					</span>
				</div>
			</div>

			{maxBonus > 0 && (
				<div className='space-y-2'>
					<div className='flex gap-2'>
						<Input
							type='text'
							inputMode='numeric'
							placeholder='0'
							value={inputValue}
							onChange={handleInputChange}
							className='flex-1 bg-background! rounded-xl px-3 py-3 text-white placeholder:text-white/50 outline-none border border-white/10 focus:border-primary transition-colors'
						/>
						<Button
							onClick={handleApplyBonus}
							disabled={inputValue === bonusToUse.toString()}
							className='px-6 rounded-xl bg-primary hover:bg-primary-hover'
						>
							Применить
						</Button>
					</div>
					<div className='flex gap-2'>
						<Button
							onClick={handleUseMax}
							variant='outline'
							size='sm'
							className='flex-1 rounded-xl border-white/10 text-xs'
						>
							Использовать максимум ({formatRub(maxBonus)})
						</Button>
						{bonusToUse > 0 && (
							<Button
								onClick={handleClear}
								variant='outline'
								size='sm'
								className='rounded-xl border-white/10 text-xs hover:border-destructive hover:text-destructive'
							>
								Очистить
							</Button>
						)}
					</div>
					{bonusToUse > 0 && (
						<div className='mt-3 p-3 bg-primary/10 rounded-xl border border-primary/20'>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-foreground/70'>
									Будет списано:
								</span>
								<span className='text-lg font-bold text-primary'>
									-{formatRub(bonusToUse)}
								</span>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
