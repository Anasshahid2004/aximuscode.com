import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./styles/vendor/bootstrap.min.css";
import "./styles/vendor/fontawesome-min.css";
import "./styles/vendor/flaticon-nimo.css";
import "./styles/vendor/animate-min.css";
import "./styles/vendor/swiper.min.css";
import "./styles/vendor/nice-select.css";
import "./styles/vendor/nimo-core.css";
import "./styles/vendor/nimo-extra.css";
import "./styles/vendor/nimo-companion.css";
import "./globals.css";
import SiteHeader from "@/app/components/layout/SiteHeader";
import SiteFooter from "@/app/components/layout/SiteFooter";
import ScrollReveal from "@/app/components/shared/ScrollReveal";
import SmoothScroll from "@/app/components/shared/SmoothScroll";
import CursorEffects from "@/app/components/shared/CursorEffects";
import headerData from "@/content/pages/header.json";
import footerData from "@/content/pages/footer.json";
import { findFirstWidgetSettings } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nimo - Creative Digital Agency",
  description: "We design digital solutions that elevate your brand and boost conversions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerSettings = findFirstWidgetSettings(headerData as ElementorNode[]);
  const footerSettings = findFirstWidgetSettings(footerData as ElementorNode[]);

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <div className="page-wrapper main-wrapper">
          <SiteHeader settings={headerSettings} />
          {children}
          <SiteFooter settings={footerSettings} />
        </div>
        <SmoothScroll />
        <ScrollReveal />
        <CursorEffects />
      </body>
    </html>
  );
}
