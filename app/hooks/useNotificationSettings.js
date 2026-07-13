import { useState } from 'react';

export function useNotificationSettings(settings) {
  const customer = settings?.customerNotificationSettings || {};
  const owner = settings?.ownerNotificationSettings || {};

  const [bookingConfirmationEmail, setBookingConfirmationEmail] = useState(
    customer.bookingConfirmationEmail !== undefined
      ? customer.bookingConfirmationEmail
      : true
  );
  const [reminderEmails, setReminderEmails] = useState(
    customer.reminderEmails !== undefined ? customer.reminderEmails : true
  );
  const [cancellationEmail, setCancellationEmail] = useState(
    customer.cancellationEmail !== undefined ? customer.cancellationEmail : true
  );
  const [reminderTiming, setReminderTiming] = useState(
    customer.reminderTiming || '24'
  );

  const [newBookingAlerts, setNewBookingAlerts] = useState(
    owner.newBookingAlerts !== undefined ? owner.newBookingAlerts : true
  );
  const [noShowAlerts, setNoShowAlerts] = useState(owner.noShowAlerts || false);
  const [cancellationAlerts, setCancellationAlerts] = useState(
    owner.cancellationAlerts !== undefined ? owner.cancellationAlerts : true
  );
  const [emailDigestFrequency, setEmailDigestFrequency] = useState(
    owner.emailDigestFrequency || 'daily'
  );

  return {
    customer: {
      bookingConfirmationEmail,
      setBookingConfirmationEmail,
      reminderEmails,
      setReminderEmails,
      cancellationEmail,
      setCancellationEmail,
      reminderTiming,
      setReminderTiming,
    },
    owner: {
      newBookingAlerts,
      setNewBookingAlerts,
      noShowAlerts,
      setNoShowAlerts,
      cancellationAlerts,
      setCancellationAlerts,
      emailDigestFrequency,
      setEmailDigestFrequency,
    },
  };
}
