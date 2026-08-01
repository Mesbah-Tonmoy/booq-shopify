import { useState } from 'react';
import type { ClearErrorFn, FormErrors, ServiceFormData } from './types';

interface ServiceTypeSelectorProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Service Type Selection
export function ServiceTypeSelector({
  formData,
  errors = {},
}: ServiceTypeSelectorProps) {
  const [serviceType, setServiceType] = useState(
    formData?.serviceType || 'regular'
  );

  return (
    <s-form-field>
      <s-choice-list
        label="Service Type"
        name="serviceTypeRadio"
        onChange={(e) => setServiceType(e.currentTarget.values[0])}
      >
        <s-choice value="regular">Regular</s-choice>
        <s-choice value="full-day">Full Day</s-choice>
        <s-choice value="half-day">Half Day</s-choice>
      </s-choice-list>

      {errors?.serviceType && (
        <div style={{ marginTop: '0.5rem' }}>
          <s-text color="critical">{errors.serviceType}</s-text>
        </div>
      )}

      <input type="hidden" name="serviceType" value={serviceType} />
    </s-form-field>
  );
}
