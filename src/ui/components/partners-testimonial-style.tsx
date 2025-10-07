"use client";

import { animate } from "animejs";
import React, { useEffect, useRef } from "react";
import Image from "next/image";

import { cn } from "~/lib/cn";
import { partnersData, partnersStats, type Partner } from "~/data/partners";
import { useLanguage } from "~/contexts/language-context";

interface PartnerCardProps {
  partner: Partner;
  className?: string;
}

function PartnerCard({ partner, className }: PartnerCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border-t",
        "bg-gradient-to-b from-muted/50 to-muted/10",
        "p-4 text-start sm:p-6",
        "hover:from-muted/60 hover:to-muted/20",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-colors duration-300",
        className,
      )}
    >
      {/* Логотип и название */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
          <Image
            src={partner.logo}
            alt={partner.name}
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col items-start">
          <h3 className="text-md leading-none font-semibold">{partner.name}</h3>
          <p className="text-sm text-muted-foreground">{partner.category}</p>
        </div>
      </div>

      {/* Описание */}
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {partner.description}
      </p>

      {/* Статистика */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-muted/30">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-sm font-medium">{partner.rating}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {partner.location}
        </div>
      </div>
    </div>
  );
}

interface PartnersTestimonialStyleProps {
  className?: string;
}

export function PartnersTestimonialStyle({ className }: PartnersTestimonialStyleProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<null | ReturnType<typeof animate>>(null);
  const isHoveredRef = useRef(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!marqueeRef.current) return;

    // Calculate total width for accurate animation
    const marqueeElement = marqueeRef.current;
    const itemWidth = marqueeElement.scrollWidth / 4; // 4 sets of partners

    // Create marquee animation
    const setupAnimation = () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }

      animationRef.current = animate(marqueeElement, {
        duration: 45000, // 45s for slower movement
        easing: "linear",
        loop: true,
        translateX: ["0px", `-${itemWidth}px`],
      });

      // Pause animation if already hovered
      if (isHoveredRef.current) {
        animationRef.current.pause();
      }
    };

    // Initial setup
    setupAnimation();

    // Handle resize
    const handleResize = () => {
      setupAnimation();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, []);

  // Handle hover interactions
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (animationRef.current) {
      animationRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (animationRef.current) {
      animationRef.current.play();
    }
  };

  return (
    <section
      className={cn(
        "bg-background text-foreground w-full",
        "px-0 py-12 sm:py-24 md:py-32",
        className,
      )}
    >
      <div className="w-full flex flex-col items-center gap-4 text-center sm:gap-16">
        {/* Заголовок и описание */}
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-3xl leading-tight font-semibold text-lime-500 sm:text-5xl sm:leading-tight">
            {t("home.partners.title")}
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            {t("home.partners.subtitle")}
          </p>
        </div>

        {/* Карусель партнеров */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div
            className="flex flex-row overflow-hidden p-2 [gap:var(--gap)] [--gap:1rem]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="flex shrink-0 flex-row justify-around [gap:var(--gap)]"
              ref={marqueeRef}
              style={{ translate: "none" }}
            >
              {[...Array(4)].map((_, setIndex) =>
                partnersData.map((partner, i) => (
                  <PartnerCard
                    key={`partner-${partner.id}-${setIndex}-${i}`}
                    partner={partner}
                  />
                )),
              )}
            </div>
          </div>

          {/* Аккуратные градиентные маски */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent sm:w-32" />
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-lime-500 mb-2">
              {partnersStats.totalPartners}+
            </div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {t("home.partners.count")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-lime-500 mb-2">
              {partnersStats.averageRating}★
            </div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {t("home.partners.rating")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-lime-500 mb-2">
              {partnersStats.coverage}
            </div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {t("home.partners.coverage")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
