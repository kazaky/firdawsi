import { type ReactNode } from "react";
import { KhatamMark } from "./khatam-mark";

const GITHUB_URL = "https://github.com/kazaky/firdawsi";
const SITE_URL = "https://firdawsi.org";

export const guideNavGroups = [
  {
    label: "Start",
    items: [
      { id: "overview", label: "Overview", icon: "home" },
      { id: "principles", label: "Manifesto", icon: "star" },
      { id: "foundations", label: "Foundations", icon: "palette" },
    ],
  },
  {
    label: "System",
    items: [
      { id: "geometry", label: "Geometry", icon: "grid" },
      { id: "regions", label: "Regions", icon: "map" },
      { id: "components", label: "Components", icon: "blocks" },
    ],
  },
  {
    label: "Craft",
    items: [
      { id: "motion", label: "Motion", icon: "motion" },
      { id: "accessibility", label: "Access", icon: "access" },
      { id: "studio", label: "Pattern Studio", icon: "studio" },
    ],
  },
] as const;

function NavGlyph({ kind }: { kind: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const };
  switch (kind) {
    case "home":
      return (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path {...common} d="M3 8.5 10 3l7 5.5V17H3Z" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path {...common} d="M10 3 12 8l5 .5-3.8 3 1.2 5L10 14l-4.4 2.5 1.2-5L3 8.5 8 8Z" />
        </svg>
      );
    case "palette":
      return (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <circle {...common} cx="10" cy="10" r="7" />
          <circle fill="currentColor" cx="7" cy="8" r="1.2" />
          <circle fill="currentColor" cx="13" cy="8" r="1.2" />
          <circle fill="currentColor" cx="10" cy="13" r="1.2" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path {...common} d="M4 4h5v5H4Zm7 0h5v5h-5ZM4 11h5v5H4Zm7 0h5v5h-5Z" />
        </svg>
      );
    case "map":
      return (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path {...common} d="M3 6l5-2 4 2 5-2v12l-5 2-4-2-5 2Z" />
        </svg>
      );
    case "blocks":
      return (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <rect {...common} x="3" y="3" width="6" height="6" rx="1" />
          <rect {...common} x="11" y="3" width="6" height="6" rx="1" />
          <rect {...common} x="3" y="11" width="6" height="6" rx="1" />
          <rect {...common} x="11" y="11" width="6" height="6" rx="1" />
        </svg>
      );
    case "motion":
      return (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path {...common} d="M4 14c3-8 9-8 12 0" />
          <path {...common} d="M10 6v8M7 9l3-3 3 3" />
        </svg>
      );
    case "access":
      return (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <circle {...common} cx="10" cy="5" r="2" />
          <path {...common} d="M5 17v-2a5 5 0 0 1 10 0v2" />
        </svg>
      );
    case "studio":
      return (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path {...common} d="M4 16 10 4l6 12" />
          <path {...common} d="M7 11h6" />
        </svg>
      );
    default:
      return null;
  }
}

export function GuidePanel({
  active,
  mobileOpen,
  onNavigate,
}: {
  active: string;
  mobileOpen: boolean;
  onNavigate?: () => void;
}) {
  return (
    <aside id="guide-panel" className={`guide-panel${mobileOpen ? " guide-panel--open" : ""}`} aria-label="Site guide">
      <div className="guide-panel__brand">
        <KhatamMark size={36} />
        <div>
          <strong>Firdawsi</strong>
          <span lang="ar" dir="rtl">فردوسي</span>
        </div>
      </div>

      <nav className="guide-panel__nav" aria-label="Showcase sections">
        {guideNavGroups.map((group) => (
          <div className="guide-panel__group" key={group.label}>
            <p className="guide-panel__group-label">{group.label}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active === item.id ? "location" : undefined}
                    onClick={onNavigate}
                  >
                    <NavGlyph kind={item.icon} />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="guide-panel__footer">
        <a className="guide-panel__pill guide-panel__pill--primary" href={GITHUB_URL} rel="noreferrer">
          View on GitHub <span aria-hidden="true">↗</span>
        </a>
        <a className="guide-panel__pill" href={SITE_URL} rel="noreferrer">
          firdawsi.org
        </a>
        <p className="guide-panel__meta">Open source · v0.1 · 2026</p>
      </div>
    </aside>
  );
}

export function GuideMenuButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="guide-menu-button"
      aria-expanded={open}
      aria-controls="guide-panel"
      onClick={onClick}
    >
      <span className="sr-only">{open ? "Close guide" : "Open guide"}</span>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        {open ? (
          <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M4 7h16M4 12h10M4 17h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}

export function GuideScrim({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <button
      type="button"
      className={`guide-scrim${open ? " guide-scrim--visible" : ""}`}
      aria-label="Close guide"
      aria-hidden={!open}
      tabIndex={open ? 0 : -1}
      onClick={onClose}
    />
  );
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="text-link" href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  );
}

export { GITHUB_URL, SITE_URL };
