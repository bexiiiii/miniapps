import { Metadata } from "next";
import { generateSEOMetadata, COMMON_KEYWORDS } from "~/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Пресс-центр",
  description: "Новости FoodSave, пресс-релизы, медиа-кит и контакты для журналистов. Актуальная информация о компании и достижениях.",
  keywords: [...COMMON_KEYWORDS.business, "пресс-релизы", "новости", "СМИ", "медиа-кит", "журналисты"],
  url: "/press",
});

export default function PressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
