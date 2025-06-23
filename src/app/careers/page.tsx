import { Metadata } from "next";
import { generateSEOMetadata, COMMON_KEYWORDS } from "~/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Карьера",
  description: "Присоединяйтесь к команде FoodSave! Открытые вакансии, льготы, корпоративная культура и возможности развития в технологической компании.",
  keywords: [...COMMON_KEYWORDS.business, "вакансии", "работа", "карьера", "IT вакансии Алматы", "удаленная работа", "стартап"],
  url: "/careers",
});

export default function CareersPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Карьера в FoodSave</h1>
      <p className="text-lg text-muted-foreground">
        Присоединяйтесь к команде FoodSave! Мы всегда ищем талантливых людей для развития нашей платформы.
      </p>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">В данный момент вакансий нет</h2>
        <p className="text-muted-foreground">
          Но вы можете отправить своё резюме на наш email, и мы свяжемся с вами при появлении подходящих позиций.
        </p>
      </div>
    </div>
  );
}