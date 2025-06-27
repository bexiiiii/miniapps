"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/cn";
import { partnersData, partnersStats, type Partner } from "~/data/partners";
import { Card, CardContent } from "~/ui/primitives/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/ui/primitives/tooltip";
import { Badge } from "~/ui/primitives/badge";
import { Skeleton } from "~/ui/primitives/skeleton";

interface PartnersCarouselAdvancedProps {
  className?: string;
  showStats?: boolean;
  autoPlay?: boolean;
  speed?: number;
}

export function PartnersCarouselAdvanced({ 
  className, 
  showStats = true, 
  autoPlay = true, 
  speed = 30 
}: PartnersCarouselAdvancedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  // Дублируем массив партнеров для бесконечной прокрутки
  const duplicatedPartners = [...partnersData, ...partnersData];

  useEffect(() => {
    // Симуляция загрузки
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className={cn("py-16 bg-gray-50", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="flex gap-8 justify-center mb-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-32 h-20 rounded-xl" />
            ))}
          </div>
          {showStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <TooltipProvider>
      <section className={cn("py-16 bg-gray-50 relative overflow-hidden", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-4 flex-wrap"
            >
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl tracking-tight">
                Наши партнеры
              </h2>
              <Badge variant="secondary" className="bg-lime-100 text-lime-700 hover:bg-lime-200 transition-colors">
                {partnersData.length}+ заведений
              </Badge>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Проверенные заведения с качественной едой и высокими стандартами обслуживания
            </motion.p>
          </div>

          {/* Бесконечно прокручивающиеся логотипы */}
          <div className="relative mb-8">
            {/* Градиентные маски по краям */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
            
            <div 
              className="flex overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <motion.div
                animate={autoPlay && !isPaused ? {
                  x: [0, -100 * partnersData.length]
                } : {}}
                transition={autoPlay && !isPaused ? {
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: speed,
                    ease: "linear",
                  },
                } : {}}
                className="flex gap-8 items-center"
              >
                <AnimatePresence>
                  {duplicatedPartners.map((partner, index) => (
                    <motion.div
                      key={`${partner.id}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex-shrink-0">
                            <Card className="w-32 h-20 group cursor-pointer hover:shadow-xl transition-all duration-300 border-gray-200/50 hover:border-lime-400/70 bg-white/80 backdrop-blur-sm">
                              <CardContent className="p-4 h-full flex items-center justify-center">
                                <div className="relative overflow-hidden rounded-lg">
                                  <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    width={96}
                                    height={60}
                                    className="object-contain max-w-full max-h-full grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-gray-900 text-white border-gray-800 shadow-xl">
                          <div className="text-center">
                            <p className="font-medium">{partner.name}</p>
                            <p className="text-xs text-gray-300">{partner.category}</p>
                            <div className="flex items-center gap-1 mt-1 justify-center">
                              <span className="text-yellow-400">★</span>
                              <span className="text-xs">{partner.rating}</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
            
            {/* Индикатор паузы */}
            <AnimatePresence>
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm rounded-full p-2 z-20"
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Статистика */}
          {showStats && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card className="text-center group hover:shadow-xl transition-all duration-300 border-gray-200/50 hover:border-lime-400/70 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-lime-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                      {partnersStats.totalPartners}+
                    </div>
                    <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Заведений</div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card className="text-center group hover:shadow-xl transition-all duration-300 border-gray-200/50 hover:border-lime-400/70 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-lime-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                      {partnersStats.coverage}
                    </div>
                    <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Доступность</div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card className="text-center group hover:shadow-xl transition-all duration-300 border-gray-200/50 hover:border-lime-400/70 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-lime-500 mb-2 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center gap-1">
                      {partnersStats.averageRating}<span className="text-yellow-400">★</span>
                    </div>
                    <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Рейтинг</div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card className="text-center group hover:shadow-xl transition-all duration-300 border-gray-200/50 hover:border-lime-400/70 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-lime-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                      {partnersStats.qualityControl}
                    </div>
                    <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Качество</div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </TooltipProvider>
  );
}
