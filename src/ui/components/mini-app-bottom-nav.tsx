"use client";

import { useMemo } from "react";
import { Briefcase, FileText, Home } from "lucide-react";

import { NavBar } from "@/components/ui/tubelight-navbar";
import { useLanguage } from "~/contexts/language-context";

export function MiniAppBottomNav() {
  const { t } = useLanguage();

  const navItems = useMemo(
    () => [
      { name: t("nav.home"), url: "/", icon: Home },
      { name: t("nav.stores"), url: "/stores", icon: Briefcase },
      { name: t("nav.orders"), url: "/orders", icon: FileText },
    ],
    [t],
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center">
      <div className="pointer-events-auto w-full max-w-md px-4">
        <NavBar items={navItems} className="w-full" />
      </div>
    </div>
  );
}
