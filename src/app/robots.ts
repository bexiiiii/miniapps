import { MetadataRoute } from 'next'
import { SEO_CONFIG } from '~/app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/auth/',
          '/api/',
          '/dashboard/',
          '/profile/',
          '/orders/',
          '/cart/',
          '/_next/',
          '/temp/',
          '*.json$',
          '/test/',
        ],
      },
      {
        userAgent: ['SemrushBot', 'AhrefsBot', 'MJ12bot'],
        crawlDelay: 10,
      },
    ],
    sitemap: `${SEO_CONFIG.url}/sitemap.xml`,
    host: SEO_CONFIG.url,
  }
}
