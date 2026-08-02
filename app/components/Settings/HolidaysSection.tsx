import { HOLIDAY_COUNTRIES, type HolidayCountry } from '../../data/holidayData';
import type { HolidaySettingsState } from '../../hooks/useHolidaySettings';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

type HolidaysSectionProps = Pick<
  HolidaySettingsState,
  | 'country'
  | 'setCountry'
  | 'countryEnabled'
  | 'setCountryEnabled'
  | 'holidays'
  | 'toggleHoliday'
>;

export function HolidaysSection({
  country,
  setCountry,
  countryEnabled,
  setCountryEnabled,
  holidays,
  toggleHoliday,
}: HolidaysSectionProps) {
  return (
    <s-stack direction="block" gap="base">
      <s-stack direction="inline" gap="small-100" alignItems="start">
        <s-icon type="note" />
        <s-text color="subdued">
          Calendly will automatically mark you as unavailable for the selected
          holidays
        </s-text>
      </s-stack>

      <div className="bg-[#f6f6f7] rounded-lg p-4 flex flex-col gap-4">
        <s-stack
          direction="inline"
          justifyContent="space-between"
          alignItems="center"
          gap="base"
        >
          <div className="flex-1">
            <s-form-field>
              <s-select
                label="Country for holidays"
                value={country}
                onChange={(e) =>
                  setCountry(e.currentTarget.value as HolidayCountry)
                }
              >
                {HOLIDAY_COUNTRIES.map((c) => (
                  <s-option key={c} value={c}>
                    {c}
                  </s-option>
                ))}
              </s-select>
            </s-form-field>
          </div>
          <s-switch
            checked={countryEnabled}
            onChange={(e) => setCountryEnabled(e.currentTarget.checked)}
            label="Enable holidays for this country"
            labelAccessibilityVisibility="exclusive"
          />
        </s-stack>

        <s-stack direction="block" gap="base">
          {holidays.map((holiday) => (
            <s-stack
              key={holiday.id}
              direction="inline"
              justifyContent="space-between"
              alignItems="center"
              gap="base"
            >
              <s-text>{holiday.name}</s-text>
              <s-text color="subdued">
                Next: {dateFormatter.format(holiday.nextDate)}
              </s-text>
              <s-switch
                checked={holiday.enabled}
                onChange={() => toggleHoliday(holiday.id)}
                label={`Mark unavailable for ${holiday.name}`}
                labelAccessibilityVisibility="exclusive"
              />
            </s-stack>
          ))}
        </s-stack>
      </div>
    </s-stack>
  );
}
