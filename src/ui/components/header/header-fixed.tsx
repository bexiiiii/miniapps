"use client";

import { Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SEO_CONFIG } from "~/app";
import { useAuth } from "~/lib/auth-context";
import { cn } from "~/lib/cn";
import { Cart } from "~/ui/components/cart";
import { CartBackend } from "~/ui/components/cart-backend";
import { Button } from "~/ui/primitives/button";
import { Skeleton } from "~/ui/primitives/skeleton";

import { NotificationsWidget } from "../notifications/notifications-widget";
import { ThemeToggle } from "../theme-toggle";
import { HeaderUserDropdown } from "./header-user";

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
    // { href: "/products", name: "Все продукты" },
  ];

  // Всегда используем основную навигацию, убираем dashboard
  const navigation = mainNavigation;

  const renderContent = () => (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur",
        "supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className={cn("container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8")}>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link className="flex items-center gap-2" href="/">
              <span
                className={cn(
                  "text-xl font-bold",
                  pathname === "/" ? "text-primary" : "text-foreground",
                )}
              >
                {SEO_CONFIG.name}
              </span>
            </Link>
            <nav className={cn("hidden md:flex")}>
              <ul className="flex items-center gap-6">
                {loading
                  ? Array.from({ length: navigation.length }).map((_, i) => (
                      <li key={i}>
                        <Skeleton className="h-6 w-20" />
                      </li>
                    ))
                  : navigation.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname?.startsWith(item.href));

                      return (
                        <li key={item.name}>
                          <Link
                            className={cn(
                              "text-sm font-medium transition-colors hover:text-primary",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                            href={item.href}
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
            {loading ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : (
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
            )}

            {loading ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : (
              <NotificationsWidget />
            )}

            {loading ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : (
              <ThemeToggle />
            )}

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

            {/* Mobile menu button */}
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {showAuth && !user && (
            <div className="space-y-1 border-b px-4 py-3">
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
        </div>
      )}
    </header>
  );

  return renderContent();
}
