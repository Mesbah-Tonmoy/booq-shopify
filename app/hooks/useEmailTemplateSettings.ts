import { useState } from 'react';
import type { Settings } from '@prisma/client';
import type {
  EmailTemplateKey,
  EmailTemplateContent,
  EmailTemplates,
} from '../types/settings';

// {{customerName}}, {{serviceName}}, {{staffName}}, {{bookingDate}}, and
// {{bookingTime}} are the placeholder tokens available in template bodies.
// There's no templating engine or send logic yet — this is authoring-only.
const DEFAULT_TEMPLATES: EmailTemplates = {
  bookingConfirmation: {
    subject: 'Your booking is confirmed!',
    body: 'Hi {{customerName}},\n\nYour booking for {{serviceName}} with {{staffName}} on {{bookingDate}} at {{bookingTime}} is confirmed.\n\nSee you soon!',
  },
  cancellation: {
    subject: 'Your booking has been cancelled',
    body: "Hi {{customerName}},\n\nYour booking for {{serviceName}} on {{bookingDate}} at {{bookingTime}} has been cancelled.\n\nIf this wasn't you, please contact us.",
  },
  reminder: {
    subject: 'Reminder: your upcoming booking',
    body: 'Hi {{customerName}},\n\nThis is a reminder for your {{serviceName}} appointment with {{staffName}} on {{bookingDate}} at {{bookingTime}}.',
  },
  ownerNewBookingAlert: {
    subject: 'New booking received',
    body: 'A new booking was made:\n\nService: {{serviceName}}\nCustomer: {{customerName}}\nStaff: {{staffName}}\nDate & time: {{bookingDate}} {{bookingTime}}',
  },
};

export function useEmailTemplateSettings(
  settings: Settings | null | undefined
) {
  const saved = settings?.emailTemplates as Partial<EmailTemplates> | null;

  const [templates, setTemplates] = useState<EmailTemplates>({
    bookingConfirmation: {
      ...DEFAULT_TEMPLATES.bookingConfirmation,
      ...saved?.bookingConfirmation,
    },
    cancellation: {
      ...DEFAULT_TEMPLATES.cancellation,
      ...saved?.cancellation,
    },
    reminder: {
      ...DEFAULT_TEMPLATES.reminder,
      ...saved?.reminder,
    },
    ownerNewBookingAlert: {
      ...DEFAULT_TEMPLATES.ownerNewBookingAlert,
      ...saved?.ownerNewBookingAlert,
    },
  });

  const updateTemplate = (
    key: EmailTemplateKey,
    field: keyof EmailTemplateContent,
    value: string
  ) => {
    setTemplates((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  return { templates, updateTemplate };
}

export type EmailTemplateSettingsState = ReturnType<
  typeof useEmailTemplateSettings
>;
