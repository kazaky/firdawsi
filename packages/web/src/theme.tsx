import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { themeAttribute, type RegionId } from "@firdawsi/tokens";

export type ThemeName = keyof typeof themeAttribute;
export type Direction = "ltr" | "rtl";
export type Density = "comfortable" | "compact" | "spacious";

export interface ThemeContextValue {
  theme: ThemeName;
  direction: Direction;
  region: RegionId;
  density: Density;
  setTheme: (theme: ThemeName) => void;
  setDirection: (direction: Direction) => void;
  setRegion: (region: RegionId) => void;
  setDensity: (density: Density) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return value;
}

export function ThemeProvider({
  theme = "light",
  direction = "ltr",
  region = "andalusi-maghrebi",
  density = "comfortable",
  applyToDocument = true,
  children,
  onThemeChange,
  onDirectionChange,
  onRegionChange,
  onDensityChange,
}: {
  theme?: ThemeName;
  direction?: Direction;
  region?: RegionId;
  density?: Density;
  applyToDocument?: boolean;
  children: ReactNode;
  onThemeChange?: (theme: ThemeName) => void;
  onDirectionChange?: (direction: Direction) => void;
  onRegionChange?: (region: RegionId) => void;
  onDensityChange?: (density: Density) => void;
}) {
  useEffect(() => {
    if (!applyToDocument) return;
    const root = document.documentElement;
    root.dataset.theme = themeAttribute[theme];
    root.dataset.region = region;
    root.dataset.density = density;
    root.setAttribute("dir", direction);
    root.lang = direction === "rtl" ? "ar" : "en";
  }, [applyToDocument, theme, direction, region, density]);

  const value: ThemeContextValue = {
    theme,
    direction,
    region,
    density,
    setTheme: (next) => onThemeChange?.(next),
    setDirection: (next) => onDirectionChange?.(next),
    setRegion: (next) => onRegionChange?.(next),
    setDensity: (next) => onDensityChange?.(next),
  };

  return (
    <ThemeContext.Provider value={value}>
      <div
        className="firdawsi-theme"
        data-theme={themeAttribute[theme]}
        data-region={region}
        data-density={density}
        dir={direction}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
