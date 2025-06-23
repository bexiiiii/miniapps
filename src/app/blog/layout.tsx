import { Metadata } from "next";
import { generateSEOMetadata, COMMON_KEYWORDS } from "~/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Блог",
  description: "Читайте наш блог о здоровом питании, экологии, экономии и рецептах. Советы по борьбе с пищевыми отходами и устойчивому потреблению.",
  keywords: [...COMMON_KEYWORDS.eco, ...COMMON_KEYWORDS.food, "блог", "статьи", "рецепты", "здоровое питание", "экология"],
  url: "/blog",
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
