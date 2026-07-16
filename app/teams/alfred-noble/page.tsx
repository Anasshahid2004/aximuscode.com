import type { Metadata } from "next";
import { renderElementorTree } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import teamData from "@/content/pages/alfred-noble.json";
import styles from "./TeamDetail.module.css";

export const metadata: Metadata = {
  title: "Team Details - Nimo",
};

// Ports post 75 ("Alfred Noble" in the nav, the demo content's one concrete
// "teams" CPT entry used as the "Team Details" nav link's target) - see
// ElementorHeading/ElementorImage/ElementorButton for why this is rendered
// generically rather than with a page-specific widget.
export default function AlfredNoblePage() {
  const card = (teamData as ElementorNode[])[0]?.elements?.[0];
  const [left, right] = card?.elements || [];

  return (
    <main>
      <PageBreadcrumb title="Team Details" current="Team Details" />
      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.left}>{renderElementorTree(left?.elements || [])}</div>
          <div className={styles.right}>{renderElementorTree(right?.elements || [])}</div>
        </div>
      </div>
    </main>
  );
}
