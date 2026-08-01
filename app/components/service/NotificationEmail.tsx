import { useState } from 'react';
import type { ClearErrorFn, FormErrors, ServiceFormData } from './types';

interface NotificationEmailProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Notification Email Component
export function NotificationEmail({ formData }: NotificationEmailProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        className="cursor-pointer"
        paddingBlockEnd={isOpen ? 'small-300' : ''}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Notification Email (Optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Enter the email addresss to receive your booking notification
          </s-text>
          <s-email-field
            name="notificationEmail"
            placeholder="Optional Eg: storeowner@gmail.com"
            defaultValue={formData?.notificationEmail || ''}
          />
        </s-stack>
      )}
    </s-section>
  );
}
