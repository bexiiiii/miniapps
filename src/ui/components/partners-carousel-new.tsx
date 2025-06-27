"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "~/lib/cn";
import { partnersData, partnersStats, type Partner } from "~/data/partners";

interface PartnersCarouselProps {
  className?: string;
}

export function PartnersCarousel({ className }: PartnersCarouselProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Дублируем массив партнеров для бесконечной прокрутки
  const duplicatedPartners = [...partnersData, ...partnersData, ...partnersData];

  useEffect(() => {
    // Симуляция загрузки
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className={cn("py-16 bg-white", className)}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            <div className="h-8 bg-gray-100 rounded w-64 mx-auto animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-96 mx-auto animate-pulse" />
            <div className="flex gap-4 justify-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-20 h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 bg-white", className)}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Заголовок в стиле Pleep */}
        <div className="text-center mb-12 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight"
          >
            {partnersData.length}+ заведений уже с нами
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto"
          >
            Проверенные партнеры с высоким качеством продуктов и сервиса
          </motion.p>
        </div>

        {/* Логотипы партнеров в стиле Pleep */}
        <div className="relative overflow-hidden">
          <motion.div
            animate={{
              x: [0, -100 * 8] // 8 логотипов видимых одновременно
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
            className="flex gap-8 items-center mb-12"
          >
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 w-20 h-12 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={80}
                  height={48}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Статистика в стиле Pleep */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {/* Статистика 1 */}
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-gray-900">
              +{partnersStats.totalPartners}
            </div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">
              Заведений
            </div>
            <div className="text-sm text-gray-500 leading-relaxed">
              Каждое проходит проверку качества
            </div>
          </div>

          {/* Статистика 2 */}
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-gray-900">
              {partnersStats.averageRating}
            </div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">
              Средний рейтинг
            </div>
            <div className="text-sm text-gray-500 leading-relaxed">
              Основано на отзывах клиентов
            </div>
          </div>

          {/* Статистика 3 */}
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-gray-900">
              {partnersStats.coverage}
            </div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">
              Доступность
            </div>
            <div className="text-sm text-gray-500 leading-relaxed">
              Продукты всегда свежие
            </div>
          </div>
        </motion.div>

        {/* Отзыв в стиле Pleep */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              "FoodSave помог нам сократить пищевые отходы на 40% и привлечь новых клиентов. 
              Теперь наши продукты находят своих покупателей, а не попадают в мусор."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">М</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Мария Козлова</div>
                <div className="text-sm text-gray-600">Владелец кафе "Зеленый чай"</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA в стиле Pleep */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200">
            Стать партнером
          </button>
        </motion.div>
      </div>
    </section>
  );
}
