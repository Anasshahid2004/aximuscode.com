// Generic Elementor core "image" widget - see ElementorHeading.tsx for why
// this exists (a one-off page built with plain Elementor blocks instead of
// a nimo-core widget).
export default function ElementorImage({ settings }: { settings: any }) {
  const url = settings.image?.url;
  if (!url) return null;

  const style: React.CSSProperties = { width: "100%", display: "block" };
  const br = settings.image_border_radius;
  if (br) style.borderRadius = `${br.top}${br.unit} ${br.right}${br.unit} ${br.bottom}${br.unit} ${br.left}${br.unit}`;

  return <img src={url} alt={settings.image?.alt || ""} style={style} />;
}
