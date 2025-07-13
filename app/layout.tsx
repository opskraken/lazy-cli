import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        {/* Vercel Analytics */}
        <Analytics />

        {/* Vercel Speed Insights */}
        <SpeedInsights />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        {/* Google Analytics - Optimized Loading */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9BDSR091HN"
          strategy="afterInteractive"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9BDSR091HN', {
                page_title: document.title,
                page_location: window.location.href,
                enhanced_measurement: true,
                anonymize_ip: true,
                allow_google_signals: true,
                send_page_view: true
              });
            `,
          }}
        />

        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://analytics.google.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Additional SEO and Performance Meta Tags */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#0891b2" />
        <meta name="color-scheme" content="dark light" />

        {/* Prefetch for likely navigation */}
        <link rel="prefetch" href="/guideline" />
        <link rel="prefetch" href="/contribute" />
        <link rel="prefetch" href="/windows" />

        {/* Global Styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html {
                scroll-behavior: smooth;
              }

              /* Custom scrollbar styles */
              ::-webkit-scrollbar {
                width: 8px;
              }

              ::-webkit-scrollbar-track {
                background: #1e293b;
              }

              ::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #06b6d4, #3b82f6);
                border-radius: 4px;
              }

              ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, #0891b2, #2563eb);
              }

              /* Hide scrollbar for Chrome, Safari and Opera */
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }

              /* Hide scrollbar for IE, Edge and Firefox */
              .hide-scrollbar {
                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox */
              }

              /* Loading animation for better UX */
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }

              .animate-fade-in {
                animation: fadeIn 0.6s ease-out;
              }

              /* Focus styles for better accessibility */
              .focus-ring:focus {
                outline: 2px solid #06b6d4;
                outline-offset: 2px;
              }

              /* Selection styles */
              ::selection {
                background-color: #06b6d4;
                color: white;
              }

              ::-moz-selection {
                background-color: #06b6d4;
                color: white;
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan-500 text-white px-4 py-2 rounded-lg z-50 focus-ring"
        >
          Skip to main content
        </a>

        <Navbar />
        <main id="main-content" className="animate-fade-in">
          {children}
        </main>
        <Footer />

        {/* Additional Analytics Helper Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Custom event tracking helper
              window.trackEvent = function(eventName, parameters = {}) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', eventName, {
                    event_category: 'LazyCLI',
                    event_label: window.location.pathname,
                    ...parameters
                  });
                }
              };

              // Track CLI installation attempts
              window.trackInstallAttempt = function(method = 'unknown') {
                window.trackEvent('cli_install_attempt', {
                  install_method: method,
                  page: window.location.pathname
                });
              };

              // Track contribution uploads
              window.trackContribution = function(scriptName = 'unknown') {
                window.trackEvent('script_contribution', {
                  script_name: scriptName,
                  contributor_page: window.location.pathname
                });
              };

              // Track scroll depth
              let maxScroll = 0;
              window.addEventListener('scroll', function() {
                const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                  maxScroll = scrollPercent;
                  window.trackEvent('scroll_depth', {
                    scroll_percent: scrollPercent
                  });
                }
              });

              // Track page visibility
              document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'hidden') {
                  window.trackEvent('page_exit', {
                    time_on_page: Math.round((Date.now() - performance.timing.navigationStart) / 1000)
                  });
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
