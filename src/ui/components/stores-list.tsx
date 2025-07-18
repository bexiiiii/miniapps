"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Phone, Star, ChevronRight, Store } from "lucide-react";
import { Card, CardContent } from "~/ui/primitives/card";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import { apiClient } from "~/lib/api-client";

interface StoreCardProps {
  store: {
    id: number;
    name: string;
    description?: string;
    address: string;
    phone: string;
    logo?: string;
    status: string;
    active: boolean;
    openingHours?: string;
    closingHours?: string;
    category?: string;
    rating?: number;
    reviewCount?: number;
    productCount?: number;
  };
}

export function StoreCard({ store }: StoreCardProps) {
  const getWorkingHours = () => {
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

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden">
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
              <Store className="h-16 w-16 text-blue-500" />
            </div>
          )}
          
          {/* Badge with category */}
          {store.category && (
            <Badge className="absolute top-4 left-4 bg-white/90 text-foreground hover:bg-white">
              {store.category}
            </Badge>
          )}
          
          {/* Product count badge */}
          {store.productCount && (
            <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
              {store.productCount} боксов
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
              <span>Работаем: {getWorkingHours()}</span>
            </div>
          </div>

          {/* Action Button */}
          <Link href={`/products?store=${store.id}`}>
            <Button className="w-full group/btn">
              <span>Смотреть боксы</span>
              <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

interface StoresListProps {
  limit?: number;
  showSearch?: boolean;
  className?: string;
}

export function StoresList({ limit, showSearch = true, className }: StoresListProps) {
  const [stores, setStores] = useState<any[]>([]);
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
      const activeStores = response.filter((store: any) => 
        store.active && store.status === 'ACTIVE'
      );
      
      setStores(limit ? activeStores.slice(0, limit) : activeStores);
    } catch (error) {
      console.error('Error fetching stores:', error);
      // Fallback data для демонстрации
      const fallbackStores = [
        {
          id: 1,
          name: "FoodSave Central",
          description: "Премиум боксы со скидкой до 70%",
          address: "г. Алматы, ул. Абая, 15",
          phone: "+7 (727) 123-45-67",
          status: "ACTIVE",
          active: true,
          openingHours: "09:00",
          closingHours: "21:00",
          category: "Супермаркет",
          productCount: 45
        },
        {
          id: 2,
          name: "Eco Market",
          description: "Экологически чистые боксы",
          address: "г. Алматы, ул. Толе би, 89",
          phone: "+7 (727) 234-56-78",
          status: "ACTIVE",
          active: true,
          openingHours: "08:00",
          closingHours: "20:00",
          category: "Эко-магазин",
          productCount: 28
        }
      ];
      
      setStores(limit ? fallbackStores.slice(0, limit) : fallbackStores);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
    );
  }

  return (
    <div className={className}>
      {showSearch && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Поиск боксов по магазинам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-input rounded-md bg-background text-foreground"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-muted-foreground text-lg">
            {searchTerm 
              ? "Боксы не найдены. Попробуйте изменить поисковый запрос."
              : "Боксы пока не добавлены."
            }
          </p>
        </div>
      )}
    </div>
  );
}