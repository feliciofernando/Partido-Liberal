import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Partido Liberal - Construindo o Futuro de Angola",
  description: "Plataforma oficial do Partido Liberal. Junte-se a nós na construção de um Angola melhor para todos. Notícias, eventos, programa de governo e muito mais.",
  keywords: ["Partido Liberal", "Angola", "Política", "Eleições", "Democracia", "Liberdade"],
  authors: [{ name: "Partido Liberal" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Partido Liberal - Construindo o Futuro de Angola",
    description: "Junte-se a nós na construção de um Angola melhor para todos.",
    url: "https://partidoliberal.ao",
    siteName: "Partido Liberal",
    type: "website",
    locale: "pt_AO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Partido Liberal - Construindo o Futuro de Angola",
    description: "Junte-se a nós na construção de um Angola melhor para todos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-AO" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Partido Liberal" />
        <meta name="description" content="Plataforma oficial do Partido Liberal. Junte-se a nós na construção de um Angola melhor para todos." />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
