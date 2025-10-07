"use client";

import Link from "next/link";
import { SEO_CONFIG } from "~/app";
import { useLanguage } from "~/contexts/language-context";
import { LanguageSwitcher } from "~/ui/components/language-switcher";

interface HeaderProps {
  showAuth?: boolean;
}

export function Header(_props: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary">
            {SEO_CONFIG.name}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
