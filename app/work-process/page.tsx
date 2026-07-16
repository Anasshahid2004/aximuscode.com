import type { Metadata } from "next";
import { renderElementorTree } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import workProcessData from "@/content/pages/work-process.json";

export const metadata: Metadata = {
  title: "Work Process - Nimo",
  description: "3 easy steps to get started",
};

export default function WorkProcessPage() {
  return (
    <main>
      <PageBreadcrumb title="Work Process" current="Work Process" />
      {renderElementorTree(workProcessData as ElementorNode[])}
    </main>
  );
}
