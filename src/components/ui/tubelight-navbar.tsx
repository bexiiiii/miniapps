"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Briefcase, FileText, Home, User } from "lucide-react";

import { cn } from "@/lib/cn";

export type TubelightNavItem = {
  name: string;
  url: string;
  icon: LucideIcon;
};

interface NavBarProps {
  items: TubelightNavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "relative flex items-center justify-between gap-1 rounded-full border border-primary/20",
        "bg-background/80 px-2 py-2 shadow-lg backdrop-blur supports-[backdrop-filter]:backdrop-blur-lg",
        "dark:border-primary/30 dark:bg-background/60",
        className,
      )}
    >
      {items.map((item) => {
        const { name, url, icon: Icon } = item;
        const isActive =
          url !== "#" && (pathname === url || (url !== "/" && pathname.startsWith(url)));

        return (
          <Link
            key={name}
            href={url}
            aria-label={name}
            className={cn(
              "group relative flex flex-1 flex-col items-center gap-1 overflow-hidden",
              "rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide",
              "text-muted-foreground transition-colors",
              isActive && "text-primary",
            )}
          >
            <span
              className={cn(
                "z-[1] flex h-11 w-11 items-center justify-center rounded-full border",
                "border-transparent bg-muted/70 text-muted-foreground transition-all",
                "group-hover:border-primary/60 group-hover:bg-primary/15 group-hover:text-primary",
                isActive && "border-primary bg-primary text-primary-foreground shadow-inner",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="z-[1] text-[10px] leading-none">{name}</span>
            <span
              className={cn(
                "absolute inset-x-3 bottom-1 z-0 h-8 rounded-full bg-primary/10 transition-opacity",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}

export function NavBarDemo() {
  const navItems: TubelightNavItem[] = [
    { name: "Home", url: "/", icon: Home },
    { name: "About", url: "/about", icon: User },
    { name: "Projects", url: "/business", icon: Briefcase },
    { name: "Resume", url: "/terms", icon: FileText },
  ];

  return <NavBar items={navItems} />;
}
