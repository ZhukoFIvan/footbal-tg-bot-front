import ProductCard from '../ProductCard/ProductCard'

const items = [
	{
		id: '1',
		title: 'EA SPORTS FC™ 24 — 12 000 FC Points',
		price: 21720,
		badge: 'НОВИНКА',
		imageUrl: 'https://via.placeholder.com/280x280.png?text=FC',
	},
	{
		id: '2',
		title: 'EA SPORTS FC™ 24 — 12 000 FC Points',
		price: 21720,
		discount: 20,
		imageUrl: 'https://via.placeholder.com/280x280.png?text=FC',
	},
	{
		id: '3',
		title: 'EA SPORTS FC™ 24 — 12 000 FC Points',
		price: 21720,
		imageUrl: 'https://via.placeholder.com/280x280.png?text=FC',
	},
	{
		id: '4',
		title: 'EA SPORTS FC™ 24 — 12 000 FC Points',
		price: 21720,
		imageUrl: 'https://via.placeholder.com/280x280.png?text=FC',
	},
]
export default function ProductList() {
	return (
		<div className='min-h-screen bg-neutral-950 p-4'>
			<div className='grid grid-cols-2 gap-4'>
				{items.map((item) => (
					<ProductCard key={item.id} item={item} />
				))}
			</div>
		</div>
	)
}
