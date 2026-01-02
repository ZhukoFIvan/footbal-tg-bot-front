import type { NextConfig } from 'next'

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
				hostname: 'noonyashop.ru',
				pathname: '/uploads/**',
			},
		],
		unoptimized: true,
	},
}

export default nextConfig
