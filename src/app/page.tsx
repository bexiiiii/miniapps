"use client";

import { ArrowRight, Clock, ShoppingBag, Star, Truck, Users, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { apiClient, type Product, type Category } from "~/lib/api-client";
import United24Banner from "~/ui/components/banners/u24";
import { HeroBadge } from "~/ui/components/hero-badge";
import { ProductCard } from "~/ui/components/product-card";
import { TestimonialsSection } from "~/ui/components/testimonials/testimonials-with-marquee";
import { Button } from "~/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/primitives/card";
import { Skeleton } from "~/ui/primitives/skeleton";
import { SEOStructuredData, LocalBusinessStructuredData } from "~/ui/components/seo-structured-data";

import { testimonials } from "./mocks";

const featuresWhyChooseUs = [
  {
    description:
      "Забирай заказ в удобное время — без очередей и ожидания.",
    icon: <Truck className="h-6 w-6 text-primary" />,
    title: "Удобный самовывоз",
  },
  {
    description:
      "Твои данные защищены. Оплата проходит через надёжные сервисы.",
    icon: <ShoppingBag className="h-6 w-6 text-primary" />,
    title: "Безопасная оплата",
  },
  {
    description:
      "Есть вопрос? Напиши в WhatsApp или Telegram — ответим быстро.",
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "24/7 Поддержка клиентов",
  },
  {
    description:
      "Мы работаем только с проверенными кафе и пекарнями. Еда всегда свежая.",
    icon: <Star className="h-6 w-6 text-primary" />,
    title: "Гарантия качества",
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await apiClient.getFeaturedProducts(0, 4);
        setFeaturedProducts(response.content);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await apiClient.getCategories();
        // Use backend-provided images or fallback to defaults
        const mappedCategories: Category[] = categoriesData.map((category) => ({
          ...category,
          imageUrl: category.imageUrl || getCategoryImage(category.name)
        }));
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to mock categories if API fails
        const { categories: mockCategories } = await import('./mocks');
        const mappedMockCategories: Category[] = mockCategories.map((category, index) => ({
          id: index + 1,
          name: category.name,
          description: `${category.productCount} items available`,
          imageUrl: category.image,
          active: true,
        }));
        setCategories(mappedMockCategories);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper function to get category images
  const getCategoryImage = (categoryName: string): string => {
    const categoryImages: Record<string, string> = {
      // Tech categories
      'All Products': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60',
      'Audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
      'Wearables': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
      'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60',
      'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60',
      // Food categories (fallback)
      'Пекарня': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60',
      'Кофейня': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=60',
      'Ресторан': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60',
      'Супермаркет': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60',
      'Фастфуд': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&auto=format&fit=crop&q=60',
      'Десерты': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=60',
      'Мясо': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=60',
      'Овощи': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60',
    };
    
    return categoryImages[categoryName] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60';
  };

  // Convert API product to component format
  const convertProduct = (product: Product) => ({
    id: product.id.toString(),
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.imageUrl,
    category: product.category,
    rating: product.rating,
    inStock: product.isAvailable,
  });

  return (
    <>
      <main
        className={`
          flex min-h-screen flex-col gap-y-16 bg-gradient-to-b from-muted/50
          via-muted/25 to-background
        `}
      >
        {/* Hero Section */}
        <section
          className={`
            relative overflow-hidden py-24
            md:py-32
          `}
        >
          <div
            className={`
              bg-grid-black/[0.02] absolute inset-0
              bg-[length:20px_20px]
            `}
          />
          <div
            className={`
              relative z-10 container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <div
              className={`
                grid items-center gap-10
                lg:grid-cols-2 lg:gap-12
              `}
            >
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <HeroBadge />

                  <h1
                    className={`
                      font-display text-4xl leading-tight font-bold
                      tracking-tight text-foreground
                      sm:text-5xl
                      md:text-6xl
                      lg:leading-[1.1]
                    `}
                  >
                    Еда со скидкой до 50% —  {" "}
                    <span
                      className={`
                        bg-gradient-to-r from-primary to-primary/70 bg-clip-text
                        text-transparent
                      `}
                    >
                      рядом с вами
                    </span>
                  </h1>
                  <p
                    className={`
                      max-w-[700px] text-lg text-muted-foreground
                      md:text-xl
                    `}
                  >
                   FoodSave помогает найти вкусную еду от кафе, пекарен и магазинов, которую не успели продать.
                  </p>
                </div>
                <div
                  className={`
                    flex flex-col gap-3
                    sm:flex-row
                  `}
                >
                  <Link href="/products">
                    <Button
                      className={`
                        h-12 gap-1.5 px-8 transition-colors duration-200
                      `}
                      size="lg"
                    >
                      Shop Now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/showcase">
                    <Button
                      className="h-12 px-8 transition-colors duration-200"
                      size="lg"
                      variant="outline"
                    >
                      View Showcase
                    </Button>
                  </Link>
                </div>
                <div
                  className={`
                    flex flex-wrap gap-5 text-sm text-muted-foreground
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    <Truck className="h-5 w-5 text-primary/70" />
                    <span>Забирай заказ без доставки — быстро и бесплатно</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-5 w-5 text-primary/70" />
                    <span>Поддержка 24/7</span>
                  </div>
                </div>
              </div>
              <div
                className={`
                  relative mx-auto hidden aspect-square w-full max-w-md
                  overflow-hidden rounded-xl border shadow-lg
                  lg:block
                `}
              >
                <div
                  className={`
                    absolute inset-0 z-10 bg-gradient-to-tr from-primary/20
                    via-transparent to-transparent
                  `}
                />
                <Image
                  alt="Shopping experience"
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src="https://images.unsplash.com/photo-1624767735494-1929dc24ad43?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                />
              </div>
            </div>
          </div>
          <div
            className={`
              absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent
              via-primary/20 to-transparent
            `}
          />
        </section>

        {/* Featured Categories */}
        <section
          className={`
            py-12
            md:py-16
          `}
        >
          <div
            className={`
              container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <div className="mb-8 flex flex-col items-center text-center">
              <h2
                className={`
                  font-display text-3xl leading-tight font-bold tracking-tight
                  md:text-4xl
                `}
              >
                Shop by Category
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
              <p className="mt-4 max-w-2xl text-center text-muted-foreground">
                Discover products across all categories - from tech gadgets to everyday essentials
              </p>
            </div>
            <div
              className={`
                grid grid-cols-2 gap-4
                sm:grid-cols-3
                md:grid-cols-5 md:gap-6
              `}
            >
              {categoriesLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-0">
                        <Skeleton className="aspect-square w-full" />
                        <div className="p-3">
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : categories.map((category) => {
                    const isAllProducts = category.name === 'All Products';
                    return (
                      <Link
                        aria-label={`Browse ${category.name} products`}
                        className={`
                          group relative flex flex-col overflow-hidden
                          rounded-lg border bg-card shadow transition-all
                          duration-300
                          hover:shadow-md hover:scale-105
                          ${isAllProducts ? 'md:col-span-2 md:row-span-1' : ''}
                        `}
                        href={`/products${category.name === 'All Products' ? '' : `?category=${encodeURIComponent(category.name)}`}`}
                        key={category.id}
                      >
                        <div className={`relative overflow-hidden ${isAllProducts ? 'aspect-[2/1]' : 'aspect-square'}`}>
                          <div
                            className={`
                              absolute inset-0 z-10 bg-gradient-to-t
                              from-background/70 to-transparent
                              ${isAllProducts ? 'from-primary/20 to-transparent' : ''}
                            `}
                          />
                          <Image
                            alt={category.name}
                            className={`
                              object-cover transition duration-300
                              group-hover:scale-110
                            `}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 16vw"
                            src={category.imageUrl || '/placeholder.svg'}
                          />
                          {isAllProducts && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center">
                              <div className="text-center text-white">
                                <div className="text-lg font-bold mb-1">🛍️</div>
                                <div className="text-sm font-semibold">View All</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="relative z-20 p-3">
                          <div className={`text-sm font-medium text-center line-clamp-2 ${isAllProducts ? 'text-primary' : ''}`}>
                            {category.name}
                          </div>
                          {category.description && (
                            <p className="text-xs text-muted-foreground text-center mt-1 line-clamp-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })
              }
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section
          className={`
            bg-muted/50 py-12
            md:py-16
          `}
        >
          <div
            className={`
              container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <div className="mb-8 flex flex-col items-center text-center">
              <h2
                className={`
                  font-display text-3xl leading-tight font-bold tracking-tight
                  md:text-4xl
                `}
              >
                Самое вкусное сейчас
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
              <p className="mt-4 max-w-2xl text-center text-muted-foreground">
                 Боксы, которые выбирают чаще всего
              </p>
            </div>
            <div
              className={`
                grid grid-cols-1 gap-6
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              `}
            >
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="aspect-square w-full mb-4" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))
                : featuredProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={convertProduct(product)} />
                  ))
              }
            </div>
            <div className="mt-10 flex justify-center">
              <Link href="/products">
                <Button className="group h-12 px-8" size="lg" variant="outline">
                  Смотреть все боксы
                  <ArrowRight
                    className={`
                      ml-2 h-4 w-4 transition-transform duration-300
                      group-hover:translate-x-1
                    `}
                  />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* B2B Section */}
        <section
          className={`
            py-12
            md:py-16
          `}
        >
          <div
            className={`
              container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <div className="mb-8 flex flex-col items-center text-center">
              <h2
                className={`
                  font-display text-3xl leading-tight font-bold tracking-tight
                  sm:text-4xl
                  lg:text-5xl
                `}
              >
                Для бизнес-клиентов
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
              <p className="mt-4 max-w-2xl text-center text-muted-foreground">
                Оптовые поставки продуктов со скидкой для ресторанов, кафе и магазинов
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Оптовые цены</h3>
                  <p className="text-sm text-muted-foreground">
                    Скидки до 70% на большие объемы продукции
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Доставка</h3>
                  <p className="text-sm text-muted-foreground">
                    Бесплатная доставка от 50,000 ₸
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Персональный менеджер</h3>
                  <p className="text-sm text-muted-foreground">
                    Индивидуальный подход к каждому клиенту
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <p className="mb-6 text-muted-foreground">
                Свяжитесь с нами для обсуждения условий сотрудничества
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://t.me/foodsave_b2b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    inline-flex items-center justify-center gap-2 rounded-lg
                    border border-border bg-background px-6 py-3 text-sm font-medium
                    transition-all duration-200 hover:bg-accent hover:text-accent-foreground
                    hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  `}
                >
                  <MessageCircle className="h-4 w-4" />
                  Telegram
                </a>
                <a
                  href="https://wa.me/77771234567?text=Здравствуйте! Интересует сотрудничество по программе B2B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    inline-flex items-center justify-center gap-2 rounded-lg
                    bg-primary px-6 py-3 text-sm font-medium text-primary-foreground
                    transition-all duration-200 hover:bg-primary/90 hover:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  `}
                >
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className={`
            py-12
            md:py-16
          `}
          id="features"
        >
          <div
            className={`
              container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <div className="mb-8 flex flex-col items-center text-center">
              <h2
                className={`
                  font-display text-3xl leading-tight font-bold tracking-tight
                  md:text-4xl
                `}
              >
                Почему выбирают FoodSave
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
              <p
                className={`
                  mt-4 max-w-2xl text-center text-muted-foreground
                  md:text-lg
                `}
              >
                Мы делаем экономию вкусной, быстрой и удобной — каждый день.
              </p>
            </div>
            <div
              className={`
                grid gap-8
                md:grid-cols-2
                lg:grid-cols-4
              `}
            >
              {featuresWhyChooseUs.map((feature) => (
                <Card
                  className={`
                    rounded-2xl border-none bg-background shadow transition-all
                    duration-300
                    hover:shadow-lg
                  `}
                  key={feature.title}
                >
                  <CardHeader className="pb-2">
                    <div
                      className={`
                        mb-3 flex h-12 w-12 items-center justify-center
                        rounded-full bg-primary/10
                      `}
                    >
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          className={`
            bg-muted/50 py-12
            md:py-16
          `}
        >
          <div
            className={`
              container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <TestimonialsSection
              className="py-0"
              description="Не только мы — послушайте тех, кто уже экономит и ест вкусно с FoodSave."
              testimonials={testimonials}
              title="Что говорят наши пользователи"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section
          className={`
            py-12
            md:py-16
          `}
        >
          <div
            className={`
              container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <div
              className={`
                relative overflow-hidden rounded-xl bg-primary/10 p-8 shadow-lg
                md:p-12
              `}
            >
              <div
                className={`
                  bg-grid-white/[0.05] absolute inset-0
                  bg-[length:16px_16px]
                `}
              />
              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <h2
                  className={`
                    font-display text-3xl leading-tight font-bold tracking-tight
                    md:text-4xl
                  `}
                >
                   Готовы попробовать FoodSave?
                </h2>
                <p
                  className={`
                    mt-4 text-lg text-muted-foreground
                    md:text-xl
                  `}
                >
                  Присоединяйся к тем, кто уже получает свежие блюда со скидкой до 50%. Бронируй боксы рядом — пока не расхватали.
                </p>
                <div
                  className={`
                    mt-6 flex flex-col items-center justify-center gap-3
                    sm:flex-row
                  `}
                >
                  <Link href="/auth/sign-up">
                    <Button
                      className="h-12 px-8 transition-colors duration-200"
                      size="lg"
                    >
                      Зарегистрироваться
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button
                      className="h-12 px-8 transition-colors duration-200"
                      size="lg"
                      variant="outline"
                    >
                      Посмотреть боксы
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sample banner */}
        <United24Banner animateGradient={false} />
        
        {/* SEO Structured Data */}
        <SEOStructuredData type="website" />
        <LocalBusinessStructuredData />
      </main>
    </>
  );
}
