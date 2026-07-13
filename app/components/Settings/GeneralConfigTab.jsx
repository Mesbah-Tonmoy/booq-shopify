import { CollapsibleCard } from 'app/components/CollapsibleCard';
import { WidgetPreview } from 'app/components/WidgetPreview';
import WorkingHoursSection from 'app/components/WorkingHours';

const sections = [
  { id: 'workingHours', title: 'Schedules: Working hours (default)' },
  { id: 'holidays', title: 'Holidays' },
  { id: 'calendarSettings', title: 'Calendar settings' },
  { id: 'dateTimeFormats', title: 'Date & Time Formats' },
  { id: 'advancedSettings', title: 'Advanced settings' },
  { id: 'shopSettings', title: 'Shop Settings' },
];

export function GeneralConfigTab({ widgetSettings }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <CollapsibleCard
            key={section.id}
            header={<s-heading>{section.title}</s-heading>}
          >
            <s-stack direction="block" gap="base">
              {section.id === 'workingHours' && <WorkingHoursSection />}
            </s-stack>
          </CollapsibleCard>
        ))}
      </div>

      <WidgetPreview {...widgetSettings} />
    </div>
  );
}
