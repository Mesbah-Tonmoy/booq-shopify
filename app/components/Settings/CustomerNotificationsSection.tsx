import type { Dispatch, SetStateAction } from 'react';

interface CustomerNotificationsSectionProps {
  expanded: boolean;
  onToggle: () => void;
  bookingConfirmationEmail: boolean;
  setBookingConfirmationEmail: Dispatch<SetStateAction<boolean>>;
  reminderEmails: boolean;
  setReminderEmails: Dispatch<SetStateAction<boolean>>;
  cancellationEmail: boolean;
  setCancellationEmail: Dispatch<SetStateAction<boolean>>;
  reminderTiming: string;
  setReminderTiming: Dispatch<SetStateAction<string>>;
}

export function CustomerNotificationsSection({
  expanded,
  onToggle,
  bookingConfirmationEmail,
  setBookingConfirmationEmail,
  reminderEmails,
  setReminderEmails,
  cancellationEmail,
  setCancellationEmail,
  reminderTiming,
  setReminderTiming,
}: CustomerNotificationsSectionProps) {
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
        <s-heading>Customer notifications</s-heading>
        <s-icon type={expanded ? 'chevron-down' : 'chevron-up'}></s-icon>
      </div>

      {expanded && (
        <div className="flex flex-col gap-4">
          <div>
            <s-checkbox
              checked={bookingConfirmationEmail}
              onChange={(e) =>
                setBookingConfirmationEmail(e.currentTarget.checked)
              }
              label="Booking confirmation email"
              details="Send confirmation email when booking in created"
            />
          </div>

          <div>
            <s-checkbox
              checked={reminderEmails}
              onChange={(e) => setReminderEmails(e.currentTarget.checked)}
              label="Reminder emails"
              details="send reminder emails before appoinment"
            />
          </div>

          <div>
            <s-checkbox
              checked={cancellationEmail}
              onChange={(e) => setCancellationEmail(e.currentTarget.checked)}
              label="Cancellation email"
              details="Send email when book in cancelled"
            />
          </div>

          <div className="mt-2">
            <s-form-field>
              <s-number-field
                label="Reminder timing (hours before)"
                value={reminderTiming}
                onChange={(e) => setReminderTiming(e.currentTarget.value)}
                min={1}
              />
            </s-form-field>
          </div>
        </div>
      )}
    </div>
  );
}
