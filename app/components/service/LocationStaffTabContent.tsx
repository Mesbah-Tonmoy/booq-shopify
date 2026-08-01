import type {
  ClearErrorFn,
  FormErrors,
  LocationOption,
  ServiceFormData,
  StaffOption,
} from './types';
import { BlockOutDateTime } from './BlockOutDateTime';
import { LocationsSection } from './LocationsSection';
import { StaffMembersSection } from './StaffMembersSection';

interface LocationStaffTabContentProps {
  formData?: ServiceFormData;
  locations?: LocationOption[];
  staffMembers?: StaffOption[];
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Location & Staff Member Tab Component
export function LocationStaffTabContent({
  formData,
  locations = [],
  staffMembers = [],
  errors = {},
  clearError = () => {},
}: LocationStaffTabContentProps) {
  return (
    <s-stack direction="block" gap="large">
      <BlockOutDateTime
        formData={formData}
        errors={errors}
        clearError={clearError}
      />
      <LocationsSection
        formData={formData}
        locations={locations}
        errors={errors}
        clearError={clearError}
      />
      <StaffMembersSection
        formData={formData}
        staffMembers={staffMembers}
        errors={errors}
        clearError={clearError}
      />
    </s-stack>
  );
}
