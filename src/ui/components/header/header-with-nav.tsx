"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { cn } from "~/lib/cn";
import { SEO_CONFIG } from "~/app";
import { useAuth } from "~/lib/auth-context";
import { Button } from "~/ui/primitives/button";
import { Skeleton } from "~/ui/primitives/skeleton";
import { ThemeToggle } from "../theme-toggle";
import { NotificationsWidget } from "../notifications/notifications-widget";
import { HeaderUserDropdown } from "./header-user";
import { CartBackend } from "../cart-backend";

interface HeaderProps {
  children?: React.ReactNode;
  showAuth?: boolean;
}

export function Header({ showAuth = true }: HeaderProps) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const mainNavigation = [
    { href: "/", name: "Главная" },
    { href: "/stores", name: "Боксы" },
    { href: "/business", name: "Для бизнеса" },
    // { href: "/products", name: "Все продукты" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur",
        "supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className={cn("container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8")}>
        <div className="flex h-16 items-center justify-between">
          {/* Logo и навигация */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span
                className={cn(
                  "text-xl font-bold text-primary",
                  "hover:text-primary/80 transition-colors"
                )}
              >
                {SEO_CONFIG.name}
              </span>
            </Link>
            
            {/* Десктопная навигация */}
            <nav className={cn("hidden md:flex ml-8")}>
              <ul className="flex items-center gap-6">
                {mainNavigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href));

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary",
                          isActive
                            ? "text-foreground"
                            : "text-foreground/60"
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Правая часть - корзина и авторизация */}
          <div className="flex items-center gap-4">
            {/* Корзина - будет добавлена позже */}
            <div className="text-sm text-muted-foreground">
              🛒 Корзина
            </div>

            {/* Авторизация */}
            {showAuth && (
              <div className={cn("hidden md:block")}>
                <div className="flex items-center gap-2">
                  <Link href="/auth/sign-in">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                      Войти
                    </button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      Регистрация
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Мобильная кнопка меню */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Открыть меню"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2 border-t">
            {mainNavigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Мобильная авторизация */}
          {showAuth && (
            <div className="space-y-1 border-t px-4 py-3">
              <Link
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium hover:bg-muted/50 transition-colors"
                )}
                href="/auth/sign-in"
                onClick={() => setMobileMenuOpen(false)}
              >
                Войти
              </Link>
              <Link
                className={cn(
                  "block rounded-md bg-primary px-3 py-2 text-base font-medium",
                  "text-primary-foreground hover:bg-primary/90 transition-colors"
                )}
                href="/auth/sign-up"
                onClick={() => setMobileMenuOpen(false)}
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
