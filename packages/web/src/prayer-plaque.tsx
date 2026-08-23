import type { HTMLAttributes } from "react";
import { Surface } from "./components.js";
import { Text } from "./extras.js";

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

export type PrayerId = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export interface PrayerEntry {
  id: PrayerId;
  nameAr: string;
  nameEn: string;
  at: string;
}

export interface PrayerPlaqueProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  locationAr: string;
  locationEn: string;
  dateLabel?: string;
  prayers: readonly PrayerEntry[];
  nextId?: PrayerId;
  remainingLabel?: string;
}

export function PrayerPlaque({
  locationAr,
  locationEn,
  dateLabel,
  prayers,
  nextId,
  remainingLabel,
  className,
  ...props
}: PrayerPlaqueProps) {
  const next = prayers.find((prayer) => prayer.id === nextId);

  return (
    <Surface
      className={cx("firdawsi-prayer-plaque", className)}
      tier={1}
      {...props}
    >
      <header className="firdawsi-prayer-plaque__header">
        <Text role="display-sm" lang="ar" as="p">
          {locationAr}
        </Text>
        <Text role="title-md" as="p">
          {locationEn}
        </Text>
        {dateLabel ? (
          <Text role="label-sm" as="p">
            <span dir="ltr">{dateLabel}</span>
          </Text>
        ) : null}
      </header>
      <ol className="firdawsi-prayer-plaque__list">
        {prayers.map((prayer) => {
          const isNext = prayer.id === nextId;
          return (
            <li
              key={prayer.id}
              className="firdawsi-prayer-plaque__row"
              aria-current={isNext ? "true" : undefined}
            >
              <div className="firdawsi-prayer-plaque__names">
                <Text role="title-md" lang="ar" as="span">
                  {prayer.nameAr}
                </Text>
                <Text role="label-sm" as="span">
                  {prayer.nameEn}
                </Text>
              </div>
              <Text role="title-lg" as="span" className="firdawsi-prayer-plaque__time">
                <span dir="ltr">{prayer.at}</span>
              </Text>
            </li>
          );
        })}
      </ol>
      {next && remainingLabel ? (
        <p className="firdawsi-prayer-plaque__next">
          <Text role="label-md" as="span">
            Next · {next.nameEn}
          </Text>
          <Text role="title-sm" lang="ar" as="span">
            {next.nameAr}
          </Text>
          <Text role="label-md" as="span">
            <span dir="ltr">{remainingLabel}</span>
          </Text>
        </p>
      ) : null}
    </Surface>
  );
}
