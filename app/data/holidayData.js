export const HOLIDAY_COUNTRIES = [
  'Bangladesh',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'India',
];

// Anonymous Gregorian algorithm (Meeus/Jones/Butcher)
function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getNthWeekdayOfMonth(year, month, weekday, n) {
  const firstOfMonth = new Date(year, month - 1, 1);
  const firstWeekdayOffset = (weekday - firstOfMonth.getDay() + 7) % 7;
  const day = 1 + firstWeekdayOffset + (n - 1) * 7;
  return new Date(year, month - 1, day);
}

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function nextOnOrAfter(fromDate, getDateForYear) {
  const today = startOfDay(fromDate);
  const thisYear = getDateForYear(today.getFullYear());
  if (startOfDay(thisYear) >= today) return thisYear;
  return getDateForYear(today.getFullYear() + 1);
}

function fixedDate(month, day) {
  return (fromDate) =>
    nextOnOrAfter(fromDate, (year) => new Date(year, month - 1, day));
}

function nthWeekday(month, weekday, n) {
  return (fromDate) =>
    nextOnOrAfter(fromDate, (year) =>
      getNthWeekdayOfMonth(year, month, weekday, n)
    );
}

function easterOffset(offsetDays) {
  return (fromDate) =>
    nextOnOrAfter(fromDate, (year) =>
      addDays(getEasterSunday(year), offsetDays)
    );
}

const HOLIDAYS_BY_COUNTRY = {
  Australia: [
    {
      id: 'au-new-years-day',
      name: "New Year's Day",
      getNextDate: fixedDate(1, 1),
    },
    {
      id: 'au-australia-day',
      name: 'Australia Day',
      getNextDate: fixedDate(1, 26),
    },
    {
      id: 'au-good-friday',
      name: 'Good Friday',
      getNextDate: easterOffset(-2),
    },
    {
      id: 'au-christmas-day',
      name: 'Christmas Day',
      getNextDate: fixedDate(12, 25),
    },
  ],
  'United States': [
    {
      id: 'us-new-years-day',
      name: "New Year's Day",
      getNextDate: fixedDate(1, 1),
    },
    {
      id: 'us-independence-day',
      name: 'Independence Day',
      getNextDate: fixedDate(7, 4),
    },
    {
      id: 'us-thanksgiving',
      name: 'Thanksgiving Day',
      getNextDate: nthWeekday(11, 4, 4),
    },
    {
      id: 'us-christmas-day',
      name: 'Christmas Day',
      getNextDate: fixedDate(12, 25),
    },
  ],
  'United Kingdom': [
    {
      id: 'uk-new-years-day',
      name: "New Year's Day",
      getNextDate: fixedDate(1, 1),
    },
    {
      id: 'uk-good-friday',
      name: 'Good Friday',
      getNextDate: easterOffset(-2),
    },
    {
      id: 'uk-christmas-day',
      name: 'Christmas Day',
      getNextDate: fixedDate(12, 25),
    },
    { id: 'uk-boxing-day', name: 'Boxing Day', getNextDate: fixedDate(12, 26) },
  ],
  Canada: [
    {
      id: 'ca-new-years-day',
      name: "New Year's Day",
      getNextDate: fixedDate(1, 1),
    },
    { id: 'ca-canada-day', name: 'Canada Day', getNextDate: fixedDate(7, 1) },
    {
      id: 'ca-christmas-day',
      name: 'Christmas Day',
      getNextDate: fixedDate(12, 25),
    },
  ],
  India: [
    {
      id: 'in-republic-day',
      name: 'Republic Day',
      getNextDate: fixedDate(1, 26),
    },
    {
      id: 'in-independence-day',
      name: 'Independence Day',
      getNextDate: fixedDate(8, 15),
    },
    {
      id: 'in-gandhi-jayanti',
      name: 'Gandhi Jayanti',
      getNextDate: fixedDate(10, 2),
    },
  ],
  Bangladesh: [
    {
      id: 'bd-language-day',
      name: 'International Mother Language Day',
      getNextDate: fixedDate(2, 21),
    },
    {
      id: 'bd-independence-day',
      name: 'Independence Day',
      getNextDate: fixedDate(3, 26),
    },
    {
      id: 'bd-victory-day',
      name: 'Victory Day',
      getNextDate: fixedDate(12, 16),
    },
  ],
};

export function getHolidaysForCountry(country, fromDate = new Date()) {
  const holidays = HOLIDAYS_BY_COUNTRY[country] || [];
  return holidays
    .map(({ id, name, getNextDate }) => ({
      id,
      name,
      nextDate: getNextDate(fromDate),
    }))
    .sort((a, b) => a.nextDate - b.nextDate);
}
