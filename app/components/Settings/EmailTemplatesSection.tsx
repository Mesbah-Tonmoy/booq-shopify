import { useState } from 'react';
import type { EmailTemplateKey } from '../../types/settings';
import type { EmailTemplateSettingsState } from '../../hooks/useEmailTemplateSettings';

const TEMPLATE_LABELS: Record<EmailTemplateKey, string> = {
  bookingConfirmation: 'Booking confirmation',
  cancellation: 'Cancellation',
  reminder: 'Reminder',
  ownerNewBookingAlert: 'Owner: new booking alert',
};

type EmailTemplatesSectionProps = EmailTemplateSettingsState;

export function EmailTemplatesSection({
  templates,
  updateTemplate,
}: EmailTemplatesSectionProps) {
  const [selectedKey, setSelectedKey] = useState<EmailTemplateKey>(
    'bookingConfirmation'
  );
  const template = templates[selectedKey];

  return (
    <div className="bg-white rounded-lg border border-[#e1e3e5] p-6">
      <s-heading className="mb-1">Email templates</s-heading>
      <div className="mb-4">
        <s-text color="subdued">
          Customize the emails customers and you receive. Use{' '}
          {'{{customerName}}'}, {'{{serviceName}}'}, {'{{staffName}}'},{' '}
          {'{{bookingDate}}'}, and {'{{bookingTime}}'} as placeholders — sending
          isn&apos;t wired up yet.
        </s-text>
      </div>

      <div className="flex flex-col gap-4">
        <s-form-field>
          <s-select
            label="Template"
            value={selectedKey}
            onChange={(e) =>
              setSelectedKey(e.currentTarget.value as EmailTemplateKey)
            }
          >
            {Object.entries(TEMPLATE_LABELS).map(([key, label]) => (
              <s-option key={key} value={key}>
                {label}
              </s-option>
            ))}
          </s-select>
        </s-form-field>

        <s-text-field
          label="Subject"
          value={template.subject}
          onChange={(e) =>
            updateTemplate(selectedKey, 'subject', e.currentTarget.value)
          }
        />

        <s-text-area
          label="Body"
          rows={6}
          value={template.body}
          onChange={(e) =>
            updateTemplate(selectedKey, 'body', e.currentTarget.value)
          }
        />
      </div>
    </div>
  );
}
