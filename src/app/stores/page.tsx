"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Phone, Star, ChevronRight } from "lucide-react";
import { Card, CardContent } from "~/ui/primitives/card";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import { Input } from "~/ui/primitives/input";
import { apiClient } from "~/lib/api-client";
import { useLanguage } from "~/contexts/language-context";

// Используем StoreInfo из api-client
type Store = {
  id: number;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  logo?: string;
  status?: string;
  active?: boolean;
  openingHours?: string;
  closingHours?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  productCount?: number;
};

export default function StoresPage() {
  const { t } = useLanguage();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAllStores();
      
      // Фильтруем только активные магазины для клиентов
      const activeStores = response.filter((store) => 
        store.active && store.status === 'ACTIVE'
      );
      
      // Сортируем магазины: сначала те, у которых есть товары, потом остальные
      const sortedStores = activeStores.sort((a, b) => {
        const aHasProducts = (a.productCount || 0) > 0;
        const bHasProducts = (b.productCount || 0) > 0;
        
        if (aHasProducts && !bHasProducts) return -1;
        if (!aHasProducts && bHasProducts) return 1;
        
        // Если оба имеют товары или оба не имеют, сортируем по количеству товаров (убывание)
        return (b.productCount || 0) - (a.productCount || 0);
      });
      
      setStores(sortedStores);
    } catch (error) {
      console.error('Error fetching stores:', error);
      // Fallback data для демонстрации - отсортированные по наличию товаров
      const fallbackStores: Store[] = [
        {
          id: 3,
          name: "Fresh Delights",
          description: "Свежие фрукты и овощи каждый день",
          address: "г. Алматы, ул. Назарбаева, 123",
          phone: "+7 (727) 345-67-89",
          email: "fresh@foodsave.kz",
          status: "ACTIVE",
          active: true,
          openingHours: "07:00",
          closingHours: "22:00",
          category: "Фрукты и овощи",
          rating: 4.7,
          reviewCount: 203,
          productCount: 67
        },
        {
          id: 1,
          name: "FoodSave Central",
          description: "Премиум продукты со скидкой до 70%",
          address: "г. Алматы, ул. Абая, 15",
          phone: "+7 (727) 123-45-67",
          email: "central@foodsave.kz",
          logo: "/logo.png",
          status: "ACTIVE",
          active: true,
          openingHours: "09:00",
          closingHours: "21:00",
          category: "Супермаркет",
          rating: 4.8,
          reviewCount: 156,
          productCount: 45
        },
        {
          id: 2,
          name: "Eco Market",
          description: "Экологически чистые продукты",
          address: "г. Алматы, ул. Толе би, 89",
          phone: "+7 (727) 234-56-78",
          email: "eco@foodsave.kz",
          status: "ACTIVE",
          active: true,
          openingHours: "08:00",
          closingHours: "20:00",
          category: "Эко-магазин",
          rating: 4.6,
          reviewCount: 89,
          productCount: 28
        }
      ];
      
      setStores(fallbackStores);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWorkingHours = (store: Store) => {
    if (store.openingHours && store.closingHours) {
      return `${store.openingHours} - ${store.closingHours}`;
    }
    return "09:00 - 18:00";
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t("stores.titleMain")}</h1>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-6 w-full max-w-md"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
        <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {t("stores.titleMain")}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t("stores.subtitleMain")}
        </p>

        {/* Search */}
        <div className="relative max-w-md">
          <Input
            type="text"
            placeholder={t("stores.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Stores Grid */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏪</div>
          <p className="text-muted-foreground text-lg">
            {searchTerm 
              ? t("stores.noBoxesFound")
              : t("stores.noBoxesYet")
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Card key={store.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden">
              <CardContent className="p-0">
                {/* Store Image/Logo */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
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
                      <div className="text-6xl text-blue-500">🏪</div>
                    </div>
                  )}
                  
                  {/* Badge with category */}
                  {store.category && (
                    <Badge className="absolute top-4 left-4 bg-white/90 text-foreground hover:bg-white">
                      {store.category}
                    </Badge>
                  )}
                  
                  {/* Product count badge */}
                  {store.productCount !== undefined && (
                    <Badge className={`absolute top-4 right-4 ${
                      store.productCount > 0 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gray-400 hover:bg-gray-500'
                    }`}>
                      {store.productCount > 0 ? `${store.productCount} ${t("stores.boxesCount")}` : t("stores.noBoxes")}
                    </Badge>
                  )}
                </div>

                <div className="p-6">
                  {/* Store Name & Description */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {store.name}
                    </h3>
                    {store.description && (
                      <p className="text-sm text-muted-foreground">
                        {store.description}
                      </p>
                    )}
                  </div>

                  {/* Rating */}
                  {store.rating && (
                    <div className="mb-3 flex items-center gap-2">
                      {renderStars(store.rating)}
                      {store.reviewCount && (
                        <span className="text-sm text-muted-foreground">
                          ({store.reviewCount} {t("stores.reviews")})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Store Info */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{store.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>{t("stores.workingHours")}: {getWorkingHours(store)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {(store.productCount || 0) > 0 ? (
                    <Link href={`/products?store=${store.id}`}>
                      <Button className="w-full group/btn">
                        <span>{t("stores.viewBoxes")}</span>
                        <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 cursor-not-allowed"
                      disabled
                    >
                      <span>{t("stores.boxesSoon")}</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
