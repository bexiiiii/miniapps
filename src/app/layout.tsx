import type { Metadata } from "next";

// import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
// import { extractRouterConfig } from "uploadthing/server";

import { SEO_CONFIG } from "~/app";
// import { ourFileRouter } from "~/app/api/uploadthing/core"; // Not used with Java backend
import { CartProvider } from "~/lib/hooks/use-cart";
import { CartBackendProvider } from "~/lib/hooks/use-cart-backend";
import { AuthProvider } from "~/lib/auth-context";
import { LanguageProvider } from "~/contexts/language-context";
import { i18n } from "~/i18n-config";
import { cn } from "~/lib/cn";
import "~/css/globals.css";
import { Footer } from "~/ui/components/footer";
import { Header } from "~/ui/components/header/header-test";
import { MiniAppBottomNav } from "~/ui/components/mini-app-bottom-nav";
import { ThemeProvider } from "~/ui/components/theme-provider";
import { Toaster } from "~/ui/primitives/sonner";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: SEO_CONFIG.fullName,
    template: `%s | ${SEO_CONFIG.name}`,
  },
  description: SEO_CONFIG.description,
  keywords: SEO_CONFIG.keywords,
  authors: [{ name: SEO_CONFIG.author }],
  creator: SEO_CONFIG.author,
  publisher: SEO_CONFIG.author,
  metadataBase: new URL(SEO_CONFIG.url),
  alternates: {
    canonical: "/",
    languages: {
      "ru-KZ": "/",
      "en-US": "/en",
      "kk-KZ": "/kk",
    },
  },
  openGraph: {
    type: "website",
    locale: SEO_CONFIG.locale,
    url: SEO_CONFIG.url,
    title: SEO_CONFIG.fullName,
    description: SEO_CONFIG.description,
    siteName: SEO_CONFIG.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SEO_CONFIG.fullName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.fullName,
    description: SEO_CONFIG.description,
    site: SEO_CONFIG.twitterHandle,
    creator: SEO_CONFIG.twitterHandle,
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  category: "food",
  classification: "Food Delivery Service",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
  applicationName: SEO_CONFIG.name,
  generator: "Next.js",
  appleWebApp: {
    capable: true,
    title: SEO_CONFIG.name,
    statusBarStyle: "default",
  },
  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-TileImage": "/mstile-144x144.png",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SEO_CONFIG.name,
    "alternateName": SEO_CONFIG.fullName,
    "url": SEO_CONFIG.url,
    "logo": `${SEO_CONFIG.url}/logo.png`,
    "description": SEO_CONFIG.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Алматы",
      "addressLocality": "Алматы", 
      "addressRegion": "Алматы",
      "postalCode": "050000",
      "addressCountry": "KZ"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+7-777-123-4567",
      "contactType": "customer service",
      "availableLanguage": ["Russian", "Kazakh", "English"]
    },
    "sameAs": [
      `https://twitter.com/${SEO_CONFIG.twitterHandle.replace('@', '')}`,
      `https://facebook.com/${SEO_CONFIG.facebookPage}`,
      `https://instagram.com/foodsave_kz`
    ],
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "FoodSave Founders"
      }
    ],
    "numberOfEmployees": "10-50",
    "industry": "Food Technology",
    "serviceArea": {
      "@type": "City",
      "name": "Алматы"
    }
  };

  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "min-h-screen bg-gradient-to-br from-white to-slate-100",
          "text-neutral-900 antialiased selection:bg-primary/80",
          "dark:from-neutral-950 dark:to-neutral-900 dark:text-neutral-100"
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {/* <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} /> */}
          <LanguageProvider initialLocale={i18n.defaultLocale}>
            <AuthProvider>
              <CartProvider>
                <CartBackendProvider>
                  <Header showAuth={true} />
                  <main className={`flex min-h-screen flex-col pb-28`}>{children}</main>
                  <Footer />
                  <MiniAppBottomNav />
                  <Toaster />
                </CartBackendProvider>
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
