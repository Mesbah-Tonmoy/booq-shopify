import type { Dispatch, SetStateAction } from 'react';

interface OwnerNotificationsSectionProps {
  expanded: boolean;
  onToggle: () => void;
  newBookingAlerts: boolean;
  setNewBookingAlerts: Dispatch<SetStateAction<boolean>>;
  noShowAlerts: boolean;
  setNoShowAlerts: Dispatch<SetStateAction<boolean>>;
  cancellationAlerts: boolean;
  setCancellationAlerts: Dispatch<SetStateAction<boolean>>;
  emailDigestFrequency: string;
  setEmailDigestFrequency: Dispatch<SetStateAction<string>>;
}

export function OwnerNotificationsSection({
  expanded,
  onToggle,
  newBookingAlerts,
  setNewBookingAlerts,
  noShowAlerts,
  setNoShowAlerts,
  cancellationAlerts,
  setCancellationAlerts,
  emailDigestFrequency,
  setEmailDigestFrequency,
}: OwnerNotificationsSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e1e3e5] p-6">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className={`flex justify-between items-center cursor-pointer ${expanded ? 'mb-4' : 'mb-0'}`}
      >
        <s-heading>Store Owner Notifications</s-heading>
        <s-icon type={expanded ? 'chevron-down' : 'chevron-up'} />
      </div>

      {expanded && (
        <div className="flex flex-col gap-4">
          <div>
            <s-checkbox
              checked={newBookingAlerts}
              onChange={(e) => setNewBookingAlerts(e.currentTarget.checked)}
              label="New booking alerts"
              details="Get notified about new bookings"
            />
          </div>

          <div>
            <s-checkbox
              checked={noShowAlerts}
              onChange={(e) => setNoShowAlerts(e.currentTarget.checked)}
              label="No-show alerts"
              details="Get notified when customers don't show up"
            />
          </div>

          <div>
            <s-checkbox
              checked={cancellationAlerts}
              onChange={(e) => setCancellationAlerts(e.currentTarget.checked)}
              label="Cancellation alerts"
              details="Get notified about cancelled bookings"
            />
          </div>

          <div className="mt-2">
            <s-form-field>
              <s-select
                label="Email digest frequency"
                value={emailDigestFrequency}
                onChange={(e) => setEmailDigestFrequency(e.currentTarget.value)}
              >
                <s-option value="daily">Daily</s-option>
                <s-option value="weekly">Weekly</s-option>
                <s-option value="monthly">Monthly</s-option>
                <s-option value="never">Never</s-option>
              </s-select>
              <s-text slot="helper-text" color="subdued">
                How often to receive summary emails
              </s-text>
            </s-form-field>
          </div>
        </div>
      )}
    </div>
  );
}
