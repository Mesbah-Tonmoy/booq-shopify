import { useState } from 'react';
import type { ClearErrorFn, FormErrors, ServiceFormData } from './types';

interface RescheduleBookingsProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Reschedule Bookings Component
export function RescheduleBookings({ formData }: RescheduleBookingsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [allowReschedule, setAllowReschedule] = useState(
    formData?.allowReschedule || false
  );

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
          <s-heading>Reschedule Bookings (Optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
      </s-stack>

      {isOpen && (
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            name="allowReschedule"
            checked={allowReschedule}
            onChange={(e) => setAllowReschedule(e.target.checked)}
          />
          <s-text>Allow your customers to reschedule booking</s-text>
        </label>
      )}
    </s-section>
  );
}
