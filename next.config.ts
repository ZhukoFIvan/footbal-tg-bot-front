import type { NextConfig } from 'next'

const isNoonyashop = process.env.NEXT_PUBLIC_IS_NOONYASHOP === 'true'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8000',
				pathname: '/uploads/**',
			},
			{
				protocol: 'https',
				hostname: isNoonyashop ? 'noonyashop.ru' : 'romixstore.ru',
				pathname: '/uploads/**',
			},
		],
		unoptimized: true,
	},
}

export default nextConfig
