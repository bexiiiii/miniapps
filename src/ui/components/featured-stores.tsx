"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Store, MapPin, Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "~/ui/primitives/card";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import { apiClient } from "~/lib/api-client";

interface FeaturedStoreProps {
  store: {
    id: number;
    name: string;
    description?: string;
    address: string;
    logo?: string;
    category?: string;
    rating?: number;
    productCount?: number;
  };
}

function FeaturedStoreCard({ store }: FeaturedStoreProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden">
      <CardContent className="p-0">
        {/* Store Image/Logo */}
        <div className="relative h-32 bg-gradient-to-br from-blue-50 to-indigo-100">
          {store.logo ? (
            <Image
              src={store.logo}
              alt={store.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <Store className="h-12 w-12 text-blue-500" />
            </div>
          )}
          
          {/* Category Badge */}
          {store.category && (
            <Badge className="absolute top-3 left-3 bg-white/90 text-foreground hover:bg-white text-xs">
              {store.category}
            </Badge>
          )}
        </div>

        <div className="p-4">
          {/* Store Name */}
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {store.name}
          </h3>

          {/* Description */}
          {store.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {store.description}
            </p>
          )}

          {/* Rating and Product Count */}
          <div className="flex items-center justify-between mb-3">
            {store.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{store.rating.toFixed(1)}</span>
              </div>
            )}
            {store.productCount && (
              <span className="text-xs text-muted-foreground">
                {store.productCount} товаров
              </span>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <span className="text-sm text-muted-foreground line-clamp-2">
              {store.address}
            </span>
          </div>

          {/* Action Button */}
          <Link href={`/products?store=${store.id}`}>
            <Button size="sm" className="w-full">
              Смотреть товары
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

interface FeaturedStoresProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showViewAll?: boolean;
  className?: string;
}

export function FeaturedStores({ 
  title = "Популярные боксы",
  subtitle = "Найдите лучшие предложения от наших партнёров",
  limit = 6,
  showViewAll = true,
  className = ""
}: FeaturedStoresProps) {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedStores();
  }, [limit]);

  const fetchFeaturedStores = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAllStores();
      
      // Берем только активные магазины и ограничиваем количество
      const activeStores = response
        .filter((store: any) => store.active && store.status === 'ACTIVE')
        .slice(0, limit);
      
      setStores(activeStores);
    } catch (error) {
      console.error('Error fetching featured stores:', error);
      // Fallback data для демонстрации
      const fallbackStores = [
        {
          id: 1,
          name: "FoodSave Central",
          description: "Премиум продукты со скидкой до 70%",
          address: "г. Алматы, ул. Абая, 15",
          category: "Супермаркет",
          rating: 4.8,
          productCount: 45
        },
        {
          id: 2,
          name: "Eco Market",
          description: "Экологически чистые продукты",
          address: "г. Алматы, ул. Толе би, 89",
          category: "Эко-магазин",
          rating: 4.6,
          productCount: 28
        },
        {
          id: 3,
          name: "Fresh Bakery",
          description: "Свежая выпечка каждый день",
          address: "г. Алматы, пр. Достык, 234",
          category: "Пекарня",
          rating: 4.9,
          productCount: 15
        }
      ];
      
      setStores(fallbackStores.slice(0, limit));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].slice(0, limit).map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-32 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (stores.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stores.map((store) => (
            <FeaturedStoreCard key={store.id} store={store} />
          ))}
        </div>

        {showViewAll && (
          <div className="text-center">
            <Link href="/stores">
              <Button variant="outline" size="lg">
                Все Боксы
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
