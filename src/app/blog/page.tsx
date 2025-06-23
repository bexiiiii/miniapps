"use client";

import { Calendar, Clock, User, ArrowRight, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "~/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/primitives/card";
import { Badge } from "~/ui/primitives/badge";

const blogPosts = [
  {
    id: 1,
    title: "Как FoodSave помогает сократить пищевые отходы на 40%",
    excerpt: "Изучаем влияние нашей платформы на сокращение пищевых отходов и создание более устойчивой экосистемы питания.",
    content: "Пищевые отходы — одна из главных экологических проблем современности...",
    author: "Анна Иванова",
    publishedAt: "2025-06-15",
    readTime: "5 мин",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60",
    category: "Экология",
    isFeatured: true,
    tags: ["экология", "пищевые отходы", "устойчивость"]
  },
  {
    id: 2,
    title: "Топ-5 ресторанов Алматы для экономных гурманов",
    excerpt: "Обзор лучших заведений, где можно попробовать изысканную кухню по доступным ценам через FoodSave.",
    content: "Качественная еда не обязательно должна быть дорогой...",
    author: "Максим Петров",
    publishedAt: "2025-06-12",
    readTime: "7 мин",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
    category: "Рестораны",
    isFeatured: false,
    tags: ["рестораны", "алматы", "гурман"]
  },
  {
    id: 3,
    title: "Интервью с основателем: от идеи до платформы",
    excerpt: "История создания FoodSave — о том, как простая идея превратилась в технологическую платформу.",
    content: "Все началось с простого наблюдения...",
    author: "Елена Козлова",
    publishedAt: "2025-06-10",
    readTime: "8 мин",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60",
    category: "Компания",
    isFeatured: true,
    tags: ["интервью", "история", "стартап"]
  },
  {
    id: 4,
    title: "Технологии, которые изменяют индустрию питания",
    excerpt: "Обзор современных технологий, которые помогают ресторанам и потребителям взаимодействовать более эффективно.",
    content: "Цифровая трансформация не обошла стороной и индустрию питания...",
    author: "Дмитрий Сидоров",
    publishedAt: "2025-06-08",
    readTime: "6 мин",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60",
    category: "Технологии",
    isFeatured: false,
    tags: ["технологии", "инновации", "digital"]
  },
  {
    id: 5,
    title: "Как пекарни увеличивают прибыль с помощью FoodSave",
    excerpt: "Кейс-стади: как партнерство с FoodSave помогло пекарням увеличить выручку на 25%.",
    content: "Пекарни сталкиваются с уникальными вызовами...",
    author: "Анна Иванова",
    publishedAt: "2025-06-05",
    readTime: "4 мин",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60",
    category: "Кейсы",
    isFeatured: false,
    tags: ["пекарни", "бизнес", "кейс"]
  },
  {
    id: 6,
    title: "Гид по здоровому питанию: как экономить и есть полезно",
    excerpt: "Практические советы по составлению здорового рациона с использованием боксов FoodSave.",
    content: "Здоровое питание доступно каждому...",
    author: "Елена Козлова",
    publishedAt: "2025-06-02",
    readTime: "5 мин",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60",
    category: "Здоровье",
    isFeatured: false,
    tags: ["здоровье", "питание", "советы"]
  }
];

const categories = [
  "Все", "Экология", "Рестораны", "Компания", "Технологии", "Кейсы", "Здоровье"
];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.isFeatured);
  const regularPosts = blogPosts.filter(post => !post.isFeatured);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="bg-grid-black/[0.02] absolute inset-0 bg-[length:20px_20px]" />
        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-[1.1]">
              Блог{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                FoodSave
              </span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
              Истории, советы и инсайты о том, как технологии меняют индустрию питания 
              и помогают создавать более устойчивое будущее.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
                Рекомендуем прочесть
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      alt={post.title}
                      className="object-cover transition duration-300 group-hover:scale-105"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      src={post.image}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge>{post.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" className="p-0 h-auto font-semibold group">
                      Читать далее
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="bg-muted/50 py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Все" ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
              Все статьи
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    alt={post.title}
                    className="object-cover transition duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={post.image}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge>{post.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishedAt).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <Button variant="ghost" className="p-0 h-auto font-semibold group text-sm">
                    Читать далее
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl bg-primary/10 p-8 shadow-lg md:p-12">
            <div className="bg-grid-white/[0.05] absolute inset-0 bg-[length:16px_16px]" />
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
                Подпишитесь на обновления
              </h2>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Получайте новые статьи, инсайты и новости о FoodSave прямо на почту
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <div className="flex w-full max-w-md gap-2">
                  <input
                    type="email"
                    placeholder="Ваш email"
                    className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-sm"
                  />
                  <Button>
                    Подписаться
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Мы уважаем вашу приватность. Отписаться можно в любое время.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
