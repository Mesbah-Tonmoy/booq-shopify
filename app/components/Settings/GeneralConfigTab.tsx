import type { Settings } from '@prisma/client';
import type { WidgetSettingsState } from '../../hooks/useWidgetSettings';
import { CollapsibleCard } from '../CollapsibleCard';
import { WidgetPreview } from '../WidgetPreview';
import WorkingHoursSection from '../WorkingHours';
import { HolidaysSection } from './HolidaysSection';
import { CalendarSettingsSection } from './CalendarSettingsSection';
import { DateTimeFormatsSection } from './DateTimeFormatsSection';
import { AdvancedSettingsSection } from './AdvancedSettingsSection';
import { ShopSettingsSection } from './ShopSettingsSection';

const sections = [
  { id: 'workingHours', title: 'Schedules: Working hours (default)' },
  { id: 'holidays', title: 'Holidays' },
  { id: 'calendarSettings', title: 'Calendar settings' },
  { id: 'dateTimeFormats', title: 'Date & Time Formats' },
  { id: 'advancedSettings', title: 'Advanced settings' },
  { id: 'shopSettings', title: 'Shop Settings' },
];

const SECTIONS_WITH_HEADER_ICON = [
  'calendarSettings',
  'dateTimeFormats',
  'advancedSettings',
  'shopSettings',
];

interface GeneralConfigTabProps {
  widgetSettings: WidgetSettingsState;
  settings?: Settings | null;
}

export function GeneralConfigTab({
  widgetSettings,
  settings,
}: GeneralConfigTabProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <CollapsibleCard
            key={section.id}
            header={
              SECTIONS_WITH_HEADER_ICON.includes(section.id) ? (
                <s-stack direction="inline" alignItems="center" gap="small-100">
                  <s-icon type="note" />
                  <s-heading>{section.title}</s-heading>
                </s-stack>
              ) : (
                <s-heading>{section.title}</s-heading>
              )
            }
          >
            <s-stack direction="block" gap="base">
              {section.id === 'workingHours' && <WorkingHoursSection />}
              {section.id === 'holidays' && <HolidaysSection />}
              {section.id === 'calendarSettings' && <CalendarSettingsSection />}
              {section.id === 'dateTimeFormats' && (
                <DateTimeFormatsSection settings={settings} />
              )}
              {section.id === 'advancedSettings' && (
                <AdvancedSettingsSection settings={settings} />
              )}
              {section.id === 'shopSettings' && (
                <ShopSettingsSection settings={settings} />
              )}
            </s-stack>
          </CollapsibleCard>
        ))}
      </div>

      <WidgetPreview {...widgetSettings} />
    </div>
  );
}
