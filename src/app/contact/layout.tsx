import { Metadata } from "next";
import { generateSEOMetadata, COMMON_KEYWORDS } from "~/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Контакты",
  description: "Свяжитесь с командой FoodSave. Офис в Алматы, телефон, email, форма обратной связи и часто задаваемые вопросы.",
  keywords: [...COMMON_KEYWORDS.business, "контакты", "связаться", "офис Алматы", "поддержка", "FAQ"],
  url: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
