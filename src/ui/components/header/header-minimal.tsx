"use client";

import Link from "next/link";
import { cn } from "~/lib/cn";
import { SEO_CONFIG } from "~/app";

interface HeaderProps {
  children?: React.ReactNode;
  showAuth?: boolean;
}

export function Header({ showAuth = true }: HeaderProps) {
  const navigation = [
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
            <nav className={cn("hidden md:flex ml-8")}>
              <ul className="flex items-center gap-6">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        "text-foreground/60"
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {showAuth && (
              <div className={cn("hidden md:block")}>
                <div className="flex items-center gap-2">
                  <Link href="/auth/sign-in">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                      Войти
                    </button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Регистрация
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
