import type { IconValue } from "@/app/lib/types";

// Mirrors \Elementor\Icons_Manager::render_icon() - the icon "value" is
// already a ready-to-use Font Awesome / Flaticon class string.
export default function ElementorIcon({ icon }: { icon?: IconValue }) {
  if (!icon?.value) return null;
  return <i className={icon.value.trim()} aria-hidden="true" />;
}
