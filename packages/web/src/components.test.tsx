import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { generateCorners, generateFrame, generatePreset } from "@firdawsi/geometry";
import {
  AppHeader,
  Atmosphere,
  Background,
  Button,
  Card,
  Checkbox,
  Dialog,
  Frame,
  IslamicCorner,
  Menu,
  Navigation,
  PatternSurface,
  Tabs,
  TextField,
} from "./components.js";

function normalizeSvg(markup: string) {
  const container = document.createElement("div");
  container.innerHTML = markup;
  return container.innerHTML;
}

describe("foundation controls", () => {
  it("exposes busy and disabled state while a button is loading", () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("applies the arch-corner identity without an ornament prop", () => {
    render(<Button variant="secondary">Facet</Button>);
    expect(screen.getByRole("button", { name: "Facet" })).toHaveAttribute("data-shape", "arch");
  });

  it("connects field labels, hints, and errors", () => {
    render(<TextField label="Email" hint="Work address" error="Invalid address" />);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAccessibleDescription("Work address Invalid address");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("uses native checkbox behavior and an accessible label", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Remember this device" />);
    const checkbox = screen.getByRole("checkbox", { name: "Remember this device" });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});

describe("product chrome", () => {
  it("renders AppHeader brand, title, and actions", () => {
    render(
      <AppHeader brand={<span>Firdawsi</span>} title="Library" actions={<Button>New</Button>} />,
    );
    expect(screen.getByText("Firdawsi")).toBeInTheDocument();
    expect(screen.getByText("Library")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
  });

  it("renders Atmosphere and Background with gradient tone", () => {
    const { container } = render(
      <>
        <Atmosphere tone="lapis-veil">Veil</Atmosphere>
        <Background tone="courtyard-wash">Wash</Background>
      </>,
    );
    expect(container.querySelector('[data-atmosphere="lapis-veil"]')).toBeInTheDocument();
    expect(container.querySelector('[data-atmosphere="courtyard-wash"]')).toBeInTheDocument();
  });

  it("supports navigation icons and badges", () => {
    render(
      <Navigation
        label="Main"
        items={[{ label: "Home", href: "#home", current: true, icon: "⌂", badge: 2 }]}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("uses a surface tier instead of ornamental overlays", () => {
    const { container } = render(
      <Card title="Framed" tier={2}>
        Body
      </Card>,
    );
    const card = container.querySelector(".firdawsi-card");
    expect(card).toHaveAttribute("data-shape", "arch");
    expect(card).toHaveAttribute("data-tier", "2");
    expect(card).toHaveClass("firdawsi-surface--tier-2");
    expect(container.querySelector(".firdawsi-geometry-overlay")).not.toBeInTheDocument();
  });
});

describe("composite controls", () => {
  it("moves tabs with arrow keys and activates the focused tab", async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        label="Account"
        items={[
          { id: "profile", label: "Profile", content: "Profile panel" },
          { id: "security", label: "Security", content: "Security panel" },
        ]}
      />,
    );
    const profile = screen.getByRole("tab", { name: "Profile" });
    profile.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Security" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Security" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Security" })).toBeVisible();
  });

  it("supports menu keyboard navigation, selection, and closure", async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(<Menu label="Actions" items={[{ label: "Archive", onSelect: select }, { label: "Delete", onSelect: vi.fn() }]} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    const menu = screen.getByRole("menu");
    expect(within(menu).getByRole("menuitem", { name: "Archive" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(select).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes a dialog through its labelled close control", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<Dialog open onOpenChange={change} title="Preferences">Content</Dialog>);
    expect(screen.getByRole("dialog", { name: "Preferences" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(change).toHaveBeenCalledWith(false);
  });
});

describe("ornamental geometry", () => {
  it("uses the quiet jali preset as the default surface pattern", () => {
    const { container } = render(<PatternSurface>Content</PatternSurface>);
    const pattern = container.querySelector(".firdawsi-pattern-surface__pattern");
    const expected = generatePreset("jali-8-screen", {
      seed: "firdawsi-web-surface",
      width: 640,
      height: 320,
      density: 0.3,
      palette: ["currentColor", "currentColor", "transparent"],
      simplificationTier: "compact",
      accessibility: { decorative: true },
    }).svg;

    expect(pattern?.innerHTML).toBe(normalizeSvg(expected));
    expect(within(container).getByText("Content")).toBeInTheDocument();
  });

  it("renders a supplied curated preset", () => {
    const { container } = render(
      <PatternSurface presetId="floral-geometric-field" options={{ symmetry: 12 }}>
        Botanical surface
      </PatternSurface>,
    );

    expect(container.querySelector("[data-botanical-role=field]")).toBeInTheDocument();
  });

  it("keeps explicit kind and sizing options working", () => {
    const { container } = render(
      <PatternSurface kind="arch" options={{ width: 320, height: 160 }}>
        Legacy API
      </PatternSurface>,
    );

    expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 320 160");
    expect(screen.getByText("Legacy API")).toBeInTheDocument();
  });

  it("hides decorative geometry from assistive technology", () => {
    const { container } = render(
      <>
        <PatternSurface>Surface</PatternSurface>
        <IslamicCorner>Corner</IslamicCorner>
        <Frame>Frame</Frame>
      </>,
    );

    const overlays = container.querySelectorAll(
      ".firdawsi-pattern-surface__pattern, .firdawsi-geometry-overlay",
    );
    expect(overlays).toHaveLength(3);
    overlays.forEach((overlay) => {
      expect(overlay).toHaveAttribute("aria-hidden", "true");
      expect(overlay.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      expect(overlay.querySelector("svg")).toHaveAttribute("focusable", "false");
    });
  });

  it("keeps frames and corners on restrained v2 constructions", () => {
    const { container } = render(
      <>
        <IslamicCorner>Corner</IslamicCorner>
        <Frame>Frame</Frame>
      </>,
    );
    const overlays = container.querySelectorAll(".firdawsi-geometry-overlay");
    const shared = {
      width: 640,
      height: 320,
      palette: ["currentColor", "currentColor", "transparent"],
      accessibility: { decorative: true },
    } as const;

    expect(overlays[0]?.innerHTML).toBe(normalizeSvg(generateCorners({
      ...shared,
      seed: "firdawsi-web-corners",
      density: 0.22,
      simplificationTier: "compact",
    }).svg));
    expect(overlays[1]?.innerHTML).toBe(normalizeSvg(generateFrame({
      ...shared,
      seed: "firdawsi-web-frame",
      density: 0.28,
      simplificationTier: "regular",
    }).svg));
  });
});
