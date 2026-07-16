import type { Metadata } from "next";
import { renderElementorTree } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import faqsPageData from "@/content/pages/faqs-page.json";

export const metadata: Metadata = {
  title: "FAQs - Nimo",
  description: "Learn more from FAQs",
};

export default function FaqsPage() {
  return (
    <main>
      <PageBreadcrumb title="FAQs page" current="FAQs page" />
      {renderElementorTree(faqsPageData as ElementorNode[])}
    </main>
  );
}
