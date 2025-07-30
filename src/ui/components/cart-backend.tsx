"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";

import { cn } from "~/lib/cn";
import { useMediaQuery } from "~/lib/hooks/use-media-query";
import { useCartBackend } from "~/lib/hooks/use-cart-backend";
import { apiClient, type CreateOrderRequest } from "~/lib/api-client";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/ui/primitives/drawer";
import { Separator } from "~/ui/primitives/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/ui/primitives/sheet";
import { Skeleton } from "~/ui/primitives/skeleton";

import { OrderReceipt } from "./order-receipt";
import { OrderForm } from "./order-form";
import { useAuth } from "~/lib/auth-context";
import { OutOfStockManager } from "~/components/cart/OutOfStockManager";

// Remove the inline OrderForm component since we're using the one from order-form.tsx
const LocalOrderForm = ({ subtotal, total, onSubmit, onCancel, loading, items }: {
  subtotal: number;
  total: number;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
  items?: Array<{ storeId?: string; name?: string }>;
}) => {
  const { user } = useAuth();
  const [storeInfo, setStoreInfo] = React.useState<any>(null);
  const [storeLoading, setStoreLoading] = React.useState(true);
  const [paymentMethod, setPaymentMethod] = React.useState<'cash' | 'card'>('cash');
  const [comment, setComment] = React.useState('');

  // Get store info from first item
  React.useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const firstItem = items?.[0];
        const storeId = firstItem?.storeId;
        
        console.log('OrderForm Debug:', {
          items: items,
          firstItem: firstItem,
          storeId: storeId
        });
        
        if (storeId) {
          console.log('Fetching store data for storeId:', storeId);
          const storeData = await apiClient.getStoreById(Number(storeId));
          console.log('Store data received:', storeData);
          setStoreInfo(storeData);
        } else {
          console.log('No storeId found, using fallback data');
          // Fallback store info
          setStoreInfo({
            id: 10,
            name: 'FoodSave',
            address: 'г. Алматы, ул. Назарбаева 123, офис 45',
            phone: '+7 (727) 123-45-67',
            openingHours: '09:00',
            closingHours: '18:00'
          });
        }
      } catch (error) {
        console.error('Error fetching store info:', error);
        // Fallback store info on error
        setStoreInfo({
          id: 10,
          name: 'FoodSave',
          address: 'г. Алматы, ул. Назарбаева 123, офис 45',
          phone: '+7 (727) 123-45-67',
          openingHours: '09:00',
          closingHours: '18:00'
        });
      } finally {
        setStoreLoading(false);
      }
    };

    fetchStoreInfo();
  }, [items]);

  const handleSubmit = () => {
    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Гость';
    const phone = user?.phone || '+77771234567';

    onSubmit({
      name: fullName,
      phone: phone,
      paymentMethod: paymentMethod,
      comment: comment
    });
  };

  return (
    <div className="h-full max-h-[85vh] overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-4 sticky top-0 bg-white z-10 pb-3 border-b">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к корзине
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Оформление заказа</h2>
            <p className="text-sm text-gray-600">Заполните данные для самовывоза</p>
          </div>
        </div>

        {/* Store Info Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-900">Точка самовывоза</h3>
          </div>
        
          {storeLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-blue-200 rounded w-3/4"></div>
              <div className="h-4 bg-blue-200 rounded w-1/2"></div>
              <div className="h-4 bg-blue-200 rounded w-2/3"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">{storeInfo?.name || 'FoodSave'}</p>
                  <p className="text-gray-700">{storeInfo?.address || 'г. Алматы, ул. Назарбаева 123, офис 45'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="font-medium">{storeInfo?.phone || '+7 (727) 123-45-67'}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Режим работы</p>
                  <p className="text-sm text-gray-600">Пн-Пт 9:00-18:00, Сб 10:00-16:00</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Самовывоз бесплатно
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Заказ будет готов через 15-30 минут после подтверждения
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Customer Info Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Данные получателя</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Имя и фамилия</label>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}`.trim() : 'Гость'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Номер телефона</label>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium text-gray-900">
                  {user?.phone || '+77771234567'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Способ оплаты
            </h4>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'cash' 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <svg className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="text-left">
                  <div className="font-medium">Наличными</div>
                  <div className="text-sm text-gray-500">При получении</div>
                </div>
                {paymentMethod === 'cash' && (
                  <div className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Выбрано
                  </div>
                )}
              </button>

              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg opacity-50 cursor-not-allowed border-gray-200 bg-gray-50">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div className="text-left">
                  <div className="font-medium">Картой онлайн</div>
                  <div className="text-sm text-gray-500">Скоро будет доступно</div>
                </div>
                <div className="ml-auto bg-gray-300 text-gray-600 text-xs px-2 py-1 rounded-full">
                  Скоро
                </div>
              </div>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Комментарий к заказу (опционально)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Укажите особые пожелания или комментарии"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Итого к заказу</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Стоимость товаров:</span>
                <span>₸{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Самовывоз:</span>
                <span>Бесплатно</span>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between font-bold text-xl">
                  <span>Итого к оплате:</span>
                  <span className="text-blue-600">₸{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Оформляем..." : "Подтвердить заказ"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface CartBackendProps {
  CartTrigger: React.ReactNode;
  className?: string;
}

export function CartBackend({ CartTrigger, className }: CartBackendProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<"cart" | "order" | "receipt">("cart");
  const [orderData, setOrderData] = React.useState<any>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  const { 
    items, 
    itemCount, 
    subtotal, 
    loading, 
    error, 
    updateQuantity, 
    removeItem,
    clearCart 
  } = useCartBackend();

  const { user } = useAuth();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const id = parseInt(itemId);
    if (!isNaN(id)) {
      await updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const id = parseInt(itemId);
    if (!isNaN(id)) {
      await removeItem(id);
    }
  };

  const handleProceedToOrder = () => {
    console.log("handleProceedToOrder called, switching to order view");
    setCurrentView("order");
  };

  const handleOrderSubmit = async (formData: any) => {
    setIsSubmittingOrder(true);
    try {
      console.log('handleOrderSubmit formData:', formData); // debug
      const orderRequest: CreateOrderRequest = {
        customerName: formData.name,
        customerPhone: formData.phone,
        contactPhone: formData.phone,
        paymentMethod: formData.paymentMethod === "cash" ? "CASH" : "CARD",
        comment: formData.comment,
        pickupTime: formData.pickupTime,
        deliveryNotes: formData.comment
      };

      // Debug: check if method exists
      console.log('apiClient:', apiClient);
      console.log('createOrderFromCart method:', apiClient.createOrderFromCart);
      console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(apiClient)));

      // Create order from cart via API
      const createdOrder = await apiClient.createOrderFromCart(orderRequest);
      
      // Prepare order data for display
      const order = {
        orderId: createdOrder.orderNumber,
        id: createdOrder.id,
        items: createdOrder.items.map(item => ({
          id: item.id,
          name: item.productName,
          price: item.price,
          quantity: item.quantity,
          image: '/placeholder-food.jpg', // Default image since API doesn't return it
        })),
        subtotal: createdOrder.subtotal,
        total: createdOrder.total,
        paymentMethod: createdOrder.paymentMethod === "CASH" ? "Наличными при получении" : "Банковской картой",
        customerInfo: {
          name: createdOrder.customerName,
          phone: createdOrder.customerPhone,
          pickupTime: createdOrder.pickupTime,
        },
        comment: createdOrder.comment,
        status: createdOrder.status,
        createdAt: createdOrder.createdAt
      };
      
      setOrderData(order);
      setCurrentView("receipt");
      
      // Clear cart after successful order
      setTimeout(() => {
        clearCart();
      }, 1000);
      
    } catch (error) {
      console.error("Error creating order:", error);
      // Handle error (show toast, etc.)
      alert(`Ошибка при создании заказа: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleOrderCancel = useCallback(() => {
    setCurrentView("cart");
  }, []);

  const handleReceiptClose = useCallback(() => {
    setCurrentView("cart");
    setIsOpen(false);
    setOrderData(null);
  }, []);

  const handleContinueShopping = useCallback(() => {
    setCurrentView("cart");
    setIsOpen(false);
    setOrderData(null);
  }, []);

  if (!isMounted) {
    return CartTrigger;
  }

  const CartContent = () => {
    console.log("CartContent rendering, currentView:", currentView);
    if (currentView === "order") {
      return (
        <OrderForm
          subtotal={subtotal}
          total={subtotal}
          onSubmit={handleOrderSubmit}
          onCancel={handleOrderCancel}
          loading={isSubmittingOrder}
          items={items}
        />
      );
    }

    // Order receipt view
    if (currentView === "receipt" && orderData) {
      return (
        <OrderReceipt
          orderId={orderData.orderId}
          items={orderData.items}
          subtotal={orderData.subtotal}
          total={orderData.total}
          paymentMethod={orderData.paymentMethod}
          customerInfo={orderData.customerInfo}
          comment={orderData.comment}
          status={orderData.status}
          createdAt={orderData.createdAt}
          onClose={handleReceiptClose}
          onContinueShopping={handleContinueShopping}
        />
      );
    }

    // Default cart view
    return (
      <>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold">Корзина</h3>
              <p className="text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'товар' : itemCount < 5 ? 'товара' : 'товаров'}
              </p>
            </div>
            {items && items.length > 0 && (
              <Button
                onClick={clearCart}
                size="sm"
                variant="ghost"
                disabled={loading}
              >
                Очистить
              </Button>
            )}
          </div>

          {error && (
            <div className="px-6 py-4 bg-destructive/10 border-b">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {loading && (!items || items.length === 0) ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !items || items.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-center text-muted-foreground">
                  Ваша корзина пуста
                </p>
                <p className="mt-1 text-center text-sm text-muted-foreground">
                  Добавьте товары для оформления заказа
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Out of Stock Manager */}
                <OutOfStockManager />
                
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center space-x-4 p-2 rounded-lg border bg-card"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded">
                        <Image
                          alt={item.name || 'Product'}
                          className="object-cover"
                          fill
                          sizes="64px"
                          src={item.image || '/placeholder-food.jpg'}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          ₸{item.price?.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleUpdateQuantity(String(item.id), (item.quantity || 1) - 1)}
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          disabled={loading}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          onClick={() => handleUpdateQuantity(String(item.id), (item.quantity || 1) + 1)}
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          disabled={loading}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleRemoveItem(String(item.id))}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          disabled={loading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {items && items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex items-center justify-between text-base font-medium">
                <span>Итого:</span>
                <span>₸{subtotal.toFixed(2)}</span>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                disabled={loading}
                onClick={handleProceedToOrder}
              >
                Оформить заказ
              </Button>
              <Link href="/products">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={() => setIsOpen(false)}
                >
                  Продолжить покупки
                </Button>
              </Link>
            </div>
          )}
        </div>
      </>
    );
  };

  if (isDesktop) {
    return (
      <div className={cn("relative", className)}>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>{CartTrigger}</SheetTrigger>
          <SheetContent className={cn(
            "w-full sm:max-w-lg",
            currentView === "order" ? "sm:max-w-2xl" : ""
          )}>
            <SheetHeader className="sr-only">
              <SheetTitle>Корзина</SheetTitle>
            </SheetHeader>
            <div className="h-full">
              <CartContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{CartTrigger}</DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Корзина</DrawerTitle>
            <DrawerDescription>Товары в корзине</DrawerDescription>
          </DrawerHeader>
          <div className="h-full">
            <CartContent />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
