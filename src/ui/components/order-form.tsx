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
  items?: Array<{ storeId?: string }>;
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
        // Get storeId from first item in cart
        const firstItem = items?.[0];
        const storeId = firstItem?.storeId;
        
        if (storeId) {
          console.log('Fetching store info for storeId:', storeId);
          const storeData = await apiClient.getStoreById(Number(storeId));
          setStoreInfo(storeData);
        } else {
          // Fallback to store 10
          console.log('No storeId found, using store ID 10 as fallback');
          const storeData = await apiClient.getStoreById(10);
          setStoreInfo(storeData);
        }
      } catch (error) {
        console.error('Error fetching store info:', error);
        // Set default store info if API fails
        setStoreInfo({
          id: '10',
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

  const getWorkingHours = useCallback(() => {
    if (storeInfo?.openingHours && storeInfo?.closingHours) {
      return `Пн-Пт ${storeInfo.openingHours}-${storeInfo.closingHours}, Сб 10:00-16:00`;
    }
    return "Пн-Пт 9:00-18:00, Сб 10:00-16:00";
  }, [storeInfo?.openingHours, storeInfo?.closingHours]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-white/60 px-4 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к корзине
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Оформление заказа</h1>
            <p className="text-slate-600 mt-1">Заполните данные для самовывоза</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Store Info & Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Store Info Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden">
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
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="border-b border-slate-100 pb-6">
                <CardTitle className="flex items-center gap-3 text-slate-900 text-2xl">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  Ваши данные
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold text-base">Имя и фамилия</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Введите ваше имя" 
                                className="h-14 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
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
                            <FormLabel className="text-slate-700 font-semibold text-base">Номер телефона</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+7XXXXXXXXXX" 
                                className="h-14 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="bg-slate-200" />

                    <div className="space-y-6">
                      <h3 className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                        <div className="p-3 bg-green-100 rounded-xl">
                          <CreditCard className="w-6 h-6 text-green-600" />
                        </div>
                        Способ оплаты
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="grid gap-5">
                                <div 
                                  className={cn(
                                    "relative flex items-center gap-5 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200",
                                    field.value === "cash" 
                                      ? "border-emerald-500 bg-emerald-50 shadow-lg ring-4 ring-emerald-500/20" 
                                      : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
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
                                    field.value === "cash" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"
                                  )}>
                                    <Banknote className="w-8 h-8" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-bold text-lg text-slate-900">Наличными</div>
                                    <div className="text-slate-600 mt-1">
                                      При получении заказа
                                    </div>
                                  </div>
                                  {field.value === "cash" && (
                                    <Badge className="bg-emerald-500 text-white px-4 py-2 text-sm">
                                      Выбрано
                                    </Badge>
                                  )}
                                </div>

                                <div className="relative flex items-center gap-5 p-6 border-2 rounded-2xl opacity-60 cursor-not-allowed border-slate-200 bg-slate-50">
                                  <div className="p-4 bg-slate-200 rounded-xl">
                                    <CreditCard className="w-8 h-8 text-slate-400" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-bold text-lg text-slate-500">Картой онлайн</div>
                                    <div className="text-slate-400 mt-1">
                                      Скоро будет доступно
                                    </div>
                                  </div>
                                  <Badge variant="secondary" className="bg-slate-200 text-slate-600 px-4 py-2">
                                    Скоро
                                  </Badge>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-base">
                            Комментарий к заказу (опционально)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Укажите особые пожелания или комментарии к заказу"
                              className="min-h-[120px] text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
                <CardHeader className="border-b border-slate-100 pb-6">
                  <CardTitle className="text-2xl text-slate-900">Итого к заказу</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-slate-700">Стоимость товаров:</span>
                      <span className="font-semibold">₸{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg text-emerald-600">
                      <span>Самовывоз:</span>
                      <span className="font-semibold">Бесплатно</span>
                    </div>
                    <Separator className="bg-slate-200" />
                    <div className="flex justify-between items-center font-bold text-2xl">
                      <span className="text-slate-900">Итого к оплате:</span>
                      <span className="text-emerald-600">₸{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-6 space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      className="w-full h-14 text-base border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                      size="lg"
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      onClick={form.handleSubmit(onSubmit)}
                      className="w-full h-14 text-base bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg"
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
                  </div>

                  <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-2xl">
                    <p className="text-blue-800 font-semibold mb-3">
                      💡 Полезная информация
                    </p>
                    <ul className="text-blue-700 text-sm space-y-2">
                      <li>• Заказ резервируется на 2 часа</li>
                      <li>• При опоздании более чем на 30 минут заказ может быть отменен</li>
                      <li>• При получении необходим документ, удостоверяющий личность</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
