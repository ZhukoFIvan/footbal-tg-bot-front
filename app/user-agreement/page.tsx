'use client'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const isNoonyashop = process.env.NEXT_PUBLIC_IS_NOONYASHOP === 'true'
const storeName = isNoonyashop ? 'NOONYA SHOP' : 'ROMIXSTORE'
const workingHours = isNoonyashop ? 'с 7:00 до 23:59' : 'с 10:00 до 23:59'
const supportLink = isNoonyashop
	? 'https://t.me/noonyashop_support'
	: 'https://t.me/romixstore_support'
const supportHandle = isNoonyashop
	? '@noonyashop_support'
	: '@romixstore_support'

export default function UserAgreement() {
	const router = useRouter()
	return (
		<div className='min-h-screen bg-background pb-24'>
			{/* Header */}
			<div className='sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5'>
				<div className='container mx-auto px-4 py-4 flex items-center gap-3'>
					<Button onClick={() => router.push('/')} variant='ghost' size='icon'>
						<ArrowLeft className='w-5 h-5' />
					</Button>
					<h1 className='text-xl font-bold text-foreground text-center'>
						Пользовательское соглашение
					</h1>
				</div>
			</div>

			{/* Content */}
			<div className='container mx-auto px-4 py-6 max-w-3xl'>
				<div className='bg-element-bg/60 backdrop-blur-xl rounded-2xl p-6 border border-white/5 space-y-6'>
					{/* Intro */}
					<div className='space-y-3'>
						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>1.</span> Мы помогаем
							пользователям официально пополнять баланс аккаунтов игровыми
							ресурсами в FC Mobile. Все покупки осуществляются только
							официальным путём через магазин игры, со 100% гарантией
							безопасности вашего аккаунта и без риска блокировки.
						</p>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>2.</span> Время
							выполнения заказа составляет от 5 до 15 минут в рабочее время
							магазина {workingHours} по московскому времени. В отдельных
							случаях время выполнения может быть увеличено по техническим
							причинам магазина или игры.
						</p>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>3.</span> Возврат
							средств возможен, если заказ ещё не был выполнен. При отмене
							заказа удерживается комиссия сервиса в размере 30%, покрывающая
							платёжные и операционные расходы. После выполнения заказа возврат
							средств невозможен.
						</p>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>4.</span> Средства
							возвращаются тем же способом, которым был произведён платёж. Срок
							зачисления зависит от платёжной системы и может составлять до 1–10
							рабочих дней.
						</p>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>5.</span> Ваш аккаунт
							обязательно должен быть привязан к учётной записи EA, Google Play
							или Facebook. Если ни одной из указанных привязок нет, выполнение
							заказа невозможно. Клиент несёт ответственность за корректность
							введённых данных.
						</p>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>6.</span> Клиент
							обязан обеспечить конфиденциальность данных своего аккаунта и не
							передавать логин/пароль третьим лицам.
						</p>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>7.</span> {storeName}{' '}
							не является разработчиком игры и не связан с EA Sports. Все
							товарные знаки принадлежат их правообладателям. Мы предоставляем
							сервис по пополнению внутриигровых ресурсов.
						</p>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>8.</span>{' '}
							Администрация сервиса не несёт ответственности за:
						</p>
						<ul className='list-disc list-inside text-foreground/80 space-y-1 ml-6'>
							<li>
								блокировку аккаунта вследствие нарушений правил игры со стороны
								пользователя
							</li>
							<li>технические сбои игры или серверов</li>
							<li>действия платёжных систем и сторонних сервисов</li>
						</ul>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>9.</span> Оформляя
							заказ в {storeName}, вы подтверждаете, что ознакомлены и полностью
							согласны с данным пользовательским соглашением.
						</p>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>10.</span>{' '}
							Официальная поддержка магазина:{' '}
							<a
								href={supportLink}
								target='_blank'
								rel='noopener noreferrer'
								className='text-primary hover:text-primary-hover underline'
							>
								{supportHandle}
							</a>
						</p>
					</div>

					{/* Divider */}
					<div className='border-t border-white/10 my-6' />

					{/* Privacy Policy */}
					<div className='space-y-3'>
						<h2 className='text-xl font-bold text-foreground mb-4'>
							Политика конфиденциальности
						</h2>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>1.</span> {storeName}{' '}
							уважает конфиденциальность пользователей и гарантирует, что
							полученные от вас данные не передаются третьим лицам и не
							продаются. Мы не храним лишние персональные данные и используем
							только информацию, необходимую для выполнения заказа.
						</p>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>2.</span>{' '}
							Предоставленные вами данные используются исключительно для:
						</p>
						<ul className='list-disc list-inside text-foreground/80 space-y-1 ml-6'>
							<li>
								оформления и выполнения официальной покупки внутриигровых
								ресурсов
							</li>
							<li>
								связи с вами по вопросам статуса заказа, оплаты или доставки
								услуг
							</li>
						</ul>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>3.</span> Мы не
							запрашиваем и не храним ваши пароли от игровых аккаунтов. Вся
							информация предоставляется пользователем добровольно и
							используется строго в рамках настоящей политики.
						</p>

						<p className='text-foreground/90 leading-relaxed'>
							<span className='font-semibold text-primary'>4.</span> Используя
							сервис {storeName}, вы подтверждаете согласие с настоящей
							политикой конфиденциальности.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
