"use client";

import { motion } from "framer-motion";
import { Check, Clock, MapPin, Phone, User } from "lucide-react";
import React from "react";

import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { Separator } from "~/ui/primitives/separator";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderReceiptProps {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  customerInfo: {
    name: string;
    phone: string;
    pickupTime: string;
  };
  onClose: () => void;
  onContinueShopping: () => void;
}

export function OrderReceipt({
  orderId,
  items,
  subtotal,
  total,
  paymentMethod,
  customerInfo,
  onClose,
  onContinueShopping,
}: OrderReceiptProps) {
  const getPickupTimeText = (pickupTime: string) => {
    switch (pickupTime) {
      case "asap":
        return "Как можно скорее (15-20 мин)";
      case "30min":
        return "Через 30 минут";
      case "1hour":
        return "Через 1 час";
      case "2hours":
        return "Через 2 часа";
      default:
        return pickupTime;
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="text-center space-y-4">
          <motion.div
            animate={{ scale: 1 }}
            className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            <Check className="w-8 h-8 text-green-600" />
          </motion.div>
          <div>
            <CardTitle className="text-xl text-green-600">
              Заказ оформлен!
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Номер заказа: #{orderId}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Status */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Ожидает оплаты</span>
            </div>
            <p className="text-sm text-blue-700">
              Способ оплаты: <strong>{paymentMethod}</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              В настоящее время идет подключение платежных шлюзов. 
              Пока доступна только оплата наличными при получении.
            </p>
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Информация о получателе
            </h4>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-3 h-3 text-gray-500" />
                <span>{customerInfo.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-3 h-3 text-gray-500" />
                <span>{customerInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-3 h-3 text-gray-500" />
                <span>Готовность: {getPickupTimeText(customerInfo.pickupTime)}</span>
              </div>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Адрес самовывоза
            </h4>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">г. Алматы, ул. Назарбаева 123, офис 45</span>
              </div>
              <p className="text-xs text-green-600">
                Режим работы: Пн-Пт 9:00-18:00, Сб 10:00-16:00
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h4 className="font-medium">Состав заказа</h4>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₸{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Стоимость товаров:</span>
              <span>₸{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Самовывоз:</span>
              <span>Бесплатно</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Итого к оплате:</span>
              <span>₸{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button onClick={onContinueShopping} className="w-full">
              Продолжить покупки
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full">
              Закрыть
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Время обработки заказа: 15-30 минут</p>
            <p>Мы свяжемся с вами для уточнения деталей</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
