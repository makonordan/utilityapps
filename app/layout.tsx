import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ExtensionBanner } from "@/components/extension-banner/ExtensionBanner";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HideOnEmbed } from "@/components/layout/HideOnEmbed";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SearchModal } from "@/components/search/SearchModal";
import { RecentlyUsed } from "@/components/tools/RecentlyUsed";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  jsonLdString,
} from "@/lib/schema";
import { SITE_CONFIG } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.description}`,
    template: `%s | ${SITE_CONFIG.name} — Free AI Tools`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.author,
  applicationName: SITE_CONFIG.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.description}`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    locale: SITE_CONFIG.locale,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — ${SITE_CONFIG.description}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.description}`,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  // Icons are auto-detected from app/favicon.ico and app/icon.svg.
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

const websiteJsonLd = generateWebSiteSchema();
const organizationJsonLd = generateOrganizationSchema();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd) }}
        />
        <AdSenseScript />
      </head>
      <body className="flex min-h-full flex-col bg-white font-sans text-surface-900 dark:bg-surface-950 dark:text-surface-100">
        <a
          href="#main-content"
          className="sr-only z-[100] focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:rounded-xl focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-card"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <HideOnEmbed extraPrefixes={["/studio"]}>
            <ExtensionBanner />
            <Header />
          </HideOnEmbed>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <HideOnEmbed>
            <Footer />
            <SearchModal />
            <RecentlyUsed />
            <CookieConsent />
          </HideOnEmbed>
        </ThemeProvider>
        <Analytics />
        <GoogleAnalytics />
        <HideOnEmbed>
          <WhatsAppButton />
        </HideOnEmbed>
      </body>
    </html>
  );
}
