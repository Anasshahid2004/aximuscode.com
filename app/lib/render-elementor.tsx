import type { ElementorNode } from "./types";
import HeroSection from "@/app/components/widgets/HeroSection";
import Brand from "@/app/components/widgets/Brand";
import About from "@/app/components/widgets/About";
import Tabs from "@/app/components/widgets/Tabs";
import ServiceSection from "@/app/components/widgets/ServiceSection";
import Testimonial from "@/app/components/widgets/Testimonial";
import TeamLists from "@/app/components/widgets/TeamLists";
import PostGrid from "@/app/components/widgets/PostGrid";
import ContactInfo from "@/app/components/widgets/ContactInfo";
import CountBox from "@/app/components/widgets/CountBox";
import FaqAccordion from "@/app/components/widgets/FaqAccordion";
import PricingSection from "@/app/components/widgets/PricingSection";
import Newsletter from "@/app/components/widgets/Newsletter";
import ElementorHeading from "@/app/components/shared/ElementorHeading";
import ElementorImage from "@/app/components/shared/ElementorImage";
import ElementorButton from "@/app/components/shared/ElementorButton";

const WIDGETS: Record<string, React.ComponentType<{ settings: any }>> = {
  tx_hero_section: HeroSection,
  tx_brand: Brand,
  tx_about: About,
  tx_tabs: Tabs,
  tx_service_section: ServiceSection,
  tx_testimonial: Testimonial,
  tx_team_lists: TeamLists,
  tx_post_grid: PostGrid,
  tx_contact_info: ContactInfo,
  tx_count_box: CountBox,
  tx_faq: FaqAccordion,
  tx_button: ElementorButton,
  tx_pricing_section: PricingSection,
  tx_newsletter: Newsletter,
  heading: ElementorHeading,
  image: ElementorImage,
};

export function findFirstWidgetSettings(nodes: ElementorNode[]): any {
  for (const node of nodes) {
    if (node.elType === "widget") return node.settings;
    if (node.elements?.length) {
      const found = findFirstWidgetSettings(node.elements);
      if (found) return found;
    }
  }
  return null;
}

export function renderElementorTree(nodes: ElementorNode[]): React.ReactNode {
  return nodes.map((node) => renderElementorNode(node));
}

function renderElementorNode(node: ElementorNode): React.ReactNode {
  if (node.elType === "widget" && node.widgetType) {
    const Widget = WIDGETS[node.widgetType];
    if (!Widget) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`No component registered for widget "${node.widgetType}"`);
      }
      return null;
    }
    return <Widget key={node.id} settings={node.settings} />;
  }

  if (node.elements?.length) {
    return <div key={node.id}>{renderElementorTree(node.elements)}</div>;
  }

  return null;
}
