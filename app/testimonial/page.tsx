import type { Metadata } from "next";
import { renderElementorTree } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import testimonialData from "@/content/pages/testimonial.json";

export const metadata: Metadata = {
  title: "Testimonial - Nimo",
};

export default function TestimonialPage() {
  return (
    <main>
      <PageBreadcrumb title="Testimonial" current="Testimonial" />
      {renderElementorTree(testimonialData as ElementorNode[])}
    </main>
  );
}
