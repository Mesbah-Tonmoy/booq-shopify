import { useMemo, useState } from 'react';
import type { Settings } from '@prisma/client';
import {
  HOLIDAY_COUNTRIES,
  getHolidaysForCountry,
  type HolidayCountry,
} from '../data/holidayData';
import type { HolidaySettings } from '../types/settings';

export function useHolidaySettings(settings: Settings | null | undefined) {
  const saved = settings?.holidaySettings as HolidaySettings | null;

  const [country, setCountry] = useState<HolidayCountry>(
    (saved?.country as HolidayCountry) || HOLIDAY_COUNTRIES[0]
  );
  const [countryEnabled, setCountryEnabled] = useState(saved?.enabled ?? false);
  const [enabledHolidayIds, setEnabledHolidayIds] = useState<string[]>(
    saved?.enabledHolidayIds ?? []
  );

  const countryHolidays = useMemo(
    () => getHolidaysForCountry(country),
    [country]
  );

  const toggleHoliday = (id: string) =>
    setEnabledHolidayIds((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );

  return {
    country,
    setCountry,
    countryEnabled,
    setCountryEnabled,
    enabledHolidayIds,
    holidays: countryHolidays.map((holiday) => ({
      ...holiday,
      enabled: enabledHolidayIds.includes(holiday.id),
    })),
    toggleHoliday,
  };
}

export type HolidaySettingsState = ReturnType<typeof useHolidaySettings>;
