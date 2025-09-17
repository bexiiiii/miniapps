"use client";

import Link from "next/link";
import { LogOut, ShoppingCart } from "lucide-react";
import { SEO_CONFIG } from "~/app";
import { useAuth } from "~/lib/auth-context";
import { CartBackend } from "~/ui/components/cart-backend";
import { Button } from "~/ui/primitives/button";
import { Skeleton } from "~/ui/primitives/skeleton";

interface HeaderProps {
  showAuth?: boolean;
}

export function Header({ showAuth = true }: HeaderProps) {
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary">
            {SEO_CONFIG.name}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <CartBackend
            CartTrigger={
              <Button
                aria-label="Открыть корзину"
                className="h-10 w-10 rounded-full"
                size="icon"
                variant="outline"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            }
          />
          {showAuth && (
            loading ? (
              <Skeleton className="h-10 w-20 rounded-full" />
            ) : user ? (
              <Button
                onClick={() => {
                  void logout();
                }}
                size="sm"
                variant="outline"
                className="flex items-center gap-2 rounded-full"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            ) : (
              <Link href="/auth/sign-in">
                <Button size="sm" className="rounded-full">
                  Войти
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
