import type { ClearErrorFn, FormErrors, ServiceFormData } from './types';
import { MinimumAdvancedNotice } from './MinimumAdvancedNotice';
import { ServiceVisibility } from './ServiceVisibility';
import { NotificationEmail } from './NotificationEmail';
import { CancelBookings } from './CancelBookings';
import { RescheduleBookings } from './RescheduleBookings';
import { PaymentPreferences } from './PaymentPreferences';
import { CustomerInformation } from './CustomerInformation';

interface OthersTabContentProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Others Tab Component (formerly Availability)
export function OthersTabContent({
  formData,
  errors = {},
  clearError = () => {},
}: OthersTabContentProps) {
  return (
    <s-stack direction="block" gap="large">
      <MinimumAdvancedNotice
        formData={formData}
        errors={errors}
        clearError={clearError}
      />
      <ServiceVisibility
        formData={formData}
        errors={errors}
        clearError={clearError}
      />
      <NotificationEmail
        formData={formData}
        errors={errors}
        clearError={clearError}
      />
      <CancelBookings
        formData={formData}
        errors={errors}
        clearError={clearError}
      />
      <RescheduleBookings
        formData={formData}
        errors={errors}
        clearError={clearError}
      />
      <PaymentPreferences
        formData={formData}
        errors={errors}
        clearError={clearError}
      />
      <CustomerInformation
        formData={formData}
        errors={errors}
        clearError={clearError}
      />
    </s-stack>
  );
}
