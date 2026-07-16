import type { Metadata } from "next";
import { renderElementorTree } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import chooseUsData from "@/content/pages/choose-us.json";

export const metadata: Metadata = {
  title: "Choose Us - Nimo",
  description: "We area offing the best solutions",
};

export default function ChooseUsPage() {
  return (
    <main>
      <PageBreadcrumb title="Choose Us" current="Choose Us" />
      {renderElementorTree(chooseUsData as ElementorNode[])}
    </main>
  );
}
