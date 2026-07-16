import { renderElementorTree } from "@/app/lib/render-elementor";
import type { ElementorNode } from "@/app/lib/types";
import homeData from "@/content/pages/home.json";

export default function Home() {
  return <main>{renderElementorTree(homeData as ElementorNode[])}</main>;
}
