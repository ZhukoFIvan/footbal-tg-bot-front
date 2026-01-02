import ProductCard from '../ProductCard/ProductCard'
import { Product } from '@/app/store/api/productsApi'

const items: Product[] = [
	{
		id: 1,
		category_id: 1,
		section_id: 1,
		title: 'EA SPORTS FC™ 24 — 12 000 FC Points',
		slug: 'ea-sports-fc-24-12000-points',
		description: 'EA SPORTS FC™ 24 — 12 000 FC Points',
		price: 21720,
		old_price: null,
		promotion_text: null,
		currency: 'RUB',
		stock_count: 100,
		is_active: true,
		images: ['https://via.placeholder.com/280x280.png?text=FC'],
		badge: {
			id: 1,
			title: 'НОВИНКА',
			color: '#FF0000',
			text_color: '#FFFFFF',
		},
	},
	{
		id: 2,
		category_id: 1,
		section_id: 1,
		title: 'EA SPORTS FC™ 24 — 12 000 FC Points',
		slug: 'ea-sports-fc-24-12000-points-2',
		description: 'EA SPORTS FC™ 24 — 12 000 FC Points',
		price: 21720,
		old_price: 27150,
		promotion_text: null,
		currency: 'RUB',
		stock_count: 100,
		is_active: true,
		images: ['https://via.placeholder.com/280x280.png?text=FC'],
		badge: null,
	},
	{
		id: 3,
		category_id: 1,
		section_id: 1,
		title: 'EA SPORTS FC™ 24 — 12 000 FC Points',
		slug: 'ea-sports-fc-24-12000-points-3',
		description: 'EA SPORTS FC™ 24 — 12 000 FC Points',
		price: 21720,
		old_price: null,
		promotion_text: null,
		currency: 'RUB',
		stock_count: 100,
		is_active: true,
		images: ['https://via.placeholder.com/280x280.png?text=FC'],
		badge: null,
	},
	{
		id: 4,
		category_id: 1,
		section_id: 1,
		title: 'EA SPORTS FC™ 24 — 12 000 FC Points',
		slug: 'ea-sports-fc-24-12000-points-4',
		description: 'EA SPORTS FC™ 24 — 12 000 FC Points',
		price: 21720,
		old_price: null,
		promotion_text: null,
		currency: 'RUB',
		stock_count: 100,
		is_active: true,
		images: ['https://via.placeholder.com/280x280.png?text=FC'],
		badge: null,
	},
]
export default function ProductList() {
	return (
		<div className='min-h-screen bg-neutral-950 p-4'>
			<div className='grid grid-cols-2 gap-4'>
				{items.map((item) => (
					<ProductCard key={item.id} product={item} />
				))}
			</div>
		</div>
	)
}
