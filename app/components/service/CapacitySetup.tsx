import { useState } from 'react';
import type { ClearErrorFn, FormErrors, ServiceFormData } from './types';

interface CapacitySetupProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Capacity Setup Component
export function CapacitySetup({ formData }: CapacitySetupProps) {
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
          <s-heading>Capacity Setup (Optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Set the maximum number of bookings allowed per time slot. Helps you
            manage your availability and avoid over bookings.
          </s-text>
          <s-stack gap="small-300">
            <s-text type="strong">Capacity</s-text>
            <s-text-field
              name="capacity"
              placeholder="Optional Eg: 5"
              defaultValue={String(formData?.capacity || '')}
            />
          </s-stack>
        </s-stack>
      )}
    </s-section>
  );
}
