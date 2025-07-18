"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Phone, Store, User, CreditCard, Banknote, CheckCircle, Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "~/lib/auth-context";
import { apiClient, type StoreInfo } from "~/lib/api-client";
import { cn } from "~/lib/cn";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/ui/primitives/form";
import { Input } from "~/ui/primitives/input";
import { Textarea } from "~/ui/primitives/textarea";
import { Badge } from "~/ui/primitives/badge";
import { Separator } from "~/ui/primitives/separator";

const orderFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().regex(/^\+7\d{10}$/, "Введите корректный номер телефона (+7XXXXXXXXXX)"),
  paymentMethod: z.enum(["cash", "card"], {
    required_error: "Выберите способ оплаты",
  }),
  comment: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  subtotal: number;
  total: number;
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  items?: Array<{ 
    id?: string | number;
    storeId?: string | number; 
    store_id?: string | number;
    store?: { id?: string | number };
    [key: string]: any;
  }>;
}

export function OrderForm({
  subtotal,
  total,
  onSubmit,
  onCancel,
  loading = false,
  items = [],
}: OrderFormProps) {
  const { user } = useAuth();
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [storeLoading, setStoreLoading] = useState(true);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      phone: "+7",
      paymentMethod: "cash",
      comment: "",
    },
  });

  // Set user data when available
  const setUserData = useCallback(() => {
    if (user?.firstName) {
      const fullName = `${user.firstName} ${user.lastName || ""}`.trim();
      form.setValue("name", fullName, { shouldValidate: false });
      if (user.phone) {
        form.setValue("phone", user.phone, { shouldValidate: false });
      }
    }
  }, [user?.firstName, user?.lastName, user?.phone, form]);

  useEffect(() => {
    setUserData();
  }, [setUserData]);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      setStoreLoading(true);
      try {
        console.log('OrderForm items:', items);
        
        // Get storeId from first item in cart
        const firstItem = items?.[0];
        console.log('OrderForm Debug - Full item structure:', firstItem);
        
        let storeId = firstItem?.storeId || firstItem?.store_id || firstItem?.store?.id;
        console.log('OrderForm Debug - Extracted storeId from item:', storeId);
        
        // If no storeId found, try to get product info and extract storeId
        if (!storeId && firstItem?.id) {
          try {
            console.log('Trying to get product info for product ID:', firstItem.id);
            const productInfo = await apiClient.getProductById(Number(firstItem.id));
            storeId = productInfo.storeId;
            console.log('OrderForm Debug - Extracted storeId from product:', storeId);
          } catch (error) {
            console.warn('Failed to get product info:', error);
          }
        }
        
        let targetStoreId = 1; // Default store ID
        
        if (storeId && !isNaN(Number(storeId))) {
          targetStoreId = Number(storeId);
        }
        
        console.log('Fetching store info for storeId:', targetStoreId);
        
        // Try different store IDs if the current one fails
        const storeIdsToTry = [targetStoreId, 1, 2, 3, 10];
        let storeData = null;
        
        for (const idToTry of storeIdsToTry) {
          try {
            console.log(`Trying to fetch store with ID: ${idToTry}`);
            storeData = await apiClient.getStoreById(idToTry);
            console.log(`Successfully fetched store data for ID ${idToTry}:`, storeData);
            break;
          } catch (storeError) {
            console.warn(`Failed to fetch store with ID ${idToTry}:`, storeError);
            continue;
          }
        }
        
        if (storeData) {
          setStoreInfo(storeData);
        } else {
          throw new Error('Failed to fetch any store data from API');
        }
      } catch (error) {
        console.error('Error fetching store info:', error);
        
        // Set default store info if API fails
        console.log('Setting fallback store info');
        setStoreInfo({
          id: 1,
          name: 'FoodSave',
          address: 'г. Алматы, ул. Назарбаева 123, офис 45',
          phone: '+7 (727) 123-45-67',
          openingHours: '09:00',
          closingHours: '18:00',
          workingHoursText: 'Пн-Пт 9:00-18:00, Сб 10:00-16:00'
        });
      } finally {
        setStoreLoading(false);
      }
    };

    fetchStoreInfo();
  }, [items]);

  const getWorkingHours = useCallback(() => {
    // Use detailed working hours if available
    if (storeInfo?.workingHours) {
      const wh = storeInfo.workingHours;
      if (wh.monday && wh.friday && wh.saturday) {
        return `Пн-Пт ${wh.monday.open}-${wh.friday.close}, Сб ${wh.saturday.open}-${wh.saturday.close}`;
      }
    }
    
    // Use workingHoursText if available
    if (storeInfo?.workingHoursText) {
      return storeInfo.workingHoursText;
    }
    
    // Use simple opening/closing hours
    if (storeInfo?.openingHours && storeInfo?.closingHours) {
      return `Пн-Пт ${storeInfo.openingHours}-${storeInfo.closingHours}, Сб 10:00-16:00`;
    }
    
    // Default fallback
    return 'Пн-Пт 9:00-18:00, Сб 10:00-16:00';
  }, [storeInfo?.openingHours, storeInfo?.closingHours, storeInfo?.workingHours, storeInfo?.workingHoursText]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl py-6 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Оформление заказа</h1>
        </div>

        <div className="space-y-6">
          {/* Store Information Section */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Store className="w-6 h-6" />
                </div>
                Точка самовывоза
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {storeLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-5 bg-white/20 rounded w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  <div className="h-4 bg-white/20 rounded w-2/3"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/20 rounded-xl mt-1">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-xl">{storeInfo?.name || 'FoodSave'}</p>
                        <p className="text-blue-100 mt-1 leading-relaxed">
                          {storeInfo?.address || 'г. Алматы, ул. Назарбаева 123, офис 45'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Phone className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-lg">
                        {storeInfo?.phone || '+7 (727) 123-45-67'}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/20 rounded-xl mt-1">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Режим работы</p>
                        <p className="text-blue-100 mt-1">
                          {getWorkingHours()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-emerald-300" />
                      <p className="font-bold text-emerald-100 text-lg">
                        Самовывоз бесплатно
                      </p>
                    </div>
                    <p className="text-emerald-200">
                      Заказ будет готов через 15-30 минут после подтверждения
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Customer Data Form */}
          <Card className="border-0 shadow-xl bg-background">
            <CardHeader className="border-b border-border pb-6">
              <CardTitle className="flex items-center gap-3 text-foreground text-2xl">
                <div className="p-3 bg-muted rounded-xl">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                Ваши данные
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold text-base">Имя и фамилия</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Введите ваше имя" 
                              className="h-14 text-base bg-background border-border focus:border-primary focus:ring-primary/20"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold text-base">Номер телефона</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+7XXXXXXXXXX" 
                              className="h-14 text-base bg-background border-border focus:border-primary focus:ring-primary/20"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="bg-border" />

                  <div className="space-y-6">
                    <h3 className="flex items-center gap-3 text-foreground font-bold text-xl">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <CreditCard className="w-6 h-6 text-primary" />
                      </div>
                      Способ оплаты
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="space-y-4">
                              <div 
                                className={cn(
                                  "relative flex items-center gap-5 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200",
                                  field.value === "cash" 
                                    ? "border-primary bg-primary/5 shadow-lg ring-4 ring-primary/20" 
                                    : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                                )}
                                onClick={() => field.onChange("cash")}
                              >
                                <input
                                  type="radio"
                                  id="cash"
                                  name="paymentMethod"
                                  value="cash"
                                  checked={field.value === "cash"}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="sr-only"
                                />
                                <div className={cn(
                                  "p-4 rounded-xl",
                                  field.value === "cash" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                )}>
                                  <Banknote className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-lg text-foreground">Наличными</div>
                                  <div className="text-muted-foreground mt-1">
                                    При получении заказа
                                  </div>
                                </div>
                                {field.value === "cash" && (
                                  <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm">
                                    Выбрано
                                  </Badge>
                                )}
                              </div>

                              <div className="relative flex items-center gap-5 p-6 border-2 rounded-2xl opacity-60 cursor-not-allowed border-border bg-muted">
                                <div className="p-4 rounded-xl bg-muted text-muted-foreground">
                                  <CreditCard className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-lg text-muted-foreground">Картой</div>
                                  <div className="text-muted-foreground mt-1">
                                    Скоро будет доступно
                                  </div>
                                </div>
                                <Badge variant="secondary" className="px-4 py-2 text-sm">
                                  Недоступно
                                </Badge>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold text-base">Комментарий к заказу</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Укажите особые пожелания или комментарии к заказу"
                              className="min-h-[120px] text-base bg-background border-border focus:border-primary focus:ring-primary/20 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Order Summary & Action Buttons */}
                  <div className="space-y-6 pt-6 border-t border-border">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-muted-foreground">Стоимость товаров:</span>
                        <span className="font-semibold">₸{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg text-primary">
                        <span>Самовывоз:</span>
                        <span className="font-semibold">Бесплатно</span>
                      </div>
                      <Separator className="bg-border" />
                      <div className="flex justify-between items-center font-bold text-2xl">
                        <span className="text-foreground">Итого к оплате:</span>
                        <span className="text-primary">₸{total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <Button
                        type="submit"
                        onClick={form.handleSubmit(onSubmit)}
                        className="w-full h-14 text-base"
                        disabled={loading}
                        size="lg"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Оформляем заказ...
                          </>
                        ) : (
                          "Подтвердить заказ"
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="w-full h-14 text-base"
                        size="lg"
                      >
                        Отмена
                      </Button>
                    </div>

                    <div className="mt-8 p-5 bg-muted/50 border border-border rounded-2xl">
                      <p className="text-foreground font-semibold mb-3">
                        💡 Полезная информация
                      </p>
                      <ul className="text-muted-foreground text-sm space-y-2">
                        <li>• Заказ резервируется на 2 часа</li>
                        <li>• При опоздании более чем на 30 минут заказ может быть отменен</li>
                        <li>• При получении необходим документ, удостоверяющий личность</li>
                      </ul>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
