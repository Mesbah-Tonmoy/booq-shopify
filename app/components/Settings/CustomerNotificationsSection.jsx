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
}) {
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
        <s-heading variant="heading-md">Customer notifications</s-heading>
        <s-icon type={expanded ? 'chevron-down' : 'chevron-up'}></s-icon>
      </div>

      {expanded && (
        <div className="flex flex-col gap-4">
          <div>
            <s-checkbox
              checked={bookingConfirmationEmail}
              onChange={(e) => setBookingConfirmationEmail(e.target.checked)}
              label="Booking confirmation email"
              details="Send confirmation email when booking in created"
            />
          </div>

          <div>
            <s-checkbox
              checked={reminderEmails}
              onChange={(e) => setReminderEmails(e.target.checked)}
              label="Reminder emails"
              details="send reminder emails before appoinment"
            />
          </div>

          <div>
            <s-checkbox
              checked={cancellationEmail}
              onChange={(e) => setCancellationEmail(e.target.checked)}
              label="Cancellation email"
              details="Send email when book in cancelled"
            />
          </div>

          <div className="mt-2">
            <s-form-field>
              <s-text-field
                label="Reminder timing (hours before)"
                type="number"
                value={reminderTiming}
                onChange={(e) => setReminderTiming(e.target.value)}
                min="1"
              />
            </s-form-field>
          </div>
        </div>
      )}
    </div>
  );
}
