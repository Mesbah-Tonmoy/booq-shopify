import { useState } from 'react';
import type {
  ClearErrorFn,
  FormErrors,
  ServiceFormData,
  TimeSlot,
} from './types';

interface RegularSlotConfigurationProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Slot Configuration for Regular Booking
export function RegularSlotConfiguration({
  formData,
  errors = {},
  clearError = () => {},
}: RegularSlotConfigurationProps) {
  // Initialize with saved slots or default
  const savedConfig = formData?.slotConfiguration;
  const defaultSlots: TimeSlot[] = (savedConfig && 'slots' in savedConfig
    ? savedConfig.slots
    : null) || [{ start: '09:00', end: '17:00' }];
  const [slots, setSlots] = useState<TimeSlot[]>(defaultSlots);

  const addSlot = () => {
    setSlots([...slots, { start: '09:00', end: '17:00' }]);
  };

  const removeSlot = (index: number) => {
    if (slots.length > 1) {
      setSlots(slots.filter((_, i) => i !== index));
    }
  };

  const updateSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSlots(newSlots);
    clearError('slotConfiguration');
  };

  return (
    <div>
      <div style={{ marginTop: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <s-text>Time Slots</s-text>
          <s-button onClick={addSlot}>Add New Slot</s-button>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {slots.map((slot, index) => (
            <div
              key={index}
              style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <div style={{ flex: 1 }}>
                <label>Start Time</label>
                <input
                  type="time"
                  value={slot.start}
                  onChange={(e) => updateSlot(index, 'start', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>End Time</label>
                <input
                  type="time"
                  value={slot.end}
                  onChange={(e) => updateSlot(index, 'end', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>
              {slots.length > 1 && (
                <div style={{ paddingTop: '1.25rem' }}>
                  <s-button
                    variant="tertiary"
                    icon="delete"
                    onClick={() => removeSlot(index)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {errors?.slotConfiguration && (
        <div style={{ marginTop: '0.5rem' }}>
          <s-text color="critical">{errors.slotConfiguration}</s-text>
        </div>
      )}

      <input
        type="hidden"
        name="slotConfiguration"
        value={JSON.stringify({ slots })}
      />
    </div>
  );
}
