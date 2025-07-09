import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Site configuration
const siteConfig = {
  name: "LazyCLI",
  title: "LazyCLI – Automate Your Dev Workflow Like a Pro",
  description:
    "Streamline your development process with LazyCLI - the intelligent CLI tool that automates GitHub workflows, Node.js setup, Next.js scaffolding, and more. Built for developers who value efficiency.",
  url: "https://lazycli.xyz",
  author: {
    name: "iammhador",
    twitter: "@iammhador",
  },
  social: {
    twitter: "@lazycli",
    github: "https://github.com/iammhador/lazycli",
  },
};

// Enhanced SEO metadata
export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    // Primary keywords
    "CLI tool",
    "developer automation",
    "development workflow",
    "command line interface",

    // Technology-specific keywords
    "GitHub automation",
    "Git workflow",
    "Node.js CLI",
    "Next.js scaffolding",
    "Vite.js setup",
    "React development",
    "TypeScript CLI",

    // Use case keywords
    "project setup",
    "code deployment",
    "developer productivity",
    "build automation",
    "CI/CD tool",
    "development efficiency",

    // Target audience
    "frontend developer",
    "full-stack developer",
    "DevOps automation",
    "modern development",
  ],
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,

  // Enhanced metadata base
  metadataBase: new URL(siteConfig.url),

  // Open Graph optimization
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} – Modern CLI Tool for Developer Workflow Automation`,
        type: "image/png",
      },
      {
        url: "/og-image-square.png",
        width: 1200,
        height: 1200,
        alt: `${siteConfig.name} Logo`,
        type: "image/png",
      },
    ],
  },

  // Twitter Card optimization
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/twitter-image.png"],
    creator: siteConfig.author.twitter,
    site: siteConfig.social.twitter,
  },

  // Enhanced icons
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000000" },
    ],
  },

  // Web app manifest
  manifest: "/site.webmanifest",

  // Enhanced robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical URL
  alternates: {
    canonical: siteConfig.url,
  },

  // Enhanced other metadata
  other: {
    // Revisit configuration
    "revisit-after": "7 days",

    // Content language
    "content-language": "en",

    // Theme color for mobile browsers
    "theme-color": "#000000",

    // Microsoft application tiles
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",

    // Apple mobile web app
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": siteConfig.name,

    // Format detection
    "format-detection": "telephone=no",

    // Referrer policy
    referrer: "origin-when-cross-origin",

    // Security headers
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",

    // Search engine verification (add your actual codes)
    "google-site-verification": "your-google-verification-code",
    "msvalidate.01": "your-bing-verification-code",

    // Schema.org JSON-LD will be added via a script tag
    "application-name": siteConfig.name,
    "mobile-web-app-capable": "yes",
  },

  // App-specific metadata
  applicationName: siteConfig.name,
  category: "Developer Tools",

  // Viewport is handled by Next.js automatically
  // But you can override if needed
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Windows, Linux",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
  },
  downloadUrl: `${siteConfig.url}/install`,
  installUrl: `${siteConfig.url}/install`,
  screenshot: `${siteConfig.url}/screenshot.png`,
  softwareVersion: "1.0.2",
  releaseNotes: `${siteConfig.url}/changelog`,
  supportingData: `${siteConfig.url}/docs`,
  keywords: [
    "CLI tool",
    "developer automation",
    "GitHub automation",
    "Node.js setup",
    "Next.js scaffolding",
  ].join(", "),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
