import type { RegionId } from "@firdawsi/tokens";
import type { Density, Direction, ThemeName } from "@firdawsi/web";
import {
  AppHeader,
  Atmosphere,
  Badge,
  Button,
  Checkbox,
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
  TextField,
  ThemeProvider,
} from "@firdawsi/web";
import { useEffect, useMemo, useState, type FormEvent } from "react";

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

interface CourtyardTask {
  id: string;
  title: string;
  complete: boolean;
}

const TASK_STORAGE_KEY = "firdawsi.courtyard.tasks.v1";

function readTasks(): CourtyardTask[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(TASK_STORAGE_KEY) ?? "[]");
    return Array.isArray(saved)
      ? saved.filter((task): task is CourtyardTask =>
          typeof task?.id === "string" && typeof task?.title === "string" && typeof task?.complete === "boolean")
      : [];
  } catch {
    return [];
  }
}

export function CourtyardSection() {
  const [cityId, setCityId] = useState<CityId>("granada");
  const [theme, setTheme] = useState<ThemeName>("light");
  const [direction, setDirection] = useState<Direction>("ltr");
  const [density, setDensity] = useState<Density>("comfortable");
  const [region, setRegion] = useState<RegionId>("andalusi-maghrebi");
  const [tab, setTab] = useState("today");
  const [tasks, setTasks] = useState<CourtyardTask[]>(readTasks);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("Your tasks stay on this device.");
  const [removed, setRemoved] = useState<CourtyardTask | null>(null);

  useEffect(() => {
    window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const day = useMemo(() => courtyardDaySchedule(cityId), [cityId]);
  const week = useMemo(() => courtyardWeek(cityId), [cityId]);
  const next = day.prayers.find((prayer) => prayer.id === day.nextId);
  const openTasks = tasks.filter((task) => !task.complete).length;

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) {
      setMessage("Write a task before adding it.");
      return;
    }
    setTasks((current) => [...current, { id: `${Date.now()}-${current.length}`, title, complete: false }]);
    setDraft("");
    setRemoved(null);
    setMessage(`Added “${title}”.`);
  }

  function toggleTask(id: string, complete: boolean) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, complete } : task));
    setRemoved(null);
    setMessage(complete ? "Task settled. Your result stays visible." : "Task returned to the open list.");
  }

  function removeTask(task: CourtyardTask) {
    setTasks((current) => current.filter((item) => item.id !== task.id));
    setRemoved(task);
    setMessage(`Removed “${task.title}”.`);
  }

  function undoRemove() {
    if (!removed) return;
    setTasks((current) => [...current, removed]);
    setMessage(`Restored “${removed.title}”.`);
    setRemoved(null);
  }

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
              <Badge>{openTasks ? `${openTasks} open` : "All settled"}</Badge>
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
                  <div className="courtyard-desk__prayer">
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

                  <section className="courtyard-tasks" aria-labelledby="courtyard-tasks-title">
                    <header>
                      <div>
                        <h3 id="courtyard-tasks-title"><Text role="title-md" as="span">Today’s intentions</Text></h3>
                        <Text role="body-sm">Capture the next meaningful action. Nothing leaves this device.</Text>
                      </div>
                      <Badge>{openTasks} open</Badge>
                    </header>
                    <form className="courtyard-tasks__capture" onSubmit={addTask}>
                      <TextField
                        label="Quick capture"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder="What needs your attention?"
                        autoComplete="off"
                      />
                      <Button type="submit">Add intention</Button>
                    </form>
                    {tasks.length === 0 ? (
                      <EmptyState title="A quiet beginning">
                        <Text role="body-sm">Add one intention when you are ready.</Text>
                      </EmptyState>
                    ) : (
                      <ul className="courtyard-tasks__list" aria-label="Today’s intentions">
                        {tasks.map((task) => (
                          <li key={task.id} className={task.complete ? "is-complete" : undefined}>
                            <Checkbox
                              label={task.title}
                              checked={task.complete}
                              onChange={(event) => toggleTask(task.id, event.target.checked)}
                            />
                            <Button
                              variant="quiet"
                              size="sm"
                              type="button"
                              aria-label={`Remove ${task.title}`}
                              onClick={() => removeTask(task)}
                            >
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="courtyard-tasks__status" role="status" aria-live="polite">
                      <span>{message}</span>
                      {removed && <Button variant="quiet" size="sm" type="button" onClick={undoRemove}>Undo</Button>}
                    </div>
                  </section>
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
