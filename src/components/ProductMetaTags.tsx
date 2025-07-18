"use client";

import Head from "next/head";
import { useEffect } from "react";

interface ProductMetaTagsProps {
  product: {
    id: number;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    images?: string[];
    storeName: string;
    categoryName?: string;
  } | null;
}

export function ProductMetaTags({ product }: ProductMetaTagsProps) {
  useEffect(() => {
    if (!product) return;

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("ru-RU", {
        currency: "KZT",
        style: "currency",
      }).format(price);
    };

    const currentUrl = window.location.href;
    const imageUrl = product.images && product.images.length > 0 
      ? product.images[0] 
      : '/placeholder-food.jpg';
    
    const discount = product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    const title = `${product.name} - ${formatPrice(product.price)} | FoodSave`;
    const description = discount > 0 
      ? `🔥 Скидка ${discount}%! ${product.description || product.name} от ${product.storeName}. Было: ${formatPrice(product.originalPrice!)}, теперь: ${formatPrice(product.price)}`
      : `${product.description || product.name} от ${product.storeName} - ${formatPrice(product.price)}`;

    // Обновляем title страницы
    document.title = title;

    // Удаляем существующие метатеги
    const existingMetaTags = document.querySelectorAll('meta[data-dynamic="true"]');
    existingMetaTags.forEach(tag => tag.remove());

    // Создаем новые метатеги
    const metaTags: Array<{property?: string, name?: string, content: string}> = [
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'product' },
      { property: 'og:site_name', content: 'FoodSave' },
      { property: 'og:locale', content: 'ru_RU' },
      
      // Product specific Open Graph
      { property: 'product:price:amount', content: product.price.toString() },
      { property: 'product:price:currency', content: 'KZT' },
      { property: 'product:availability', content: 'in stock' },
      { property: 'product:condition', content: 'new' },
      { property: 'product:brand', content: product.storeName },
      { property: 'product:category', content: product.categoryName || 'Еда' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },

      // Standard meta tags
      { name: 'description', content: description },
      { name: 'keywords', content: `${product.name}, ${product.storeName}, еда, скидки, FoodSave` },

      // WhatsApp/Telegram specific
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:type', content: 'image/jpeg' },
    ];

    // Добавляем метатеги в head
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      if (tag.property) {
        meta.setAttribute('property', tag.property);
      } else if (tag.name) {
        meta.setAttribute('name', tag.name);
      }
      meta.setAttribute('content', tag.content);
      meta.setAttribute('data-dynamic', 'true');
      document.head.appendChild(meta);
    });

    // Cleanup при размонтировании
    return () => {
      const dynamicTags = document.querySelectorAll('meta[data-dynamic="true"]');
      dynamicTags.forEach(tag => tag.remove());
    };
  }, [product]);

  return null; // Этот компонент не рендерит UI
}
