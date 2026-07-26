import type { Metadata } from "next";
import { renderElementorTree } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import teamData from "@/content/pages/alfred-noble.json";
import styles from "@/app/teams/alfred-noble/TeamDetail.module.css";

export const metadata: Metadata = {
  title: "About Us - Nimo",
};

// The nav's "About" item has no dedicated "About Us" page/content of its own
// in the demo data - per request, it reuses the same content as the "Team
// Details" page (post 75, "Alfred Noble") while staying at its own /about-us
// URL, rather than redirecting to /teams/alfred-noble.
export default function AboutUsPage() {
  const card = (teamData as ElementorNode[])[0]?.elements?.[0];
  const [left, right] = card?.elements || [];

  return (
    <main>
      <PageBreadcrumb title="About Us" current="About Us" />
      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.left}>{renderElementorTree(left?.elements || [])}</div>
          <div className={styles.right}>{renderElementorTree(right?.elements || [])}</div>
        </div>
      </div>
    </main>
  );
}
