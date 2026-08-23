import type { RegionId } from "@firdawsi/tokens";
import type { Density, Direction, ThemeName } from "@firdawsi/web";
import {
  AppHeader,
  Atmosphere,
  Badge,
  Chip,
  EmptyState,
  Frame,
  PatternSurface,
  PrayerPlaque,
  Progress,
  Select,
  Table,
  Tabs,
  Text,
  ThemeProvider,
} from "@firdawsi/web";
import { useMemo, useState } from "react";

import {
  COURTYARD_CITIES,
  PRAYER_LABELS,
  PRAYER_ORDER,
  courtyardDaySchedule,
  courtyardWeek,
  type CityId,
} from "./courtyard-schedule";
import { KhatamMark } from "./khatam-mark";

const REGION_OPTIONS: { value: RegionId; label: string }[] = [
  { value: "andalusi-maghrebi", label: "Andalusi" },
  { value: "universal", label: "Universal" },
  { value: "ottoman", label: "Ottoman" },
];

function presetForRegion(region: RegionId) {
  return region === "ottoman" ? "khatam-8-star-cross" : "zellige-star-cross";
}

export function CourtyardSection() {
  const [cityId, setCityId] = useState<CityId>("granada");
  const [theme, setTheme] = useState<ThemeName>("light");
  const [direction, setDirection] = useState<Direction>("ltr");
  const [density, setDensity] = useState<Density>("comfortable");
  const [region, setRegion] = useState<RegionId>("andalusi-maghrebi");
  const [tab, setTab] = useState("today");

  const day = useMemo(() => courtyardDaySchedule(cityId), [cityId]);
  const week = useMemo(() => courtyardWeek(cityId), [cityId]);
  const next = day.prayers.find((prayer) => prayer.id === day.nextId);

  return (
    <ThemeProvider
      theme={theme}
      direction={direction}
      region={region}
      density={density}
      applyToDocument={false}
      onThemeChange={setTheme}
      onDirectionChange={setDirection}
      onRegionChange={setRegion}
      onDensityChange={setDensity}
    >
      <Atmosphere
        className="courtyard-desk"
        tone="courtyard-wash"
        pattern
        presetId={presetForRegion(region)}
        patternOptions={{ density: 0.2, simplificationTier: "compact" }}
      >
        <AppHeader
          brand={<KhatamMark size={28} />}
          title={
            <span className="courtyard-desk__title">
              <Text role="title-md" as="span">Courtyard timetable</Text>
              <Text role="title-sm" lang="ar" as="span">فناء</Text>
            </span>
          }
          actions={
            next ? (
              <Badge>
                Next · {next.nameEn}
                <span lang="ar" dir="rtl"> {next.nameAr}</span>
              </Badge>
            ) : (
              <Badge>Night interval</Badge>
            )
          }
        />

        <div className="courtyard-desk__controls">
          <Select
            label="City"
            value={cityId}
            onChange={(event) => setCityId(event.target.value as CityId)}
            options={COURTYARD_CITIES.map((city) => ({
              value: city.id,
              label: `${city.nameEn} · ${city.nameAr}`,
            }))}
          />
          <Select
            label="Region overlay"
            value={region}
            onChange={(event) => setRegion(event.target.value as RegionId)}
            options={REGION_OPTIONS}
          />
          <div className="courtyard-desk__toggles" role="group" aria-label="Courtyard display">
            <div className="courtyard-desk__chips" aria-label="Courtyard theme">
              {(["light", "dark", "highContrast"] as const).map((option) => (
                <Chip
                  key={option}
                  selected={theme === option}
                  onClick={() => setTheme(option)}
                >
                  {option === "highContrast" ? "Contrast" : option}
                  <span className="sr-only"> courtyard theme</span>
                </Chip>
              ))}
            </div>
            <div className="courtyard-desk__chips" aria-label="Courtyard direction">
              <Chip selected={direction === "ltr"} onClick={() => setDirection("ltr")}>
                LTR<span className="sr-only"> courtyard</span>
              </Chip>
              <Chip selected={direction === "rtl"} onClick={() => setDirection("rtl")}>
                RTL<span className="sr-only"> courtyard</span>
              </Chip>
            </div>
            <div className="courtyard-desk__chips" aria-label="Courtyard density">
              <Chip selected={density === "comfortable"} onClick={() => setDensity("comfortable")}>
                Comfortable
              </Chip>
              <Chip selected={density === "compact"} onClick={() => setDensity("compact")}>
                Compact
              </Chip>
            </div>
          </div>
        </div>

        <Frame options={{ density: 0.18, simplificationTier: "compact" }} className="courtyard-desk__note">
          <Text role="body-sm">A schedule, not scripture: next prayer framed by quiet geometry.</Text>
        </Frame>

        <Tabs
          label="Courtyard views"
          value={tab}
          onValueChange={setTab}
          items={[
            {
              id: "today",
              label: "Today",
              content: (
                <div className="courtyard-desk__today">
                  <PatternSurface
                    className="courtyard-plaque"
                    presetId={presetForRegion(region)}
                    intensity="quiet"
                    options={{ density: 0.22, simplificationTier: "compact" }}
                  >
                    <PrayerPlaque
                      id="prayer-plaque"
                      locationAr={day.locationAr}
                      locationEn={day.locationEn}
                      dateLabel={day.dateLabel}
                      prayers={day.prayers}
                      nextId={day.nextId}
                      remainingLabel={day.remainingLabel}
                    />
                  </PatternSurface>
                  {day.nightRest ? (
                    <EmptyState title="Night interval">
                      <Text role="body-sm">Isha has passed. Fajr is the next mark on this timetable.</Text>
                    </EmptyState>
                  ) : (
                    <Progress
                      label={next ? `Until ${next.nameEn}` : "Next prayer"}
                      value={day.progress ?? 0}
                      showValue
                    />
                  )}
                </div>
              ),
            },
            {
              id: "week",
              label: "Week",
              content: (
                <Table caption={`This week in ${day.locationEn}`}>
                  <thead>
                    <tr>
                      <th scope="col">Day</th>
                      {PRAYER_ORDER.map((id) => (
                        <th key={id} scope="col">
                          <span>{PRAYER_LABELS[id].nameEn}</span>
                          <span lang="ar" dir="rtl">{PRAYER_LABELS[id].nameAr}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {week.map((row) => (
                      <tr key={row.weekday}>
                        <th scope="row">{row.weekday}</th>
                        {PRAYER_ORDER.map((id) => (
                          <td key={id}>
                            <span dir="ltr">{row.prayers[id]}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ),
            },
          ]}
        />
      </Atmosphere>
    </ThemeProvider>
  );
}
