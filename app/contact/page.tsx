import type { Metadata } from "next";
import { renderElementorTree } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import contactData from "@/content/pages/contact.json";

export const metadata: Metadata = {
  title: "Contact - Nimo",
};

export default function ContactPage() {
  return (
    <main>
      <PageBreadcrumb title="Contact" current="Contact" />
      {renderElementorTree(contactData as ElementorNode[])}
    </main>
  );
}
