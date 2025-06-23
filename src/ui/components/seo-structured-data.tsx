import { SEO_CONFIG } from '~/app'

interface SEOStructuredDataProps {
  type?: 'organization' | 'website' | 'article' | 'product' | 'breadcrumb'
  title?: string
  description?: string
  image?: string
  url?: string
  additionalData?: Record<string, any>
}

export function SEOStructuredData({
  type = 'organization',
  title,
  description,
  image,
  url,
  additionalData = {},
}: SEOStructuredDataProps) {
  const baseData = {
    '@context': 'https://schema.org',
  }

  let structuredData: any = baseData

  switch (type) {
    case 'organization':
      structuredData = {
        ...baseData,
        '@type': 'Organization',
        name: SEO_CONFIG.name,
        alternateName: SEO_CONFIG.fullName,
        url: SEO_CONFIG.url,
        logo: `${SEO_CONFIG.url}/logo.png`,
        description: SEO_CONFIG.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Алматы',
          addressLocality: 'Алматы',
          addressRegion: 'Алматы',
          postalCode: '050000',
          addressCountry: 'KZ',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+7-777-123-4567',
          contactType: 'customer service',
          availableLanguage: ['Russian', 'Kazakh', 'English'],
        },
        sameAs: [
          `https://twitter.com/${SEO_CONFIG.twitterHandle.replace('@', '')}`,
          `https://facebook.com/${SEO_CONFIG.facebookPage}`,
          'https://instagram.com/foodsave_kz',
        ],
        foundingDate: '2024',
        numberOfEmployees: '10-50',
        industry: 'Food Technology',
        serviceArea: {
          '@type': 'City',
          name: 'Алматы',
        },
        ...additionalData,
      }
      break

    case 'website':
      structuredData = {
        ...baseData,
        '@type': 'WebSite',
        name: title || SEO_CONFIG.fullName,
        alternateName: SEO_CONFIG.name,
        url: url || SEO_CONFIG.url,
        description: description || SEO_CONFIG.description,
        publisher: {
          '@type': 'Organization',
          name: SEO_CONFIG.name,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SEO_CONFIG.url}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        ...additionalData,
      }
      break

    case 'article':
      structuredData = {
        ...baseData,
        '@type': 'Article',
        headline: title,
        description: description,
        image: image,
        url: url,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: SEO_CONFIG.author,
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
          '@id': url,
        },
        ...additionalData,
      }
      break

    case 'product':
      structuredData = {
        ...baseData,
        '@type': 'Product',
        name: title,
        description: description,
        image: image,
        url: url,
        brand: {
          '@type': 'Brand',
          name: SEO_CONFIG.name,
        },
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          priceCurrency: 'KZT',
        },
        ...additionalData,
      }
      break

    case 'breadcrumb':
      structuredData = {
        ...baseData,
        '@type': 'BreadcrumbList',
        ...additionalData,
      }
      break
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function LocalBusinessStructuredData() {
  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SEO_CONFIG.fullName,
    description: SEO_CONFIG.description,
    url: SEO_CONFIG.url,
    telephone: '+7-777-123-4567',
    email: 'support@foodsave.kz',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Алматы',
      addressLocality: 'Алматы',
      addressRegion: 'Алматы',
      postalCode: '050000',
      addressCountry: 'KZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.2381,
      longitude: 76.9452,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '09:00',
        closes: '21:00',
      },
    ],
    priceRange: '₸₸',
    servesCuisine: ['International', 'Healthy Food', 'Organic'],
    serviceArea: {
      '@type': 'City',
      name: 'Алматы',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
    />
  )
}
