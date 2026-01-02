'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	useGetAdminBonusUsersQuery,
	useGetAdminBonusTransactionsQuery,
	useAddBonusMutation,
	useSubtractBonusMutation,
	useSetBalanceMutation,
} from '@/app/store/api/adminApi'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Minus, Edit, Search } from 'lucide-react'
import Loader from '@/app/components/Loader/Loader'
import { BonusForm } from '@/app/components/admin/forms/BonusForm'
import {
	BonusAddInput,
	BonusSubtractInput,
	BonusSetBalanceInput,
} from '@/app/components/admin/forms/schemas/validationSchemas'

export default function AdminBonusPage() {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState<'users' | 'transactions'>('users')
	const [search, setSearch] = useState('')

	const { data: users, isLoading: usersLoading } = useGetAdminBonusUsersQuery(
		{}
	)
	const { data: transactions, isLoading: transactionsLoading } =
		useGetAdminBonusTransactionsQuery({})

	const [addBonus] = useAddBonusMutation()
	const [subtractBonus] = useSubtractBonusMutation()
	const [setBalance] = useSetBalanceMutation()

	const [modalOpen, setModalOpen] = useState(false)
	const [modalType, setModalType] = useState<'add' | 'subtract' | 'set'>('add')
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
		}).format(amount)
	}

	const handleOpenModal = (
		userId: number,
		type: 'add' | 'subtract' | 'set'
	) => {
		setSelectedUserId(userId)
		setModalType(type)
		setModalOpen(true)
	}

	const handleSubmit = async (
		data: BonusAddInput | BonusSubtractInput | BonusSetBalanceInput
	) => {
		try {
			if (modalType === 'add') {
				await addBonus(data as BonusAddInput).unwrap()
			} else if (modalType === 'subtract') {
				await subtractBonus(data as BonusSubtractInput).unwrap()
			} else {
				const setBalanceData = data as BonusSetBalanceInput
				await setBalance({
					user_id: setBalanceData.user_id,
					balance: setBalanceData.new_balance,
					description: setBalanceData.description as string | undefined,
				}).unwrap()
			}

			setModalOpen(false)
		} catch (err) {
			console.error('Error managing bonus:', err)
			alert('Ошибка при управлении бонусами')
		}
	}

	const filteredUsers = users?.filter(
		(user) =>
			user.telegram_id.toString().includes(search) ||
			user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
			user.username?.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<div className='min-h-screen bg-background pb-24'>
			{/* Header */}
			<div className='sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5'>
				<div className='container mx-auto px-4 py-4'>
					<div className='flex items-center justify-between mb-4'>
						<div className='flex items-center gap-3'>
							<Button
								onClick={() => router.push('/admin')}
								variant='ghost'
								size='icon'
							>
								<ArrowLeft className='w-5 h-5' />
							</Button>
							<h1 className='text-2xl font-bold text-foreground'>Бонусы</h1>
						</div>
					</div>

					{/* Tabs */}
					<div className='flex gap-2'>
						<button
							onClick={() => setActiveTab('users')}
							className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
								activeTab === 'users'
									? 'bg-primary text-white'
									: 'bg-element-bg text-foreground/50'
							}`}
						>
							Пользователи
						</button>
						<button
							onClick={() => setActiveTab('transactions')}
							className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
								activeTab === 'transactions'
									? 'bg-primary text-white'
									: 'bg-element-bg text-foreground/50'
							}`}
						>
							Транзакции
						</button>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className='container mx-auto px-4 py-6'>
				{activeTab === 'users' && (
					<>
						{/* Search */}
						<div className='mb-4 relative'>
							<Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50' />
							<input
								type='text'
								placeholder='Поиск по ID, имени, username...'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className='w-full bg-element-bg border border-white/10 rounded-xl pl-12 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
							/>
						</div>

						{usersLoading ? (
							<Loader />
						) : filteredUsers && filteredUsers.length > 0 ? (
							<div className='space-y-3'>
								{filteredUsers.map((user) => (
									<div
										key={user.user_id}
										className='bg-element-bg rounded-2xl p-4'
									>
										<div className='flex items-start justify-between mb-3'>
											<div className='flex-1'>
												<h3 className='text-foreground font-medium'>
													{user.first_name || `User ${user.telegram_id}`}
												</h3>
												{user.username && (
													<p className='text-sm text-foreground/50'>
														@{user.username}
													</p>
												)}
												<p className='text-xs text-foreground/40'>
													TG ID: {user.telegram_id}
												</p>
											</div>
											<div className='text-right'>
												<p className='text-2xl font-bold text-primary'>
													{formatCurrency(user.bonus_balance)}
												</p>
											</div>
										</div>

										<div className='grid grid-cols-2 gap-3 text-sm text-foreground/50 mb-3'>
											<div>
												<p>Заказов: {user.total_orders}</p>
												<p>Потрачено: {formatCurrency(user.total_spent)}</p>
											</div>
										</div>

										<div className='flex gap-2'>
											<Button
												onClick={() => handleOpenModal(user.user_id, 'add')}
												variant='outline'
												size='sm'
												className='flex-1'
											>
												<Plus className='w-4 h-4 mr-1' />
												Начислить
											</Button>
											<Button
												onClick={() =>
													handleOpenModal(user.user_id, 'subtract')
												}
												variant='outline'
												size='sm'
												className='flex-1'
											>
												<Minus className='w-4 h-4 mr-1' />
												Списать
											</Button>
											<Button
												onClick={() => handleOpenModal(user.user_id, 'set')}
												variant='outline'
												size='sm'
											>
												<Edit className='w-4 h-4' />
											</Button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='text-center py-12'>
								<p className='text-foreground/50'>Пользователи не найдены</p>
							</div>
						)}
					</>
				)}

				{activeTab === 'transactions' && (
					<>
						{transactionsLoading ? (
							<Loader />
						) : transactions && transactions.length > 0 ? (
							<div className='space-y-3'>
								{transactions.map((tx) => (
									<div key={tx.id} className='bg-element-bg rounded-2xl p-4'>
										<div className='flex items-start justify-between mb-2'>
											<div className='flex-1'>
												<h3 className='text-foreground font-medium'>
													{tx.first_name || `User ${tx.telegram_id}`}
												</h3>
												{tx.username && (
													<p className='text-xs text-foreground/50'>
														@{tx.username}
													</p>
												)}
											</div>
											<div className='text-right'>
												<p
													className={`text-xl font-bold ${
														tx.amount > 0 ? 'text-primary' : 'text-destructive'
													}`}
												>
													{tx.amount > 0 ? '+' : ''}
													{formatCurrency(tx.amount)}
												</p>
											</div>
										</div>
										<div className='space-y-1'>
											<p className='text-sm text-foreground/70'>
												{tx.description}
											</p>
											<p className='text-xs text-foreground/40'>
												{new Date(tx.created_at).toLocaleString('ru-RU')}
											</p>
											<p className='text-xs text-foreground/40'>
												Тип: {tx.type}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='text-center py-12'>
								<p className='text-foreground/50'>Транзакции не найдены</p>
							</div>
						)}
					</>
				)}
			</div>

			{/* Modal */}
			{modalOpen && selectedUserId && (
				<div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
					<div className='bg-element-bg rounded-2xl p-6 max-w-md w-full'>
						<BonusForm
							mode={modalType}
							userId={selectedUserId}
							onSubmit={handleSubmit}
							isSubmitting={false}
							onCancel={() => setModalOpen(false)}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
