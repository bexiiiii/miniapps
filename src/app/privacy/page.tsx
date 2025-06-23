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

export default function PrivacyPage() {
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
              <h1 className="text-3xl font-bold">Политика конфиденциальности</h1>
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
                  Настоящая Политика конфиденциальности (далее - "Политика") описывает, как FoodSave 
                  (далее - "мы", "наша компания") собирает, использует, хранит и защищает вашу 
                  персональную информацию.
                </p>
                <p>
                  Используя наши услуги, вы соглашаетесь с условиями данной Политики.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Какую информацию мы собираем</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">Личная информация:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Имя и фамилия</li>
                  <li>Адрес электронной почты</li>
                  <li>Номер телефона</li>
                  <li>Адрес доставки (при необходимости)</li>
                </ul>
                
                <h4 className="font-semibold mt-4">Техническая информация:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP-адрес</li>
                  <li>Данные браузера и устройства</li>
                  <li>Информация о посещениях сайта</li>
                  <li>Геолокация (с вашего согласия)</li>
                </ul>

                <h4 className="font-semibold mt-4">Информация об использовании:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>История заказов</li>
                  <li>Предпочтения в еде</li>
                  <li>Отзывы и рейтинги</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Как мы используем вашу информацию</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Мы используем собранную информацию для:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Обработки и выполнения ваших заказов</li>
                  <li>Предоставления клиентской поддержки</li>
                  <li>Улучшения наших услуг и пользовательского опыта</li>
                  <li>Отправки уведомлений о заказах и акциях</li>
                  <li>Персонализации рекомендаций</li>
                  <li>Обеспечения безопасности платформы</li>
                  <li>Соблюдения требований законодательства</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Передача данных третьим лицам</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Мы можем передавать ваши данные:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Партнерам-ресторанам:</strong> для выполнения заказов 
                    (имя, телефон, особые требования к заказу)
                  </li>
                  <li>
                    <strong>Платежным системам:</strong> для обработки платежей 
                    (в зашифрованном виде)
                  </li>
                  <li>
                    <strong>Службам доставки:</strong> при использовании доставки 
                    (контактные данные и адрес)
                  </li>
                  <li>
                    <strong>Аналитическим сервисам:</strong> для улучшения работы платформы 
                    (анонимизированные данные)
                  </li>
                </ul>
                <p className="mt-4">
                  <strong>Мы НЕ продаем ваши персональные данные третьим лицам.</strong>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Защита данных</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Для защиты ваших данных мы используем:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>SSL-шифрование для передачи данных</li>
                  <li>Современные методы шифрования для хранения</li>
                  <li>Ограниченный доступ сотрудников к персональным данным</li>
                  <li>Регулярные аудиты безопасности</li>
                  <li>Соблюдение международных стандартов защиты данных</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Ваши права</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Вы имеете право:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Получить доступ к своим персональным данным</li>
                  <li>Исправить неточную или неполную информацию</li>
                  <li>Удалить свои данные (право на забвение)</li>
                  <li>Ограничить обработку ваших данных</li>
                  <li>Отозвать согласие на обработку данных</li>
                  <li>Получить копию своих данных в машиночитаемом формате</li>
                </ul>
                <p className="mt-4">
                  Для реализации своих прав обращайтесь по адресу: 
                  <a href="mailto:privacy@foodsave.com" className="text-primary hover:underline ml-1">
                    privacy@foodsave.com
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Cookies и аналогичные технологии</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Мы используем cookies для улучшения работы сайта, анализа трафика и персонализации контента.
                </p>
                <p>
                  Вы можете управлять настройками cookies в своем браузере, но это может повлиять 
                  на функциональность сайта.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Хранение данных</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Мы храним ваши персональные данные в течение времени, необходимого для достижения 
                  целей, указанных в данной Политике, или в соответствии с требованиями законодательства.
                </p>
                <p>
                  После удаления аккаунта большинство персональных данных удаляется в течение 30 дней, 
                  за исключением информации, которую мы обязаны хранить по закону.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Международная передача данных</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Ваши данные могут обрабатываться в других странах, где расположены наши серверы 
                  или поставщики услуг. Мы обеспечиваем соответствующий уровень защиты при любой 
                  международной передаче данных.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Изменения в Политике</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Мы можем обновлять данную Политику время от времени. О существенных изменениях 
                  мы уведомим вас по электронной почте или через уведомления на платформе.
                </p>
                <p>
                  Дата последнего обновления указана в начале документа.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  По вопросам конфиденциальности обращайтесь:
                </p>
                <ul className="space-y-1">
                  <li>Email: <a href="mailto:privacy@foodsave.com" className="text-primary hover:underline">privacy@foodsave.com</a></li>
                  <li>Телефон: <a href="tel:+77771234567" className="text-primary hover:underline">+7 (777) 123-45-67</a></li>
                  <li>Адрес: ул. Достык, 162, Алматы 050000, Казахстан</li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </main>
  );
}
