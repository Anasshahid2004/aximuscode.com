import type { Metadata } from "next";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import ourTeamData from "@/content/pages/our-team.json";
import TeamGrid from "./TeamGrid";

export const metadata: Metadata = {
  title: "Our Team - Nimo",
  description: "Meet the team behind Nimo.",
};

// The extracted page content also carries an FAQs tabs section after the
// team list (see our-team.json) - dropped here per request so this page
// shows only the team. Team data is read directly off the tx_team_lists
// widget's settings instead of going through renderElementorTree, since the
// page now uses its own TeamGrid design rather than the homepage's
// TeamLists (nm-team-1-*) widget.
export default function OurTeamPage() {
  const teamWidget = (ourTeamData as any[])[0]?.elements?.[0]?.elements?.[0];
  const settings = teamWidget?.settings || {};

  return (
    <main>
      <PageBreadcrumb title="Our Team" current="Our Team" />
      <TeamGrid
        subTitle={settings.sub_title}
        title={settings.title}
        description={settings.description}
        members={settings.team_members || []}
      />
    </main>
  );
}
