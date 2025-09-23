"use client";

import { useMemo } from "react";
import { Briefcase, FileText, Home } from "lucide-react";

import { NavBar } from "@/components/ui/tubelight-navbar";

export function MiniAppBottomNav() {
  const navItems = useMemo(
    () => [
      { name: "Главная", url: "/", icon: Home },
      { name: "Заведения", url: "/stores", icon: Briefcase },
      { name: "Заказы", url: "/orders", icon: FileText },
    ],
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center">
      <div className="pointer-events-auto w-full max-w-md px-4">
        <NavBar items={navItems} className="w-full" />
      </div>
    </div>
  );
}
