"use client";

import { animate } from "animejs";
import React, { useEffect, useRef } from "react";

import { cn } from "~/lib/cn";
import {
  type TestimonialAuthor,
  TestimonialCard,
} from "~/ui/primitives/testimonial";

interface TestimonialsSectionImprovedProps {
  className?: string;
  description: string;
  testimonials: {
    author: TestimonialAuthor;
    href?: string;
    text: string;
  }[];
  title: string;
}

export function TestimonialsSectionImproved({
  className,
  description,
  testimonials,
  title,
}: TestimonialsSectionImprovedProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<null | ReturnType<typeof animate>>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    if (!marqueeRef.current) return;

    // Calculate total width for accurate animation
    const marqueeElement = marqueeRef.current;
    const itemWidth = marqueeElement.scrollWidth / 4; // 4 sets of testimonials

    // Create marquee animation
    const setupAnimation = () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }

      animationRef.current = animate(marqueeElement, {
        duration: 40000, // 40s same as CSS
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
        "bg-background text-foreground",
        "px-0 py-12 sm:py-24 md:py-32",
        className,
      )}
    >
      <div className="max-w-container mx-auto flex flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-3xl leading-tight font-semibold text-lime-500 sm:text-5xl sm:leading-tight">
            {title}
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            {description}
          </p>
        </div>

        {/* Контейнер с закругленными краями */}
        <div className="relative w-full max-w-6xl">
          <div
            className="flex flex-row overflow-hidden rounded-2xl p-2 [gap:var(--gap)] [--gap:1rem] bg-gradient-to-r from-transparent via-muted/20 to-transparent"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="flex shrink-0 flex-row justify-around [gap:var(--gap)]"
              ref={marqueeRef}
              style={{ translate: "none" }}
            >
              {[...Array(4)].map((_, setIndex) =>
                testimonials.map((testimonial, i) => (
                  <TestimonialCard
                    key={`testimonial-${testimonial.author.name}-${setIndex}-${i}`}
                    {...testimonial}
                  />
                )),
              )}
            </div>
          </div>

          {/* Мягкие тени по краям вместо градиентов */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/80 to-transparent pointer-events-none rounded-l-2xl" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/80 to-transparent pointer-events-none rounded-r-2xl" />
        </div>
      </div>
    </section>
  );
}
