import ElementorIcon from "./ElementorIcon";
import type { IconValue, LinkValue } from "@/app/lib/types";

export default function PrimaryButton({
  text,
  link,
  icon,
  className = "",
}: {
  text?: string;
  link?: LinkValue;
  icon?: IconValue;
  className?: string;
}) {
  if (!text) return null;
  return (
    <a
      href={link?.url || "#"}
      target={link?.is_external ? "_blank" : "_self"}
      rel={link?.nofollow ? "nofollow" : undefined}
      aria-label={text}
      className={`nm-pr-btn-1 has-v2 wa_magnetic_btn_2 ${className}`}
    >
      {icon?.value && (
        <span className="icon wa_magnetic_btn_2_elm">
          <ElementorIcon icon={icon} />
          <ElementorIcon icon={icon} />
        </span>
      )}
      <span className="text" data-back={text} data-front={text} />
    </a>
  );
}
