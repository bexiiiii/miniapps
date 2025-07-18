"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, X } from "lucide-react";

import { apiClient } from "~/lib/api-client";
import { useCartBackend } from "~/lib/hooks/use-cart-backend";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { Badge } from "~/ui/primitives/badge";

interface OutOfStockItem {
  id: number;
  name: string;
  quantity: number;
  stockQuantity: number;
  image?: string;
}

export function OutOfStockManager() {
  const { items, removeItem, updateQuantity, refreshCart } = useCartBackend();
  const [outOfStockItems, setOutOfStockItems] = useState<OutOfStockItem[]>([]);
  const [loading, setLoading] = useState(false);

  const checkStockAvailability = async () => {
    if (!items.length) return;

    setLoading(true);
    const outOfStockList: OutOfStockItem[] = [];

    try {
      for (const item of items) {
        try {
          const product = await apiClient.getProductById(Number(item.id));
          
          // Check if product is inactive or stock is insufficient
          if (!product.active || product.stockQuantity === 0) {
            outOfStockList.push({
              id: Number(item.id),
              name: item.name,
              quantity: item.quantity,
              stockQuantity: 0,
              image: item.image
            });
          } else if (product.stockQuantity < item.quantity) {
            outOfStockList.push({
              id: Number(item.id),
              name: item.name,
              quantity: item.quantity,
              stockQuantity: product.stockQuantity,
              image: item.image
            });
          }
        } catch (error) {
          console.error(`Error checking stock for product ${item.id}:`, error);
        }
      }

      setOutOfStockItems(outOfStockList);
    } catch (error) {
      console.error('Error checking stock availability:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      checkStockAvailability();
    } else {
      setOutOfStockItems([]);
    }
  }, [items]);

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItem(itemId);
      toast.success('Товар удален из корзины');
    } catch (error) {
      toast.error('Ошибка при удалении товара');
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
      toast.success('Количество обновлено');
      // Refresh stock check after update
      setTimeout(checkStockAvailability, 500);
    } catch (error) {
      toast.error('Ошибка при обновлении количества');
    }
  };

  const handleRemoveAllOutOfStock = async () => {
    const zeroStockItems = outOfStockItems.filter(item => item.stockQuantity === 0);
    
    try {
      for (const item of zeroStockItems) {
        await removeItem(item.id);
      }
      toast.success('Недоступные товары удалены из корзины');
    } catch (error) {
      toast.error('Ошибка при удалении товаров');
    }
  };

  const handleUpdateAllQuantities = async () => {
    const itemsToUpdate = outOfStockItems.filter(item => item.stockQuantity > 0);
    
    try {
      for (const item of itemsToUpdate) {
        await updateQuantity(item.id, item.stockQuantity);
      }
      toast.success('Количества обновлены до доступного');
    } catch (error) {
      toast.error('Ошибка при обновлении количеств');
    }
  };

  if (outOfStockItems.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <CardTitle className="text-red-800 dark:text-red-200">
            Проблемы с наличием товаров
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {outOfStockItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border"
          >
            <div className="flex items-center gap-3">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    В корзине: {item.quantity}
                  </span>
                  {item.stockQuantity === 0 ? (
                    <Badge variant="destructive">Нет в наличии</Badge>
                  ) : (
                    <Badge variant="secondary">
                      Доступно: {item.stockQuantity}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.stockQuantity > 0 && item.stockQuantity < item.quantity && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateQuantity(item.id, item.stockQuantity)}
                >
                  Обновить до {item.stockQuantity}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRemoveItem(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="flex gap-2 pt-2">
          {outOfStockItems.some(item => item.stockQuantity === 0) && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemoveAllOutOfStock}
            >
              Удалить недоступные
            </Button>
          )}
          {outOfStockItems.some(item => item.stockQuantity > 0) && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleUpdateAllQuantities}
            >
              Обновить все количества
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}