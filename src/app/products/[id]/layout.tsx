import { Metadata } from 'next';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  storeName: string;
  categoryName?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    // Await the params Promise
    const { id } = await params;
    
    // Попытаемся получить данные товара для метатегов
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/products/${id}`, {
      cache: 'no-store', // Всегда получаем свежие данные
    });

    if (!response.ok) {
      return {
        title: 'Товар не найден | FoodSave',
        description: 'Запрашиваемый товар не найден',
      };
    }

    const product = await response.json() as Product;
    
    const discount = product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("ru-RU", {
        currency: "KZT",
        style: "currency",
      }).format(price);
    };

    const title = `${product.name} - ${formatPrice(product.price)} | FoodSave`;
    const description = discount > 0 && product.originalPrice
      ? `🔥 Скидка ${discount}%! ${product.description || product.name} от ${product.storeName}. Было: ${formatPrice(product.originalPrice)}, теперь: ${formatPrice(product.price)}`
      : `${product.description || product.name} от ${product.storeName} - ${formatPrice(product.price)}`;

    const imageUrl = product.images && product.images.length > 0 
      ? product.images[0] 
      : '/placeholder-food.jpg';

    return {
      title,
      description,
      keywords: `${product.name}, ${product.storeName}, еда, скидки, FoodSave`,
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        type: 'website',
        siteName: 'FoodSave',
        locale: 'ru_RU',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      other: {
        // Product specific meta tags
        'product:price:amount': product.price.toString(),
        'product:price:currency': 'KZT',
        'product:availability': 'in stock',
        'product:condition': 'new',
        'product:brand': product.storeName,
        'product:category': product.categoryName || 'Еда',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Товар | FoodSave',
      description: 'Просмотр товара на FoodSave',
    };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
