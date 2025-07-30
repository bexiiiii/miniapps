"use client";

import { Calendar, Download, ExternalLink, FileText, Image as ImageIcon, Video } from "lucide-react";
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

const pressReleases = [
  {
    id: 1,
    title: "FoodSave привлекает $2M на борьбу с пищевыми отходами",
    date: "2025-06-15",
    excerpt: "Стартап из Казахстана завершил seed-раунд инвестиций для масштабирования платформы по всей Центральной Азии.",
    type: "Пресс-релиз",
    downloadUrl: "/press/foodsave-funding-announcement.pdf"
  },
  {
    id: 2,
    title: "Партнерство с крупнейшими сетями ресторанов Алматы",
    date: "2025-06-08",
    excerpt: "FoodSave объявляет о стратегическом партнерстве с ведущими ресторанными группами для сокращения пищевых отходов.",
    type: "Пресс-релиз",
    downloadUrl: "/press/restaurant-partnership.pdf"
  },
  {
    id: 3,
    title: "Награда 'Лучший эко-стартап года 2025'",
    date: "2025-05-20",
    excerpt: "FoodSave получил признание на международном конкурсе зеленых технологий TechEco Awards.",
    type: "Награда",
    downloadUrl: "/press/eco-startup-award.pdf"
  }
];

const mediaKits = [
  {
    title: "Логотипы и брендинг",
    description: "Официальные логотипы FoodSave в различных форматах",
    icon: <ImageIcon className="h-6 w-6" />,
    downloadUrl: "/press/foodsave-brand-kit.zip",
    fileSize: "15 MB"
  },
  {
    title: "Фотографии команды",
    description: "Высококачественные фотографии основателей и команды",
    icon: <ImageIcon className="h-6 w-6" />,
    downloadUrl: "/press/team-photos.zip",
    fileSize: "25 MB"
  },
  {
    title: "Видео-материалы",
    description: "Презентационные видео и демо платформы",
    icon: <Video className="h-6 w-6" />,
    downloadUrl: "/press/video-materials.zip",
    fileSize: "120 MB"
  },
  {
    title: "Факт-лист компании",
    description: "Ключевые факты, статистика и достижения FoodSave",
    icon: <FileText className="h-6 w-6" />,
    downloadUrl: "/press/fact-sheet.pdf",
    fileSize: "2 MB"
  }
];

const mediaContacts = [
  {
    name: "Анна Иванова",
    role: "CEO & Co-Founder",
    email: "anna@foodsave.com",
    phone: "+7 (777) 123-45-67",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face"
  },
  {
    name: "Елена Козлова",
    role: "Head of PR & Communications",
    email: "elena@foodsave.com",
    phone: "+7 (777) 234-56-78",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face"
  }
];

const mediaAppearances = [
  {
    outlet: "Forbes Kazakhstan",
    title: "Как казахстанский стартап борется с пищевыми отходами",
    date: "2025-06-10",
    type: "Интервью",
    url: "https://forbes.kz/foodsave-interview"
  },
  {
    outlet: "Tengri News",
    title: "FoodSave: революция в индустрии питания",
    date: "2025-05-25",
    type: "Статья",
    url: "https://tengrinews.kz/foodsave-revolution"
  },
  {
    outlet: "Kapital.kz",
    title: "Инвестиции в зеленые технологии Казахстана",
    date: "2025-05-15",
    type: "Упоминание",
    url: "https://kapital.kz/green-tech-investments"
  },
  {
    outlet: "Astana TV",
    title: "Программа 'Бизнес-среда' с основателем FoodSave",
    date: "2025-04-30",
    type: "ТВ-интервью",
    url: "https://tv.astana.kz/business-environment-foodsave"
  }
];

export default function PressPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="bg-grid-black/[0.02] absolute inset-0 bg-[length:20px_20px]" />
        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-[1.1]">
              Пресс-центр{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                FoodSave
              </span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
              Новости, пресс-релизы и медиа-материалы о нашей миссии по сокращению
              пищевых отходов и созданию более устойчивого будущего.
            </p>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
              Пресс-релизы
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pressReleases.map((release) => (
              <Card key={release.id} className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline">{release.type}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(release.date).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{release.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{release.excerpt}</CardDescription>
                  <Button variant="outline" className="w-full group">
                    <Download className="h-4 w-4 mr-2" />
                    Скачать PDF
                    <ExternalLink className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
              Медиа-кит
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
            <p className="mt-4 text-muted-foreground">
              Официальные материалы для использования в публикациях
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mediaKits.map((kit, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                    {kit.icon}
                  </div>
                  <CardTitle className="text-lg">{kit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{kit.description}</CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{kit.fileSize}</span>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contacts
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
              Медиа-контакты
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
            <p className="mt-4 text-muted-foreground">
              Свяжитесь с нами для интервью, комментариев и дополнительной информации
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {mediaContacts.map((contact, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full">
                      <Image
                        alt={contact.name}
                        className="object-cover"
                        fill
                        sizes="64px"
                        src={contact.image}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{contact.role}</p>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                            {contact.email}
                          </a>
                        </p>
                        <p className="text-sm">
                          <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                            {contact.phone}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Media Appearances */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
              Упоминания в СМИ
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
          </div>
          <div className="space-y-4">
            {mediaAppearances.map((appearance, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold">{appearance.outlet}</h3>
                        <Badge variant="outline">{appearance.type}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(appearance.date).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{appearance.title}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={appearance.url} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl bg-primary/10 p-8 shadow-lg md:p-12">
            <div className="bg-grid-white/[0.05] absolute inset-0 bg-[length:16px_16px]" />
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
                Нужна дополнительная информация?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Свяжитесь с нашей PR-командой для получения эксклюзивных интервью,
                комментариев экспертов или дополнительных материалов.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button className="h-12 px-8 transition-colors duration-200" size="lg" asChild>
                  <a href="mailto:press@foodsave.com">
                    Связаться с PR-отделом
                  </a>
                </Button>
                <Link href="/contact">
                  <Button className="h-12 px-8 transition-colors duration-200" size="lg" variant="outline">
                    Общие вопросы
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
