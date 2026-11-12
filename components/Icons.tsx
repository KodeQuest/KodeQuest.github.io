import type { LanguageColor } from "@/lib/data";
import type { ReactNode } from "react";

type IconProps = { size?: number; className?: string };

function Svg({ size = 24, className, children, fill = "none" }: IconProps & { children: ReactNode; fill?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={fill === "none" ? 2.5 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const solid = "currentColor";

export const FlameIcon = (p: IconProps) => (
  <Svg {...p} fill={solid}>
    <path d="M12 2c.8 3.2 5.5 5.6 5.5 10.6A5.5 5.5 0 0 1 12 18.1a5.5 5.5 0 0 1-5.5-5.5c0-2.1 1-3.7 2.2-4.8.1 1.9.9 3 2 3.2C9.9 8 10.6 4.6 12 2z" />
    <path d="M12 22a4 4 0 0 1-4-4c0-1.2.6-2 1.4-2.8.3 1 .9 1.6 1.7 1.8-.2-1.3.2-2.4.9-3.4.9 1.1 3.9 2.4 3.9 4.4a4 4 0 0 1-3.9 4z" opacity=".55" />
  </Svg>
);

export const BoltIcon = (p: IconProps) => (
  <Svg {...p} fill={solid}>
    <path d="M13.5 2L4 13.5h6.5L9.5 22 20 9.5h-6.7L13.5 2z" />
  </Svg>
);

export const StarIcon = (p: IconProps) => (
  <Svg {...p} fill={solid}>
    <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21.1 7 14.2 2 9.3l6.9-1L12 2z" />
  </Svg>
);

export const LockIcon = (p: IconProps) => (
  <Svg {...p} fill={solid}>
    <rect x="5" y="11" width="14" height="10" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const SettingsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0" strokeWidth="2.2" />
    <circle cx="15" cy="6" r="2.5" />
    <circle cx="9" cy="12" r="2.5" />
    <circle cx="17" cy="18" r="2.5" />
  </Svg>
);

export const DownloadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" />
  </Svg>
);

export const UploadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 16V5m0 0L7.5 9.5M12 5l4.5 4.5M5 20h14" />
  </Svg>
);

export const CodeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
  </Svg>
);

export const LayoutIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M9.5 10v9.5" />
  </Svg>
);

export const BracesIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 4c-2 0-3 1-3 3v2c0 1.2-.8 2.4-2 3 1.2.6 2 1.8 2 3v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1.2.8 2.4 2 3-1.2.6-2 1.8-2 3v2c0 2-1 3-3 3" />
  </Svg>
);

export const TrophyIcon = (p: IconProps) => (
  <Svg {...p} fill={solid}>
    <path d="M7 3h10v6a5 5 0 0 1-10 0V3z" />
    <path d="M7 5H3.5c0 3 1.2 4.6 3.7 5M17 5h3.5c0 3-1.2 4.6-3.7 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <rect x="10.5" y="13.5" width="3" height="4" />
    <rect x="7.5" y="17.5" width="9" height="3" rx="1.2" />
  </Svg>
);

export function UnitIcon({ unit, ...p }: IconProps & { unit: LanguageColor }) {
  if (unit === "emerald") return <CodeIcon {...p} />;
  if (unit === "indigo") return <LayoutIcon {...p} />;
  return <BracesIcon {...p} />;
}

export const ContactIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-4.5 3.5V17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    <path d="M8 10h8M8 13h5" strokeWidth="2.2" />
  </Svg>
);

export const GithubIcon = (p: IconProps) => (
  <Svg {...p} fill={solid}>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </Svg>
);

export const WhatsappIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z" />
    <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2L9 8.5z" fill="currentColor" strokeWidth="1" />
  </Svg>
);

/** Terminal (prompt `>_`) untuk tautan Sandbox. */
export const SandboxIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="3" />
    <path d="M7.5 10l3 2.5-3 2.5M13 15h3.5" />
  </Svg>
);
