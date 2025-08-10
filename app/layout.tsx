import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Lora } from "next/font/google"
import "./globals.css"
import { Toaster } from 'sonner';
import { ServiceWorkerRegistrar } from "@/components/pwa/service-worker-registrar";

// Load fonts from Google using next/font/google
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const lora = Lora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "ARTSCore - Wnętrza, które sprzedają Twoje inwestycje",
  description: "Wnętrza, które sprzedają Twoje inwestycje",
  icons: {
    icon: '/images/arts-logo.png',
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={`${montserrat.variable} ${lora.variable}`}>
      <body className={montserrat.className}>
        <ServiceWorkerRegistrar />
        <Toaster />
        {children}
      </body>
    </html>
  )
}