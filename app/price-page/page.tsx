import type { Metadata } from "next";
import { renderElementorTree } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import PricingPin from "@/app/components/shared/PricingPin";
import pricePageData from "@/content/pages/price-page.json";

export const metadata: Metadata = {
  title: "Price Page - Nimo",
  description: "Nimo Digital marketing agency pricing",
};

export default function PricePage() {
  return (
    <main>
      <PageBreadcrumb title="Price Page" current="Price Page" />
      <PricingPin />
      {renderElementorTree(pricePageData as ElementorNode[])}
    </main>
  );
}
