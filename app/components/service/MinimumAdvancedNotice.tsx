import { useState } from 'react';
import type { ClearErrorFn, FormErrors, ServiceFormData } from './types';

interface MinimumAdvancedNoticeProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Minimum Advanced Notice Component
export function MinimumAdvancedNotice({
  formData,
}: MinimumAdvancedNoticeProps) {
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
          <s-heading>Minimum Advanced Noticed - Lead Time (optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Set how far in advance a customer must book your slot. For example,
            if set to 2 hours, customers can't book within 2 hours of the
            service time.
          </s-text>
          <s-stack direction="inline" gap="small-300" alignItems="center">
            <s-number-field
              name="minimumAdvancedNotice"
              defaultValue={String(formData?.minimumAdvancedNotice || 0)}
              min={0}
              style={{ width: '200px' }}
            />
            <s-select
              name="minimumAdvancedNoticeUnit"
              defaultValue={formData?.minimumAdvancedNoticeUnit || 'Minutes'}
            >
              <s-option value="Minutes">Minutes</s-option>
              <s-option value="Hours">Hours</s-option>
              <s-option value="Days">Days</s-option>
            </s-select>
          </s-stack>
        </s-stack>
      )}
    </s-section>
  );
}
