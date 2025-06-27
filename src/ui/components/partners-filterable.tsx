"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/cn";
import { partnersData, type Partner } from "~/data/partners";
import { Card, CardContent } from "~/ui/primitives/card";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/ui/primitives/tabs";
import { PartnersCarousel } from "./partners-carousel";

interface PartnersFilterableProps {
  className?: string;
}

export function PartnersFilterable({ className }: PartnersFilterableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Получаем уникальные категории
  const categories = useMemo(() => {
    const cats = Array.from(new Set(partnersData.map(partner => partner.category)));
    return ["all", ...cats];
  }, []);

  // Фильтруем партнеров по категории
  const filteredPartners = useMemo(() => {
    if (selectedCategory === "all") return partnersData;
    return partnersData.filter(partner => partner.category === selectedCategory);
  }, [selectedCategory]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "all": return "Все";
      case "Пекарня": return "Пекарни";
      case "Кафе": return "Кафе";
      case "Суши бар": return "Суши";
      case "Ресторан": return "Рестораны";
      case "Быстрое питание": return "Фаст-фуд";
      default: return category;
    }
  };

  return (
    <section className={cn("py-16 bg-gray-50", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4 tracking-tight"
          >
            Партнеры по категориям
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Выберите категорию для просмотра партнеров
          </motion.p>
        </div>

        {/* Фильтры */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2 bg-white/80 backdrop-blur-sm border border-gray-200/50">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-lime-500 data-[state=active]:text-white transition-all duration-300 hover:bg-lime-100 py-3 px-4 rounded-lg"
              >
                {getCategoryLabel(category)}
                <Badge 
                  variant="secondary" 
                  className="ml-2 text-xs partners-badge"
                >
                  {category === "all" ? partnersData.length : partnersData.filter(p => p.category === category).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Контент для всех категорий */}
          <TabsContent value="all" className="mt-8">
            <PartnersCarousel showStats={true} />
          </TabsContent>

          {/* Контент для остальных категорий */}
          {categories.filter(cat => cat !== "all").map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {filteredPartners.map((partner, index) => (
                    <motion.div
                      key={partner.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="group cursor-pointer partners-logo-container h-full">
                        <CardContent className="p-6">
                          <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                            />
                          </div>
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-lime-600 transition-colors">
                            {partner.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {partner.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {partner.category}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <span className="rating-star text-yellow-400">★</span>
                              <span className="text-sm font-medium">{partner.rating}</span>
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-muted-foreground">
                            <p>{partner.location}</p>
                            <p>{partner.workingHours}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Статистика для категории */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12 text-center"
              >
                <Card className="inline-block partners-stats-card">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-lime-500 mb-2">
                      {filteredPartners.length}
                    </div>
                    <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                      {getCategoryLabel(category)} в нашей сети
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
