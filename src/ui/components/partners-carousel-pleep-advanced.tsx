"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "~/lib/cn";
import { partnersData, partnersStats, type Partner } from "~/data/partners";

interface PartnersCarouselPleepAdvancedProps {
  className?: string;
}

export function PartnersCarouselPleepAdvanced({ className }: PartnersCarouselPleepAdvancedProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Дублируем массив партнеров для бесконечной прокрутки
  const duplicatedPartners = [...partnersData, ...partnersData, ...partnersData];

  useEffect(() => {
    // Симуляция загрузки
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className={cn("py-20 bg-white", className)}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <div className="h-10 bg-gray-100 rounded w-80 mx-auto animate-pulse" />
              <div className="h-5 bg-gray-100 rounded w-96 mx-auto animate-pulse" />
            </div>
            <div className="flex gap-6 justify-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-16 h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-12">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className="h-12 bg-gray-100 rounded w-20 mx-auto animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-24 mx-auto animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-32 mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-20 bg-white", className)}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Заголовок */}
        <div className="text-center mb-16 space-y-5">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-medium text-gray-900 leading-tight"
          >
            {partnersData.length}+ заведений доверяют FoodSave
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Мы работаем только с проверенными партнерами, которые разделяют наши ценности качества и заботы об экологии
          </motion.p>
        </div>

        {/* Логотипы партнеров */}
        <div className="relative overflow-hidden mb-16">
          <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-white to-transparent z-10" />
          
          <motion.div
            animate={{
              x: [0, -100 * 6]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
            className="flex gap-12 items-center justify-center"
          >
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 w-16 h-10 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={64}
                  height={40}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Статистика в стиле Pleep */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
        >
          {/* Статистика 1 */}
          <div className="text-center space-y-3">
            <div className="text-5xl md:text-6xl font-bold text-gray-900 leading-none">
              +{partnersStats.totalPartners}
            </div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
              Заведений-партнеров
            </div>
            <div className="text-sm text-gray-500 leading-relaxed max-w-40 mx-auto">
              Каждое прошло строгий отбор по качеству
            </div>
          </div>

          {/* Статистика 2 */}
          <div className="text-center space-y-3">
            <div className="text-5xl md:text-6xl font-bold text-gray-900 leading-none">
              {partnersStats.averageRating}
            </div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
              Средний рейтинг
            </div>
            <div className="text-sm text-gray-500 leading-relaxed max-w-40 mx-auto">
              По отзывам наших клиентов
            </div>
          </div>

          {/* Статистика 3 */}
          <div className="text-center space-y-3">
            <div className="text-5xl md:text-6xl font-bold text-gray-900 leading-none">
              {partnersStats.coverage}
            </div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
              Охват города
            </div>
            <div className="text-sm text-gray-500 leading-relaxed max-w-40 mx-auto">
              Продукты доступны везде
            </div>
          </div>
        </motion.div>

        {/* Отзыв */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 font-light">
              "Благодаря FoodSave мы сократили потери на 45% и нашли новых клиентов. 
              Платформа помогает нам заботиться об экологии и увеличивать прибыль одновременно."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-base font-medium text-gray-700">М</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 text-base">Мария Козлова</div>
                <div className="text-sm text-gray-600">Владелец кафе "Зеленый чай"</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <button className="bg-gray-900 text-white px-10 py-4 rounded-xl font-medium text-base hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-lg">
            Присоединиться к партнерам
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Регистрация займет всего 5 минут
          </p>
        </motion.div>
      </div>
    </section>
  );
}
