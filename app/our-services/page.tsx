import type { Metadata } from "next";
import { renderElementorTree } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import ourServicesData from "@/content/pages/our-services.json";

export const metadata: Metadata = {
  title: "Our Services - Nimo",
  description: "We area offing the best solutions",
};

export default function OurServicesPage() {
  return (
    <main>
      <PageBreadcrumb title="Our Services" current="Our Services" />
      {renderElementorTree(ourServicesData as ElementorNode[])}
    </main>
  );
}
