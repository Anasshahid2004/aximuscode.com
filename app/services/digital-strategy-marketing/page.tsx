import type { Metadata } from "next";
import { renderElementorTree } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import serviceData from "@/content/pages/digital-strategy-marketing.json";
import styles from "./ServiceDetail.module.css";

export const metadata: Metadata = {
  title: "Digital Strategy & Marketing - Nimo",
  description: "Business Consulting Agency",
};

// Ports post 147 ("Digital Strategy & Marketing", the demo content's one
// concrete "services" CPT entry, used as the "Service Details" nav link's
// target). Unlike every other page, it was authored directly with plain
// Elementor containers/heading/image widgets rather than a nimo-core
// widget - see the extracted tree's outer/inner container settings
// (boxed_width: 1340px, inner column: 70%, padding: 100px 10px),
// reproduced here via ServiceDetail.module.css instead of teaching the
// generic renderer about arbitrary container settings.
export default function DigitalStrategyMarketingPage() {
  const innerContainer = (serviceData as ElementorNode[])[0]?.elements?.[0];
  const widgets = innerContainer?.elements || [];

  return (
    <main>
      <PageBreadcrumb title="Digital Strategy & Marketing" current="Digital Strategy & Marketing" />
      <div className={styles.wrap}>
        <div className={styles.column}>{renderElementorTree(widgets)}</div>
      </div>
    </main>
  );
}
