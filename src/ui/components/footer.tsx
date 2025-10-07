"use client";

import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { SEO_CONFIG } from "~/app";
import { cn } from "~/lib/cn";
import { apiClient, type Category } from "~/lib/api-client";
import { Button } from "~/ui/primitives/button";
import { useLanguage } from "~/contexts/language-context";

export function Footer({ className }: { className?: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await apiClient.getCategories();
        setCategories(categoriesData.slice(0, 5)); // Show first 5 categories
      } catch (error) {
        console.error('Error fetching categories for footer:', error);
        // Fallback to mock categories if API fails
        const { categories: mockCategories } = await import('~/app/mocks');
        const mappedMockCategories: Category[] = mockCategories.slice(0, 5).map((category, index) => ({
          id: index + 1,
          name: category.name,
          description: `${category.productCount} items available`,
          imageUrl: category.image,
          active: true,
        }));
        setCategories(mappedMockCategories);
      }
    };

    fetchCategories();
  }, []);
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div
        className={`
          container mx-auto max-w-7xl px-4 py-12
          sm:px-6
          lg:px-8
        `}
      >
        <div
          className={`
            grid grid-cols-1 gap-8
            md:grid-cols-4
          `}
        >
          <div className="space-y-4">
            <Link className="flex items-center gap-2" href="/">
              <span
                className={`
                  bg-gradient-to-r from-primary to-primary/70 bg-clip-text
                  text-xl font-bold tracking-tight text-transparent
                `}
              >
                {SEO_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("seo.description")}
            </p>
            <div className="flex space-x-4">
              <Button
                className="h-8 w-8 rounded-full"
                size="icon"
                variant="ghost"
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                className="h-8 w-8 rounded-full"
                size="icon"
                variant="ghost"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                className="h-8 w-8 rounded-full"
                size="icon"
                variant="ghost"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                className="h-8 w-8 rounded-full"
                size="icon"
                variant="ghost"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button
                className="h-8 w-8 rounded-full"
                size="icon"
                variant="ghost"
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t("footer.about")}</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    className={`
                      text-muted-foreground
                      hover:text-foreground
                    `}
                    href={`/products${category.name === 'All Products' ? '' : `?category=${encodeURIComponent(category.name)}`}`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {/* Fallback static links if categories haven't loaded */}
              {categories.length === 0 && (
                <>
                  <li>
                    <Link
                      className={`
                        text-muted-foreground
                        hover:text-foreground
                      `}
                      href="/products"
                    >
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`
                        text-muted-foreground
                        hover:text-foreground
                      `}
                      href="/products?category=Audio"
                    >
                      Audio
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`
                        text-muted-foreground
                        hover:text-foreground
                      `}
                      href="/products?category=Wearables"
                    >
                      Wearables
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`
                        text-muted-foreground
                        hover:text-foreground
                      `}
                      href="/products?category=Smartphones"
                    >
                      Smartphones
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`
                        text-muted-foreground
                        hover:text-foreground
                      `}
                      href="/products?category=Laptops"
                    >
                      Laptops
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t("nav.about")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className={`
                    text-muted-foreground
                    hover:text-foreground
                  `}
                  href="/about"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                
              </li>
              <li>
                {/* <Link
                  className={`
                    text-muted-foreground
                    hover:text-foreground
                  `}
                  href="/blog"
                >
                  Blog
                </Link> */}
              </li>
              <li>
                <Link
                  className={`
                    text-muted-foreground
                    hover:text-foreground
                  `}
                  href="/press"
                >
                  {t("nav.press")}
                </Link>
              </li>
              <li>
                <Link
                  className={`
                    text-muted-foreground
                    hover:text-foreground
                  `}
                  href="/contact"
                >
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t("common.settings")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className={`
                    text-muted-foreground
                    hover:text-foreground
                  `}
                  href="/help"
                >
                  {t("common.info")}
                </Link>
              </li>
              <li>
                
              </li>
              <li>
                
              </li>
              <li>
                <Link
                  className={`
                    text-muted-foreground
                    hover:text-foreground
                  `}
                  href="/privacy"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  className={`
                    text-muted-foreground
                    hover:text-foreground
                  `}
                  href="/terms"
                >
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <div
            className={`
              flex flex-col items-center justify-between gap-4
              md:flex-row
            `}
          >
            <p className="text-sm text-muted-foreground">
              {t("footer.copyright")}
            </p>
            <div
              className={
                "flex items-center gap-4 text-sm text-muted-foreground"
              }
            >
              <Link className="hover:text-foreground" href="/privacy">
                {t("footer.privacy")}
              </Link>
              <Link className="hover:text-foreground" href="/terms">
                {t("footer.terms")}
              </Link>
            
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
