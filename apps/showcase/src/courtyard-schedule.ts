import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import type { PrayerEntry, PrayerId } from "@firdawsi/web";

export type CityId = "granada" | "cordoba" | "fez";

export interface CourtyardCity {
  id: CityId;
  nameAr: string;
  nameEn: string;
  timeZone: string;
  coordinates: Coordinates;
}

export const COURTYARD_CITIES: readonly CourtyardCity[] = [
  {
    id: "granada",
    nameAr: "غرناطة",
    nameEn: "Granada",
    timeZone: "Europe/Madrid",
    coordinates: new Coordinates(37.1769, -3.5903),
  },
  {
    id: "cordoba",
    nameAr: "قرطبة",
    nameEn: "Córdoba",
    timeZone: "Europe/Madrid",
    coordinates: new Coordinates(37.879, -4.7794),
  },
  {
    id: "fez",
    nameAr: "فاس",
    nameEn: "Fez",
    timeZone: "Africa/Casablanca",
    coordinates: new Coordinates(34.0647, -4.9733),
  },
];

export const PRAYER_LABELS: Record<PrayerId, { nameAr: string; nameEn: string }> = {
  fajr: { nameAr: "الفجر", nameEn: "Fajr" },
  sunrise: { nameAr: "الشروق", nameEn: "Sunrise" },
  dhuhr: { nameAr: "الظهر", nameEn: "Dhuhr" },
  asr: { nameAr: "العصر", nameEn: "Asr" },
  maghrib: { nameAr: "المغرب", nameEn: "Maghrib" },
  isha: { nameAr: "العشاء", nameEn: "Isha" },
};

export const PRAYER_ORDER: PrayerId[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

export function cityById(id: CityId): CourtyardCity {
  return COURTYARD_CITIES.find((city) => city.id === id) ?? COURTYARD_CITIES[0]!;
}

function timeFor(times: PrayerTimes, id: PrayerId): Date {
  switch (id) {
    case "fajr":
      return times.fajr;
    case "sunrise":
      return times.sunrise;
    case "dhuhr":
      return times.dhuhr;
    case "asr":
      return times.asr;
    case "maghrib":
      return times.maghrib;
    case "isha":
      return times.isha;
  }
}

function clock(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
}

function gregorianLabel(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone,
  }).format(date);
}

function weekdayLabel(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone,
  }).format(date);
}

function remainingLabel(from: Date, to: Date): string {
  const minutes = Math.max(0, Math.round((to.getTime() - from.getTime()) / 60_000));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours > 0) return `in ${hours}h ${rest}m`;
  return `in ${rest}m`;
}

function prayerTimesFor(city: CourtyardCity, day: Date): PrayerTimes {
  return new PrayerTimes(city.coordinates, day, CalculationMethod.MuslimWorldLeague());
}

export interface CourtyardDaySchedule {
  cityId: CityId;
  locationAr: string;
  locationEn: string;
  dateLabel: string;
  prayers: PrayerEntry[];
  nextId?: PrayerId;
  remainingLabel?: string;
  progress?: number;
  nightRest: boolean;
}

export function courtyardDaySchedule(cityId: CityId = "granada", now = new Date()): CourtyardDaySchedule {
  const city = cityById(cityId);
  const times = prayerTimesFor(city, now);
  const prayers: PrayerEntry[] = PRAYER_ORDER.map((id) => ({
    id,
    ...PRAYER_LABELS[id],
    at: clock(timeFor(times, id), city.timeZone),
  }));

  const instants = PRAYER_ORDER.map((id) => ({ id, at: timeFor(times, id) }));
  const nextIndex = instants.findIndex((entry) => entry.at.getTime() > now.getTime());
  const nightRest = nextIndex === -1;
  const next = nightRest ? undefined : instants[nextIndex];
  const previous = nextIndex <= 0 ? undefined : instants[nextIndex - 1];

  let progress: number | undefined;
  if (next && previous) {
    const span = next.at.getTime() - previous.at.getTime();
    progress = span <= 0 ? 0 : Math.min(100, Math.max(0, ((now.getTime() - previous.at.getTime()) / span) * 100));
  } else if (next && nextIndex === 0) {
    progress = 0;
  }

  return {
    cityId: city.id,
    locationAr: city.nameAr,
    locationEn: city.nameEn,
    dateLabel: gregorianLabel(now, city.timeZone),
    prayers,
    nextId: next?.id,
    remainingLabel: next ? remainingLabel(now, next.at) : undefined,
    progress,
    nightRest,
  };
}

export function granadaPrayerSchedule(now = new Date()) {
  return courtyardDaySchedule("granada", now);
}

export interface CourtyardWeekRow {
  weekday: string;
  prayers: Record<PrayerId, string>;
}

export function courtyardWeek(cityId: CityId = "granada", now = new Date()): CourtyardWeekRow[] {
  const city = cityById(cityId);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now.getTime() + index * 86_400_000);
    const times = prayerTimesFor(city, day);
    const prayers = Object.fromEntries(
      PRAYER_ORDER.map((id) => [id, clock(timeFor(times, id), city.timeZone)]),
    ) as Record<PrayerId, string>;
    return {
      weekday: weekdayLabel(day, city.timeZone),
      prayers,
    };
  });
}
