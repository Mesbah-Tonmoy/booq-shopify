import { useState } from 'react';
import type { ClearErrorFn, FormErrors, ServiceFormData } from './types';

interface BlockOutDateTimeProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Block Out Date & Time Component
export function BlockOutDateTime({
  formData,
  errors = {},
  clearError = () => {},
}: BlockOutDateTimeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [locationType, setLocationType] = useState(
    formData?.locationType || ''
  );

  const handleLocationTypeChange = (type: string) => {
    setLocationType(type);
    clearError('locationType');
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
        <s-heading>Location Type</s-heading>
        <s-icon type={isOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Select where your service will be provided
          </s-text>
          <s-choice-list
            label="Location Type"
            name="locationTypeRadio"
            onChange={(e) =>
              handleLocationTypeChange(e.currentTarget.values[0])
            }
          >
            <s-choice value="online">Online</s-choice>
            <s-choice value="offline">Offline</s-choice>
          </s-choice-list>

          {errors?.locationType && (
            <div style={{ marginTop: '0.5rem' }}>
              <s-text color="critical">{errors.locationType}</s-text>
            </div>
          )}

          {/* Hidden input for form submission */}
          <input type="hidden" name="locationType" value={locationType} />
        </s-stack>
      )}
    </s-section>
  );
}
