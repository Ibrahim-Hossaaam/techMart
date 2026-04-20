import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/footer/Footer";
import Navbar from "@/components/layout/navbar/Navbar";
import { Toaster } from "@/components/ui/sonner";
import ProvidersWrapper from "@/Providers/ProviderWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NexaShop — Premium Tech Store",
  description: "Discover the latest tech products at unbeatable prices. Shop laptops, smartphones, accessories and more.",
  keywords: "tech store, electronics, laptops, smartphones, gadgets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <ProvidersWrapper>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Toaster richColors position="top-right" />
          <Footer />
        </ProvidersWrapper>
      </body>
    </html>
  );
}
