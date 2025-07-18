"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, Menu, X, Package } from "lucide-react";
import { SEO_CONFIG } from "~/app";
import { useAuth } from "~/lib/auth-context";
import { cn } from "~/lib/cn";
import { CartBackend } from "~/ui/components/cart-backend";
import { ThemeToggle } from "../theme-toggle";
import { NotificationsWidget } from "../notifications/notifications-widget";
import { HeaderUserDropdown } from "./header-user";
import { Button } from "~/ui/primitives/button";
import { Skeleton } from "~/ui/primitives/skeleton";

interface HeaderProps {
  showAuth?: boolean;
}

export function Header({ showAuth = true }: HeaderProps) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const mainNavigation = [
    { href: "/", name: "Главная" },
    { href: "/stores", name: "Боксы" },
    { href: "/business", name: "Для бизнеса" },
    // { href: "/products", name: "Все продукты" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">
                {SEO_CONFIG.name}
              </span>
            </Link>
            
            {/* Desktop Navigation */}
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
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Корзина */}
            <CartBackend
              CartTrigger={
                <Button
                  aria-label="Open cart"
                  className="relative h-9 w-9 rounded-full"
                  size="icon"
                  variant="outline"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              }
            />
            
            {/* Уведомления - временно отключены */}
            {/* {loading ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : (
              <NotificationsWidget />
            )} */}

            {/* Авторизация */}
            {showAuth && (
              <div className={cn("hidden md:block")}>
                {user ? (
                  <HeaderUserDropdown
                    isDashboard={false}
                    userEmail={user.email}
                    userImage={null}
                    userName={`${user.firstName} ${user.lastName}`}
                  />
                ) : loading ? (
                  <Skeleton className="h-10 w-32" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/auth/sign-in">
                      <Button size="sm" variant="ghost">
                        Войти
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button size="sm">Регистрация</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Мобильная кнопка меню */}
            <Button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              size="icon"
              variant="ghost"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {mainNavigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium",
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
          {showAuth && !user && (
            <div className="space-y-1 border-t px-4 py-3">
              <Link
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium hover:bg-muted/50"
                )}
                href="/auth/sign-in"
                onClick={() => setMobileMenuOpen(false)}
              >
                Войти
              </Link>
              <Link
                className={cn(
                  "block rounded-md bg-primary px-3 py-2 text-base font-medium",
                  "text-primary-foreground hover:bg-primary/90"
                )}
                href="/auth/sign-up"
                onClick={() => setMobileMenuOpen(false)}
              >
                Регистрация
              </Link>
            </div>
          )}

          {/* Информация о пользователе в мобильном меню */}
          {showAuth && user && (
            <div className="border-t px-4 py-3">
              <div className="flex items-center mb-3">
                <div>
                  <div className="text-base font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>
              
              {/* Ссылки профиля в мобильном меню */}
              <div className="space-y-1">
                <Link
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium hover:bg-muted/50"
                  )}
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Package className="h-4 w-4" />
                  История заказов
                </Link>
                <button
                  className={cn(
                    "block w-full text-left rounded-md px-3 py-2 text-base font-medium",
                    "text-destructive hover:bg-destructive/10"
                  )}
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Выйти
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
