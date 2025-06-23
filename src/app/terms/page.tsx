"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "~/ui/primitives/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/ui/primitives/card";

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <section className="py-8 border-b">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/auth/sign-up">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Пользовательское соглашение</h1>
              <p className="text-muted-foreground mt-1">
                Действует с 15 июня 2025 года
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 flex-1">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            
            <Card>
              <CardHeader>
                <CardTitle>1. Общие положения</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Настоящее Пользовательское соглашение (далее - "Соглашение") регулирует использование 
                  платформы FoodSave (далее - "Платформа", "Сервис") для заказа продуктов питания 
                  со скидкой от партнерских заведений.
                </p>
                <p>
                  Используя Платформу, вы (далее - "Пользователь") соглашаетесь с условиями данного Соглашения.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Описание услуг</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  FoodSave предоставляет платформу для размещения предложений от ресторанов, кафе, 
                  пекарен и других заведений общественного питания (далее - "Партнеры") о продаже 
                  продуктов питания со скидкой.
                </p>
                <p>
                  Платформа выступает исключительно в роли посредника между Пользователями и Партнерами.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">3. ВАЖНО: Ограничение ответственности</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">⚠️ ВНИМАНИЕ:</h4>
                  <p className="text-red-700 font-medium">
                    FoodSave НЕ НЕСЕТ НИКАКОЙ ОТВЕТСТВЕННОСТИ за качество, безопасность и 
                    последствия употребления продуктов питания, приобретенных через Платформу.
                  </p>
                </div>
                <p>
                  <strong>Пользователь понимает и соглашается с тем, что:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Вся ответственность за качество, свежесть, безопасность и соответствие 
                    санитарным нормам продуктов питания лежит исключительно на Партнере-продавце.
                  </li>
                  <li>
                    В случае пищевого отравления, аллергических реакций или любых других 
                    негативных последствий от употребления продуктов, ответственность несет 
                    исключительно заведение, где был приобретен продукт.
                  </li>
                  <li>
                    FoodSave не проводит проверку качества продуктов и не гарантирует их безопасность.
                  </li>
                  <li>
                    Все претензии по качеству продуктов должны направляться напрямую к Партнеру.
                  </li>
                  <li>
                    Пользователь самостоятельно оценивает риски при покупке продуктов со скидкой 
                    и употребляет их на свой страх и риск.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Обязанности сторон</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">Пользователь обязуется:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Предоставлять достоверную информацию при регистрации</li>
                  <li>Не нарушать права третьих лиц</li>
                  <li>Соблюдать условия данного Соглашения</li>
                  <li>Самостоятельно проверять качество и срок годности приобретаемых продуктов</li>
                </ul>
                
                <h4 className="font-semibold mt-4">FoodSave обязуется:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Обеспечивать функционирование Платформы</li>
                  <li>Защищать персональные данные в соответствии с политикой конфиденциальности</li>
                  <li>Предоставлять техническую поддержку</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Порядок оплаты и возврата</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Оплата производится через Платформу. Возврат средств возможен только в случаях, 
                  предусмотренных настоящим Соглашением и при согласии Партнера.
                </p>
                <p>
                  FoodSave может удерживать комиссию за обработку платежей в соответствии с тарифами.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Персональные данные</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Обработка персональных данных осуществляется в соответствии с 
                  <Link href="/privacy" className="text-primary hover:underline mx-1">
                    Политикой конфиденциальности
                  </Link>
                  FoodSave.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Заключительные положения</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Настоящее Соглашение может быть изменено FoodSave в одностороннем порядке. 
                  Уведомление об изменениях размещается на сайте.
                </p>
                <p>
                  Споры разрешаются в соответствии с законодательством Республики Казахстан.
                </p>
                <p>
                  Если у вас есть вопросы по данному Соглашению, обращайтесь по адресу: 
                  <a href="mailto:legal@foodsave.com" className="text-primary hover:underline ml-1">
                    legal@foodsave.com
                  </a>
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </main>
  );
}
