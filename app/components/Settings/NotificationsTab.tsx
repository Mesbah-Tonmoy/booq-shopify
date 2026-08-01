import { useState } from 'react';
import type { NotificationSettings } from '../../hooks/useNotificationSettings';
import type { WidgetSettingsState } from '../../hooks/useWidgetSettings';
import { WidgetPreview } from '../WidgetPreview';
import { CustomerNotificationsSection } from './CustomerNotificationsSection';
import { OwnerNotificationsSection } from './OwnerNotificationsSection';

interface NotificationsTabProps {
  notificationSettings: NotificationSettings;
  widgetSettings: WidgetSettingsState;
}

export function NotificationsTab({
  notificationSettings,
  widgetSettings,
}: NotificationsTabProps) {
  const { customer, owner } = notificationSettings;

  const [expanded, setExpanded] = useState({ customer: true, owner: true });

  const toggle = (key: keyof typeof expanded) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <CustomerNotificationsSection
            expanded={expanded.customer}
            onToggle={() => toggle('customer')}
            {...customer}
          />

          <OwnerNotificationsSection
            expanded={expanded.owner}
            onToggle={() => toggle('owner')}
            {...owner}
          />
        </div>

        <WidgetPreview
          dateTimePickerPosition={widgetSettings.dateTimePickerPosition}
          hideEndTime={widgetSettings.hideEndTime}
          hideSlotAvailabilityCount={widgetSettings.hideSlotAvailabilityCount}
          showPricing={widgetSettings.showPricing}
          showStaffPhotos={widgetSettings.showStaffPhotos}
          showDuration={widgetSettings.showDuration}
          showReviews={widgetSettings.showReviews}
        />
      </div>

      <input
        type="hidden"
        name="customerNotificationSettings"
        value={JSON.stringify({
          bookingConfirmationEmail: customer.bookingConfirmationEmail,
          reminderEmails: customer.reminderEmails,
          cancellationEmail: customer.cancellationEmail,
          reminderTiming: customer.reminderTiming,
        })}
      />
      <input
        type="hidden"
        name="ownerNotificationSettings"
        value={JSON.stringify({
          newBookingAlerts: owner.newBookingAlerts,
          noShowAlerts: owner.noShowAlerts,
          cancellationAlerts: owner.cancellationAlerts,
          emailDigestFrequency: owner.emailDigestFrequency,
        })}
      />
    </>
  );
}
