"use client";

import { Mail, Phone, MapPin, Clock, MessageCircle, Users, Building, HeadphonesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "~/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/primitives/card";
import { Input } from "~/ui/primitives/input";
import { Textarea } from "~/ui/primitives/textarea";
import { Label } from "~/ui/primitives/label";

const contactMethods = [
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: "Email",
    description: "Напишите нам на почту",
    contact: "hello@foodsave.com",
    action: "mailto:hello@foodsave.com"
  },
  {
    icon: <Phone className="h-6 w-6 text-primary" />,
    title: "Телефон",
    description: "Позвоните нам",
    contact: "+7 (708)514 32 43",
    action: "tel:+77085143243"
  },
  {
    icon: <MessageCircle className="h-6 w-6 text-primary" />,
    title: "WhatsApp",
    description: "Быстрая поддержка",
    contact: "+7 (708)514 32 43",
    action: "https://wa.me/77085143243"
  },
  {
    icon: <MessageCircle className="h-6 w-6 text-primary" />,
    title: "Telegram",
    description: "Мгновенные ответы",
    contact: "@foodsave_support",
    action: "https://t.me/foodsave_support"
  }
];

const officeInfo = {
  address: "Astana IT University, Кабанбай батыр проспект, 60а/1",
  coordinates: { lat: 43.238253, lng: 76.945465 },
  workingHours: {
    weekdays: "Пн-Пт: 9:00 - 18:00",
    weekends: "Сб-Вс: 10:00 - 16:00"
  }
};

const departments = [
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Общие вопросы",
    description: "Вопросы о платформе, регистрации, использовании",
    email: "hello@foodsave.com"
  },
  {
    icon: <Building className="h-6 w-6 text-primary" />,
    title: "Для бизнеса",
    description: "Партнерство, подключение ресторанов и кафе",
    email: "business@foodsave.com"
  },
  {
    icon: <HeadphonesIcon className="h-6 w-6 text-primary" />,
    title: "Техподдержка",
    description: "Технические проблемы, баги, предложения",
    email: "support@foodsave.com"
  },
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: "Пресс-служба",
    description: "Медиа-запросы, интервью, пресс-релизы",
    email: "press@foodsave.com"
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    department: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      department: "",
      message: ""
    });
    setIsSubmitting(false);
    
    // Show success message (you can implement a toast here)
    alert("Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="bg-grid-black/[0.02] absolute inset-0 bg-[length:20px_20px]" />
        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-[1.1]">
              Свяжитесь{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                с нами
              </span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
              Есть вопросы, предложения или хотите стать партнером? 
              Мы всегда готовы помочь и ответить на ваши вопросы.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl text-center">
              Способы связи
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-primary mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((method, index) => (
              <a href={method.action} key={index}>
                <Card className="transition-all duration-300 hover:shadow-lg group cursor-pointer">
                  <CardHeader className="text-center pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                      {method.icon}
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-2">{method.description}</CardDescription>
                    <p className="font-medium text-primary">{method.contact}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Contact Form */}
          <section className="py-12 md:py-16">
            <div className="mb-8">
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
                Напишите нам
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
              <p className="mt-4 text-muted-foreground">
                Заполните форму ниже, и мы ответим вам в течение 24 часов
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="department">Отдел</Label>
                <select 
                  id="department"
                  value={formData.department} 
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Выберите отдел</option>
                  <option value="general">Общие вопросы</option>
                  <option value="business">Для бизнеса</option>
                  <option value="support">Техподдержка</option>
                  <option value="press">Пресс-служба</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="subject">Тема *</Label>
                <Input
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="Кратко опишите вопрос"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Сообщение *</Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Подробно опишите ваш вопрос или предложение..."
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Отправляем..." : "Отправить сообщение"}
              </Button>
            </form>
          </section>

          {/* Office Info & Departments */}
          <section className="py-12 md:py-16">
            {/* Office Information */}
            <div className="mb-12">
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl mb-6">
                Наш офис
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Адрес</p>
                        <p className="text-muted-foreground">{officeInfo.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Часы работы</p>
                        <p className="text-muted-foreground">{officeInfo.workingHours.weekdays}</p>
                        <p className="text-muted-foreground">{officeInfo.workingHours.weekends}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 aspect-video relative overflow-hidden rounded-lg">
                    <Image
                      alt="FoodSave office"
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Departments */}
            <div>
              <h3 className="font-display text-2xl font-bold mb-6">Отделы</h3>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          {dept.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{dept.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{dept.description}</p>
                          <a href={`mailto:${dept.email}`} className="text-sm text-primary hover:underline">
                            {dept.email}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
              Часто задаваемые вопросы
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-primary mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Как работает FoodSave?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Рестораны размещают боксы с едой со скидкой, 
                  вы заказываете через приложение и забираете в удобное время.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Как стать партнером?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Напишите нам на business@foodsave.com или заполните форму выше, 
                  выбрав отдел "Для бизнеса".
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Есть ли мобильное приложение?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Да! Скачайте наше приложение в App Store или Google Play для 
                  более удобного использования.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl bg-primary/10 p-8 shadow-lg md:p-12">
            <div className="bg-grid-white/[0.05] absolute inset-0 bg-[length:16px_16px]" />
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
                Готовы начать экономить?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Присоединяйтесь к тысячам пользователей, которые уже экономят с FoodSave
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/auth/sign-up">
                  <Button className="h-12 px-8 transition-colors duration-200" size="lg">
                    Зарегистрироваться
                  </Button>
                </Link>
                <Link href="/products">
                  <Button className="h-12 px-8 transition-colors duration-200" size="lg" variant="outline">
                    Посмотреть боксы
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
