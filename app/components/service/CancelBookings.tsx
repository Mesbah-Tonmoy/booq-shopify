import { useState } from 'react';
import type { ClearErrorFn, FormErrors, ServiceFormData } from './types';

interface CancelBookingsProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Cancel Bookings Component
export function CancelBookings({ formData }: CancelBookingsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const cancelBooking = formData?.cancelBooking;
  const [allowCancel, setAllowCancel] = useState(
    cancelBooking?.allowed || false
  );
  const [cutoffTime, setCutoffTime] = useState(cancelBooking?.cutoffTime || '');
  const [cutoffUnit, setCutoffUnit] = useState(
    cancelBooking?.cutoffUnit || 'Hours'
  );

  // Create JSON object for hidden input
  const cancelBookingData = {
    allowed: allowCancel,
    cutoffTime: cutoffTime,
    cutoffUnit: cutoffUnit,
  };

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
          <s-heading>Cancel Bookings (Optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
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
              checked={allowCancel}
              onChange={(e) => setAllowCancel(e.target.checked)}
            />
            <s-text>Allow your customers to cancel booking</s-text>
          </label>

          {allowCancel && (
            <s-stack gap="small-300">
              <s-text type="strong">Cut-off time</s-text>
              <s-stack direction="inline" gap="small-300" alignItems="center">
                <s-text-field
                  placeholder="Eg: 2 H"
                  value={cutoffTime}
                  onChange={(e) => setCutoffTime(e.currentTarget.value)}
                  style={{ width: '200px' }}
                />
                <s-select
                  value={cutoffUnit}
                  onChange={(e) => setCutoffUnit(e.currentTarget.value)}
                >
                  <s-option value="Hours">Hours</s-option>
                  <s-option value="Days">Days</s-option>
                </s-select>
              </s-stack>
              <s-text color="subdued">
                Set a cut-off time limit before the appointment, after which
                customers can no longer cancel their appointments.
              </s-text>
            </s-stack>
          )}

          <input
            type="hidden"
            name="cancelBooking"
            value={JSON.stringify(cancelBookingData)}
          />
        </s-stack>
      )}
    </s-section>
  );
}
