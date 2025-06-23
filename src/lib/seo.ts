import { Metadata } from 'next'
import { SEO_CONFIG } from '~/app'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  canonical?: string
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  noIndex = false,
  canonical,
}: SEOProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${SEO_CONFIG.name}` : SEO_CONFIG.fullName
  const pageDescription = description || SEO_CONFIG.description
  const pageKeywords = [...SEO_CONFIG.keywords, ...keywords]
  const pageUrl = url ? `${SEO_CONFIG.url}${url}` : SEO_CONFIG.url
  const pageImage = image || '/og-image.png'

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    authors: [{ name: SEO_CONFIG.author }],
    creator: SEO_CONFIG.author,
    publisher: SEO_CONFIG.author,
    metadataBase: new URL(SEO_CONFIG.url),
    alternates: {
      canonical: canonical || url || '/',
      languages: {
        'ru-KZ': url || '/',
        'en-US': `/en${url || ''}`,
        'kk-KZ': `/kk${url || ''}`,
      },
    },
    openGraph: {
      type,
      locale: SEO_CONFIG.locale,
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: SEO_CONFIG.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      site: SEO_CONFIG.twitterHandle,
      creator: SEO_CONFIG.twitterHandle,
      images: [pageImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    category: 'food',
    classification: 'Food Delivery Service',
  }
}

export const COMMON_KEYWORDS = {
  food: [
    'еда со скидкой',
    'продукты питания',
    'экономия на еде',
    'доставка еды',
    'healthy food',
  ],
  business: [
    'рестораны Алматы',
    'кафе со скидкой',
    'foodsave',
    'свежие продукты',
  ],
  eco: [
    'surplus food',
    'food waste reduction',
    'экологичная еда',
    'Zero waste',
    'sustainable food',
  ],
  deals: [
    'скидки на продукты',
    'дешевая еда',
    'качественная еда',
    'антикризис',
  ],
} as const;

export function generateBreadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${SEO_CONFIG.url}${item.url}` : undefined,
    })),
  }
}

export function generateProductSchema(product: {
  name: string
  description: string
  image?: string
  price?: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  brand?: string
  category?: string
  sku?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand || SEO_CONFIG.name,
    },
    category: product.category,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'KZT',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: SEO_CONFIG.name,
      },
    },
  }
}

export function generateArticleSchema(article: {
  headline: string
  description: string
  image?: string
  url: string
  datePublished?: Date
  dateModified?: Date
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    url: `${SEO_CONFIG.url}${article.url}`,
    datePublished: (article.datePublished || new Date()).toISOString(),
    dateModified: (article.dateModified || new Date()).toISOString(),
    author: {
      '@type': 'Person',
      name: article.author || SEO_CONFIG.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SEO_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SEO_CONFIG.url}${article.url}`,
    },
  }
}
