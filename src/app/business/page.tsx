import { Phone, MessageCircle, TrendingUp, TrendingDown, Users, Leaf, BarChart3, Zap, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/ui/primitives/card";
import { Button } from "~/ui/primitives/button";
import { Badge } from "~/ui/primitives/badge";
import Link from "next/link";

export default function BusinessPage() {
  return (
    <main className="flex min-h-screen flex-col gap-y-16 bg-gradient-to-b from-muted/50 via-muted/25 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="bg-grid-black/[0.02] absolute inset-0 bg-[length:20px_20px]" />
        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-lime-500 text-white px-4 py-2">
              Для бизнеса
            </Badge>
            <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-lime-500 sm:text-5xl md:text-6xl lg:leading-[1.1]">
              Превратите списание в прибыль — с FoodSave!
            </h1>
            <p className="mt-6 max-w-4xl mx-auto text-lg text-muted-foreground md:text-xl leading-relaxed">
              Каждый день кафе, пекарни, рестораны и магазины теряют деньги на списании качественных продуктов. 
              Вместо того чтобы утилизировать еду, вы можете продать её с выгодой и привлечь новых клиентов.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-lime-500 md:text-4xl">
              Что мы предлагаем
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-lime-500 mx-auto" />
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="rounded-2xl border-none bg-background shadow transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lime-500">
                  <CheckCircle className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Платформа FoodSave</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Позволяет вам выставлять продукты с истекающим сроком годности в формате "боксов" со скидкой 50%+.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none bg-background shadow transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lime-500">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Автоматизация</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Всё просто — вы публикуете бокс, мы уведомляем потребителей и помогаем продать за считанные часы.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none bg-background shadow transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lime-500">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Аналитика и AI-инструменты</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Отслеживайте выручку, спрос, возвраты и улучшайте закупки с помощью наших отчётов.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none bg-background shadow transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lime-500">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Гибкая модель оплаты</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Первые 50 партнёров — пожизненно бесплатно, далее — прозрачная модель подписки и 15% комиссия с каждой продажи.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-muted/50 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-lime-500 md:text-4xl">
              Почему это выгодно вам
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-lime-500 mx-auto" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-2xl border-none bg-background shadow transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lime-500">
                  <TrendingDown className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Уменьшите списания</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Сократите потери и списания продуктов
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none bg-background shadow transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lime-500">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Увеличьте выручку</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Увеличьте дневную выручку без дополнительных затрат
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none bg-background shadow transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lime-500">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Новые клиенты</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Привлеките новых лояльных клиентов через экосистему FoodSave
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none bg-background shadow transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lime-500">
                  <Leaf className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Экология</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Делайте вклад в устойчивое развитие и снизьте углеродный след
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-lime-500 md:text-4xl">
              Уже с нами
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-lime-500 mx-auto" />
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
              Пекарни, кофейни, отели и супермаркеты по всему Казахстану, которые экономят на логистике и зарабатывают на списании.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6 rounded-2xl bg-background shadow-sm">
              <div className="text-3xl font-bold text-lime-500 mb-2">50+</div>
              <div className="text-muted-foreground">Партнёров</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-background shadow-sm">
              <div className="text-3xl font-bold text-lime-500 mb-2">70%</div>
              <div className="text-muted-foreground">Средняя скидка</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-background shadow-sm">
              <div className="text-3xl font-bold text-lime-500 mb-2">24/7</div>
              <div className="text-muted-foreground">Поддержка</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-background shadow-sm">
              <div className="text-3xl font-bold text-lime-500 mb-2">15%</div>
              <div className="text-muted-foreground">Комиссия</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl bg-primary/10 p-8 shadow-lg md:p-12">
            <div className="bg-grid-white/[0.05] absolute inset-0 bg-[length:16px_16px]" />
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-lime-500 md:text-4xl">
                Готовы начать зарабатывать на списании?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Присоединяйтесь к первым 50 партнёрам и получите пожизненный бесплатный доступ к платформе FoodSave
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="https://t.me/FoodSave_kz" target="_blank" rel="noopener noreferrer">
                  <Button className="h-12 px-8 transition-colors duration-200" size="lg" variant="outline">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Написать в Telegram
                  </Button>
                </Link>
                <Link href="https://wa.me/77085143243?text=Здравствуйте! Хочу стать партнёром FoodSave и зарабатывать на списании продуктов" target="_blank" rel="noopener noreferrer">
                  <Button className="h-12 px-8 transition-colors duration-200 bg-lime-500 hover:bg-lime-600" size="lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Связаться по WhatsApp
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
