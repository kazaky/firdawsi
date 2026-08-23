import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import type { PrayerEntry, PrayerId } from "@firdawsi/web";

const ALHAMBRA = new Coordinates(37.1769, -3.5903);
const TIME_ZONE = "Europe/Madrid";

const LABELS: Record<Exclude<PrayerId, never>, { nameAr: string; nameEn: string }> = {
  fajr: { nameAr: "الفجر", nameEn: "Fajr" },
  sunrise: { nameAr: "الشروق", nameEn: "Sunrise" },
  dhuhr: { nameAr: "الظهر", nameEn: "Dhuhr" },
  asr: { nameAr: "العصر", nameEn: "Asr" },
  maghrib: { nameAr: "المغرب", nameEn: "Maghrib" },
  isha: { nameAr: "العشاء", nameEn: "Isha" },
};

const ORDER: PrayerId[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

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

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: TIME_ZONE,
});

const gregorianFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: TIME_ZONE,
});

function clock(date: Date): string {
  return timeFormat.format(date);
}

function remainingLabel(from: Date, to: Date): string {
  const minutes = Math.max(0, Math.round((to.getTime() - from.getTime()) / 60_000));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours > 0) return `in ${hours}h ${rest}m`;
  return `in ${rest}m`;
}

export function granadaPrayerSchedule(now = new Date()) {
  const params = CalculationMethod.MuslimWorldLeague();
  const times = new PrayerTimes(ALHAMBRA, now, params);
  const prayers: PrayerEntry[] = ORDER.map((id) => ({
    id,
    ...LABELS[id],
    at: clock(timeFor(times, id)),
  }));

  const upcoming = times.nextPrayer(now);
  const nextId: PrayerId | undefined = upcoming === "none" ? undefined : upcoming;
  const nextAt = nextId ? timeFor(times, nextId) : undefined;

  return {
    locationAr: "غرناطة",
    locationEn: "Granada",
    dateLabel: gregorianFormat.format(now),
    prayers,
    nextId,
    remainingLabel: nextAt ? remainingLabel(now, nextAt) : undefined,
  };
}
