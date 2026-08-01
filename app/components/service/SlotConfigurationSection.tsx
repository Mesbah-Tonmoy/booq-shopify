import { useState } from 'react';
import type { ClearErrorFn, FormErrors, ServiceFormData } from './types';
import { ServiceTypeSelector } from './ServiceTypeSelector';
import { BundleBookingSection } from './BundleBookingSection';
import { RegularSlotConfiguration } from './RegularSlotConfiguration';
import { FullDaySlotConfiguration } from './FullDaySlotConfiguration';
import { MultiDaySlotConfiguration } from './MultiDaySlotConfiguration';

interface SlotConfigurationSectionProps {
  formData?: ServiceFormData;
  currentServiceType?: string;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

export function SlotConfigurationSection({
  formData,
  currentServiceType,
  errors = {},
  clearError = () => {},
}: SlotConfigurationSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <s-section>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (
            (e.key === 'Enter' || e.key === ' ') &&
            e.target === e.currentTarget
          ) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: isOpen ? '1rem' : '0',
        }}
      >
        <s-heading>Slot Configuration</s-heading>
        <s-icon type={isOpen ? 'chevron-down' : 'chevron-up'} />
      </div>

      <div style={{ display: isOpen ? 'block' : 'none' }}>
        <s-stack direction="block" gap="base">
          {/* Service Type */}
          <ServiceTypeSelector
            formData={formData}
            errors={errors}
            clearError={clearError}
          />

          {/* Bundle Booking Section */}
          <BundleBookingSection
            formData={formData}
            currentServiceType={currentServiceType}
          />

          {/* Render appropriate slot configuration based on service type */}
          {currentServiceType === 'regular' && (
            <RegularSlotConfiguration
              formData={formData}
              errors={errors}
              clearError={clearError}
            />
          )}
          {currentServiceType === 'full-day' && (
            <FullDaySlotConfiguration
              formData={formData}
              errors={errors}
              clearError={clearError}
            />
          )}
          {currentServiceType === 'multi-day' && (
            <MultiDaySlotConfiguration
              formData={formData}
              errors={errors}
              clearError={clearError}
            />
          )}
        </s-stack>
      </div>
    </s-section>
  );
}
