import type { Metadata } from "next";
import { renderElementorTree } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import ourTeamData from "@/content/pages/our-team.json";

export const metadata: Metadata = {
  title: "Our Team - Nimo",
  description: "Meet the team behind Nimo.",
};

export default function OurTeamPage() {
  return (
    <main>
      <PageBreadcrumb title="Our Team" current="Our Team" />
      {renderElementorTree(ourTeamData as ElementorNode[])}
    </main>
  );
}
