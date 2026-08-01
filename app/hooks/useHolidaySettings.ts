import { useMemo, useState } from 'react';
import {
  HOLIDAY_COUNTRIES,
  getHolidaysForCountry,
  type HolidayCountry,
} from '../data/holidayData';

export function useHolidaySettings() {
  const [country, setCountry] = useState<HolidayCountry>(HOLIDAY_COUNTRIES[0]);
  const [countryEnabled, setCountryEnabled] = useState(false);
  const [enabledHolidayIds, setEnabledHolidayIds] = useState<string[]>([]);

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
    holidays: countryHolidays.map((holiday) => ({
      ...holiday,
      enabled: enabledHolidayIds.includes(holiday.id),
    })),
    toggleHoliday,
  };
}
