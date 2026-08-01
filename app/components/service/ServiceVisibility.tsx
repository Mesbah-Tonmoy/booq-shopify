import { useState } from 'react';
import type { ClearErrorFn, FormErrors, ServiceFormData } from './types';

interface ServiceVisibilityProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Service Visibility Component
export function ServiceVisibility({ formData }: ServiceVisibilityProps) {
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
          <s-heading>Service visibility</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Set the number of calender days visible to your customers to book
            your service
          </s-text>
          <s-stack direction="inline" gap="small-300" alignItems="center">
            <s-number-field
              name="serviceVisibilityDays"
              defaultValue={String(formData?.serviceVisibilityDays || 60)}
              min={1}
              style={{ width: '200px' }}
            />
            <s-text>Days</s-text>
          </s-stack>
          <s-text color="subdued">
            Example: Set to 60 days = customer can only book up to 60 days in
            advance
          </s-text>
          <s-text color="subdued" style={{ marginTop: '1rem' }}>
            Set the maximum number of product quantities that you'll allow
            customers to book at a time
          </s-text>
          <s-number-field
            name="maxProductQuantities"
            defaultValue={String(formData?.maxProductQuantities || 5)}
            min={1}
          />
          <s-text color="subdued">
            If set to 5, a customer can't book more than 5 quantities at once,
            even if more availability exists
          </s-text>
        </s-stack>
      )}
    </s-section>
  );
}
