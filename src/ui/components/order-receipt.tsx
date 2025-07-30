"use client";

import { motion } from "framer-motion";
import { Check, Clock, MapPin, Phone, Store, User, QrCode, X } from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import QRCode from "qrcode";

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
    pickupTime?: string;
  };
  comment?: string;
  status?: string;
  createdAt?: string;
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
  comment,
  status,
  createdAt,
  onClose,
  onContinueShopping,
}: OrderReceiptProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [countdown, setCountdown] = useState(15);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasReturnedRef = useRef(false);
  
  // Стабилизируем функции обратного вызова
  const handleContinueShopping = useCallback(() => {
    if (!hasReturnedRef.current) {
      hasReturnedRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      onContinueShopping();
    }
  }, [onContinueShopping]);

  const handleClose = useCallback(() => {
    if (!hasReturnedRef.current) {
      hasReturnedRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      onClose();
    }
  }, [onClose]);
  
  // Генерируем QR код с информацией о заказе
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const orderInfo = {
          orderId,
          total,
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          status: status || "pending"
        };
        
        const qrData = JSON.stringify(orderInfo);
        const qrUrl = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        setQrCodeUrl(qrUrl);
      } catch (error) {
        console.error('Ошибка при генерации QR кода:', error);
      }
    };

    generateQRCode();
  }, [orderId, total, customerInfo.name, customerInfo.phone, status]);

  // Основной эффект для таймера - ИСПРАВЛЕНО
  useEffect(() => {
    // Очищаем предыдущий интервал если он есть
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Сбрасываем состояние при монтировании
    setCountdown(15);
    hasReturnedRef.current = false;

    // Запускаем новый интервал
    intervalRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        const newCountdown = prevCountdown - 1;
        
        // Когда таймер достигает 0, выполняем автовозврат
        if (newCountdown <= 0 && !hasReturnedRef.current) {
          // Очищаем интервал перед выполнением действия
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Выполняем автовозврат через небольшую задержку
          setTimeout(() => {
            handleContinueShopping();
          }, 100);
          return 0;
        }
        
        return newCountdown;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [handleContinueShopping]); // Добавляем handleContinueShopping в зависимости

  // Эффект очистки при размонтировании
  useEffect(() => {
    return () => {
      hasReturnedRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  const getPickupTimeText = (pickupTime?: string) => {
    if (!pickupTime) return "15-30 минут";
    
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
      className="max-w-md mx-auto relative"
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        {/* Кнопка закрытия X в правом верхнем углу */}
        <Button
          onClick={handleClose}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm"
          disabled={hasReturnedRef.current}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="text-center space-y-4 pt-8">
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
            {countdown > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Автовозврат к корзине через {countdown} сек.
              </p>
            )}
          </div>

          {/* QR Code */}
          {qrCodeUrl && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center space-y-2"
              initial={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <img 
                  src={qrCodeUrl} 
                  alt="QR код заказа" 
                  className="w-32 h-32"
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
                  <QrCode className="w-3 h-3" />
                  QR код для подтверждения заказа
                </p>
              </div>
            </motion.div>
          )}

          {/* Countdown timer */}
          <motion.div
            animate={{ opacity: 1 }}
            className="text-center bg-gray-50 p-3 rounded-lg"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <p className="text-sm text-muted-foreground">
              Автоматический возврат к покупкам через {countdown} сек.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${Math.max(0, (countdown / 15) * 100)}%` }}
              />
            </div>
          </motion.div>
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
                <span>Время готовности: {getPickupTimeText(customerInfo.pickupTime)}</span>
              </div>
            </div>
          </div>

          {/* Pickup Info */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Store className="w-4 h-4" />
              Информация о самовывозе
            </h4>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-3 h-3 text-gray-500" />
                <span>г. Алматы, ул. Назарбаева 123, офис 45</span>
              </div>
              <p className="text-xs text-gray-600">
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
            <Button 
              onClick={handleContinueShopping}
              className="w-full"
              disabled={hasReturnedRef.current}
            >
              Продолжить покупки
              {countdown > 0 && ` (${countdown})`}
            </Button>
            <Button 
              onClick={handleClose}
              variant="outline" 
              className="w-full"
              disabled={hasReturnedRef.current}
            >
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
