import PrimaryButton from "@/app/components/shared/PrimaryButton";
import { on } from "@/app/lib/types";

// Generic nimo-core "tx_button" widget (view-1.php) - see ElementorHeading
// for why this exists (a one-off page built with plain Elementor/nimo-core
// blocks rather than a page-specific widget). `enable_animation` defaults
// to "yes" in the widget's own PHP control, so a missing value here (the
// usual Elementor default-omission) still means enabled.
export default function ElementorButton({ settings }: { settings: any }) {
  const animated = on(settings.enable_animation ?? "yes");
  return (
    <div
      className={animated ? `wow ${settings.wow_animation || "fadeIn"}` : undefined}
      data-wow-duration={settings.wow_duration ? `${settings.wow_duration}ms` : undefined}
      data-wow-delay={settings.wow_delay ? `${settings.wow_delay}ms` : undefined}
    >
      <PrimaryButton text={settings.button_text} link={settings.button_link} icon={settings.selected_icon} />
    </div>
  );
}
