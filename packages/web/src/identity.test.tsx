import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import "./styles.css";
import { archForState } from "@firdawsi/shape";
import { TYPE_ROLES, spring } from "@firdawsi/tokens";
import { Button, Card, Surface, TextField } from "./components.js";
import { Heading, Stack, Text } from "./extras.js";
import { PrayerPlaque } from "./prayer-plaque.js";
import { albercaCss } from "./motion.js";
import { ThemeProvider } from "./theme.js";

afterEach(() => cleanup());

describe("identity without ornament", () => {
  it("keeps buttons recognizable through arch shape, sebka height, and Alberca motion", () => {
    render(<Button>Continue</Button>);
    const button = screen.getByRole("button", { name: "Continue" });
    expect(button).toHaveAttribute("data-shape", "arch");
    expect(button).toHaveAttribute("data-motion", "alberca");
    expect(button).not.toHaveAttribute("data-ornament");
    expect(button.className).toContain("firdawsi-button--md");
  });

  it("carves cards as tonal tiers rather than shadowed boxes", () => {
    const { container } = render(<Card title="Courtyard">Quiet</Card>);
    const card = container.querySelector(".firdawsi-card");
    expect(card).toHaveAttribute("data-shape", "arch");
    expect(card).toHaveClass("firdawsi-surface--tier-1");
    expect(getComputedStyle(card!).boxShadow === "none" || getComputedStyle(card!).boxShadow === "").toBe(true);
  });

  it("exposes dual-optical type roles", () => {
    render(
      <>
        <Heading level={2}>Gardens of light</Heading>
        <Text role="body-md" lang="ar">حدائق النور</Text>
      </>,
    );
    expect(screen.getByRole("heading", { name: "Gardens of light" })).toHaveAttribute("data-type-role", "headline-md");
    expect(screen.getByText("حدائق النور")).toHaveAttribute("data-type-role", "body-md");
    expect(TYPE_ROLES).toContain("body-md");
  });

  it("ThemeProvider writes Andalusi as the default region", () => {
    const { container } = render(
      <ThemeProvider>
        <Surface>Plane</Surface>
      </ThemeProvider>,
    );
    expect(container.querySelector(".firdawsi-theme")).toHaveAttribute("data-region", "andalusi-maghrebi");
    expect(container.querySelector(".firdawsi-theme")).toHaveAttribute("data-theme", "light");
  });

  it("Alberca springs are physically distinct from a linear ease", () => {
    const settle = spring("settle");
    expect(settle.dampingRatio).toBeLessThan(1);
    expect(settle.durationMs).toBeGreaterThan(200);
    expect(albercaCss("settle").transitionDuration).toBe(`${settle.durationMs}ms`);
  });

  it("arch corners morph between rest and pressed", () => {
    const rest = archForState(160, 40, "balanced", "rest");
    const pressed = archForState(160, 40, "balanced", "pressed");
    expect(pressed.rise).toBeLessThan(rest.rise);
  });

  it("fields stay unornamented and still use the grammar", () => {
    render(<TextField label="Name" />);
    const field = screen.getByRole("textbox", { name: "Name" }).closest(".firdawsi-field");
    expect(field).not.toHaveAttribute("data-ornament");
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });

  it("layout primitives exist so composition is not a generic stack of divs", () => {
    render(<Stack gap="4"><Button>One</Button><Button>Two</Button></Stack>);
    expect(document.querySelector(".firdawsi-stack")).toBeInTheDocument();
  });

  it("treats the prayer plaque as a schedule without ornament identity", () => {
    render(
      <PrayerPlaque
        locationAr="غرناطة"
        locationEn="Granada"
        dateLabel="23 Aug 2026"
        nextId="dhuhr"
        remainingLabel="in 2h 14m"
        prayers={[
          { id: "fajr", nameAr: "الفجر", nameEn: "Fajr", at: "05:41" },
          { id: "dhuhr", nameAr: "الظهر", nameEn: "Dhuhr", at: "13:22" },
        ]}
      />,
    );
    const plaque = document.querySelector(".firdawsi-prayer-plaque");
    expect(plaque).toHaveAttribute("data-shape", "arch");
    expect(plaque).not.toHaveAttribute("data-ornament");
    expect(plaque).not.toHaveAttribute("data-corner");
    const nextRow = screen.getByRole("listitem", { current: true });
    expect(nextRow).toHaveTextContent("الظهر");
    expect(nextRow).toHaveTextContent("13:22");
    expect(screen.getByText("Next · Dhuhr")).toBeInTheDocument();
  });
});
