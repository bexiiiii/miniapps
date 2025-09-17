"use client";

import { useMemo } from "react";
import { Briefcase, FileText, Home, User } from "lucide-react";

import { NavBar } from "@/components/ui/tubelight-navbar";
import { useAuth } from "~/lib/auth-context";

export function MiniAppBottomNav() {
  const { user } = useAuth();

  const navItems = useMemo(
    () => [
      { name: "Главная", url: "/", icon: Home },
      { name: "Магазины", url: "/stores", icon: Briefcase },
      { name: "Заказы", url: "/orders", icon: FileText },
      {
        name: user ? "Аккаунт" : "Войти",
        url: user ? "/auth/sign-out" : "/auth/sign-in",
        icon: User,
      },
    ],
    [user],
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center">
      <div className="pointer-events-auto w-full max-w-md px-4">
        <NavBar items={navItems} className="w-full" />
      </div>
    </div>
  );
}
