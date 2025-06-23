import { Metadata } from "next";
import { Users, Target, Award, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { generateSEOMetadata, COMMON_KEYWORDS } from "~/lib/seo";
import { Button } from "~/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/primitives/card";

export const metadata: Metadata = generateSEOMetadata({
  title: "О нас",
  description: "Узнайте историю FoodSave, нашу миссию по борьбе с пищевыми отходами и команду, которая делает мир лучше через технологии.",
  keywords: [...COMMON_KEYWORDS.business, ...COMMON_KEYWORDS.eco, "о компании", "команда", "миссия", "история компании"],
  url: "/about",
});

const teamMembers = [
  {
    name: "Анна Иванова",
    role: "CEO & Co-Founder",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
    bio: "Опыт в технологическом предпринимательстве более 10 лет. Ранее работала в крупных IT-компаниях.",
  },
  {
    name: "Максим Петров",
    role: "CTO & Co-Founder",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "Ведущий разработчик с опытом создания масштабируемых платформ. Эксперт в области мобильных технологий.",
  },
  {
    name: "Елена Козлова",
    role: "Head of Operations",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
    bio: "Специалист по операционной деятельности с опытом в ретейле и пищевой индустрии.",
  },
  {
    name: "Дмитрий Сидоров",
    role: "Head of Marketing",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    bio: "Маркетинговый стратег с фокусом на digital-каналы и развитие пользовательской базы.",
  },
];

const values = [
  {
    icon: <Target className="h-6 w-6 text-primary" />,
    title: "Миссия",
    description:
      "Сокращаем пищевые отходы, делая качественную еду доступной для всех",
  },
  {
    icon: <Heart className="h-6 w-6 text-primary" />,
    title: "Забота",
    description:
      "Заботимся о планете и людях, создавая устойчивые решения для будущего",
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Сообщество",
    description:
      "Объединяем бизнес и потребителей для создания позитивного воздействия",
  },
  {
    icon: <Award className="h-6 w-6 text-primary" />,
    title: "Качество",
    description:
      "Гарантируем высокое качество продуктов и сервиса на всех этапах",
  },
];

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="bg-grid-black/[0.02] absolute inset-0 bg-[length:20px_20px]" />
        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-[1.1]">
                  О нас —{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    FoodSave
                  </span>
                </h1>
                <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Мы — команда энтузиастов, которая верит в то, что качественная еда
                  должна быть доступной, а пищевые отходы — минимальными. Наша
                  платформа соединяет бизнес и потребителей для создания более
                  устойчивого будущего.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/contact">
                  <Button className="h-12 px-8 transition-colors duration-200" size="lg">
                    Свяжитесь с нами
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative mx-auto hidden aspect-square w-full max-w-md overflow-hidden rounded-xl border shadow-lg lg:block">
              <Image
                alt="FoodSave team"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
              Наши ценности
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
            <p className="mt-4 max-w-2xl text-center text-muted-foreground">
              Принципы, которые направляют нашу работу каждый день
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card
                key={value.title}
                className="rounded-2xl border-none bg-background shadow transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    {value.icon}
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl mb-6">
                Наша история
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  FoodSave появился из простой идеи: почему качественная еда должна
                  выбрасываться, когда так много людей хотят питаться вкусно и
                  экономно?
                </p>
                <p>
                  В 2024 году наша команда объединилась, чтобы создать платформу,
                  которая помогает ресторанам, кафе и магазинам найти новых
                  покупателей для своих товаров, а людям — покупать качественную еду
                  со скидкой.
                </p>
                <p>
                  Сегодня мы работаем с сотнями заведений по всей стране и помогли
                  сэкономить тысячи тонн продуктов от попадания в мусор.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                alt="FoodSave story"
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src="https://images.unsplash.com/photo-1556909114-4e4f7dc25fbe?w=800&auto=format&fit=crop&q=60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-center text-center">
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
              Наша команда
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
            <p className="mt-4 max-w-2xl text-center text-muted-foreground">
              Познакомьтесь с людьми, которые делают FoodSave возможным
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <Card key={member.name} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      alt={member.name}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      src={member.image}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                Присоединяйтесь к движению
              </h2>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Помогите нам создать более устойчивое будущее, где качественная еда
                не пропадает зря
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/auth/sign-up">
                  <Button className="h-12 px-8 transition-colors duration-200" size="lg">
                    Начать экономить
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    className="h-12 px-8 transition-colors duration-200"
                    size="lg"
                    variant="outline"
                  >
                    Стать партнером
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
