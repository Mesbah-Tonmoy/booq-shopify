import { useState } from 'react';
import type { ServiceFormData } from './types';

interface BundleBookingSectionProps {
  formData?: ServiceFormData;
  currentServiceType?: string;
}

// Bundle Booking Section
export function BundleBookingSection({
  formData,
  currentServiceType,
}: BundleBookingSectionProps) {
  const bundleBooking = formData?.bundleBooking;
  const [bundleBookingEnabled, setBundleBookingEnabled] = useState(
    bundleBooking?.enabled || false
  );
  const [minSlots, setMinSlots] = useState(
    bundleBooking?.minSlots ? String(bundleBooking.minSlots) : ''
  );
  const [maxSlots, setMaxSlots] = useState(
    bundleBooking?.maxSlots ? String(bundleBooking.maxSlots) : ''
  );

  // Only show if service type is regular
  if (currentServiceType !== 'regular') {
    return null;
  }

  // Create JSON object for hidden input
  const bundleBookingData = {
    enabled: bundleBookingEnabled,
    minSlots: minSlots ? parseInt(minSlots) : null,
    maxSlots: maxSlots ? parseInt(maxSlots) : null,
  };

  return (
    <s-box
      padding="base"
      border="base"
      borderRadius="base"
      style={{ marginTop: '1rem' }}
    >
      <s-checkbox
        checked={bundleBookingEnabled}
        onChange={(e) => {
          e.stopPropagation();
          setBundleBookingEnabled(e.currentTarget.checked);
        }}
        onClick={(e) => e.stopPropagation()}
        label="Bundle Booking"
      />

      {bundleBookingEnabled && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <div>
            <s-text style={{ marginBottom: '0.5rem', display: 'block' }}>
              Minimum slots to book
            </s-text>
            <s-number-field
              placeholder="Eg:1"
              suffix="Slots"
              value={minSlots}
              onChange={(e) => setMinSlots(e.currentTarget.value)}
              min={1}
            />
          </div>
          <div>
            <s-text style={{ marginBottom: '0.5rem', display: 'block' }}>
              Maximum slots per book
            </s-text>
            <s-number-field
              placeholder="Eg:5"
              suffix="Slots"
              value={maxSlots}
              onChange={(e) => setMaxSlots(e.currentTarget.value)}
              min={1}
            />
          </div>
        </div>
      )}

      <input
        type="hidden"
        name="bundleBooking"
        value={JSON.stringify(bundleBookingData)}
      />
    </s-box>
  );
}
