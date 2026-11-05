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

export const HeartIcon = (p: IconProps) => (
  <Svg {...p} fill={solid}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </Svg>
);

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

export function UnitIcon({ unit, ...p }: IconProps & { unit: "emerald" | "indigo" | "amber" }) {
  if (unit === "emerald") return <CodeIcon {...p} />;
  if (unit === "indigo") return <LayoutIcon {...p} />;
  return <BracesIcon {...p} />;
}
