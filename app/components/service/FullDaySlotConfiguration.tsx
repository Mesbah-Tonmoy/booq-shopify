import { useState } from 'react';
import type {
  ClearErrorFn,
  FormErrors,
  FullDaySlotConfig,
  ServiceFormData,
  TimeSlot,
} from './types';

interface FullDaySlotConfigurationProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

const TIME_OPTIONS = [
  'Off',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
];

// Slot Configuration for Full-Day Booking
export function FullDaySlotConfiguration({
  formData,
  errors = {},
  clearError = () => {},
}: FullDaySlotConfigurationProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayKeys = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const savedConfig = formData?.slotConfiguration;
  const defaultSlots: FullDaySlotConfig = (savedConfig &&
  !('slots' in savedConfig)
    ? (savedConfig as FullDaySlotConfig)
    : null) || {
    monday: [{ start: '9:00 AM', end: '9:00 AM' }],
    tuesday: [{ start: '9:00 AM', end: '9:00 AM' }],
    wednesday: [{ start: '9:00 AM', end: '9:00 AM' }],
    thursday: [{ start: '9:00 AM', end: '9:00 AM' }],
    friday: [{ start: '9:00 AM', end: '9:00 AM' }],
    saturday: [{ start: 'Off', end: 'Off' }],
    sunday: [{ start: 'Off', end: 'Off' }],
  };

  const [slots, setSlots] = useState<FullDaySlotConfig>(defaultSlots);

  const addBreak = (day: string) => {
    setSlots({
      ...slots,
      [day]: [...slots[day], { start: '9:00 AM', end: '8:00 AM' }],
    });
  };

  const removeBreak = (day: string, index: number) => {
    const newSlots = slots[day].filter((_, i) => i !== index);
    setSlots({
      ...slots,
      [day]:
        newSlots.length > 0 ? newSlots : [{ start: '9:00 AM', end: '9:00 AM' }],
    });
  };

  const updateSlot = (
    day: string,
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    const newSlots = [...slots[day]];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSlots({
      ...slots,
      [day]: newSlots,
    });
    clearError('slotConfiguration');
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <s-text>
          Set minimum & maximum no. of days a customer can book this service
        </s-text>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '0.5rem',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <s-text>Minimum</s-text>
            <s-number-field
              name="minDays"
              defaultValue={String(formData?.minDays || 1)}
              min={1}
              style={{ width: '80px' }}
            />
            <s-text>days</s-text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <s-text>Maximum</s-text>
            <s-number-field
              name="maxDays"
              defaultValue={String(formData?.maxDays || 1)}
              min={1}
              style={{ width: '80px' }}
            />
            <s-text>days</s-text>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <s-text>Day - Start Time - End Time - Add Break</s-text>

        <div style={{ marginTop: '1rem' }}>
          {dayKeys.map((dayKey, index) => (
            <div
              key={dayKey}
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-start',
                marginBottom: '0.5rem',
              }}
            >
              <div style={{ width: '60px', paddingTop: '0.5rem' }}>
                <s-text>{days[index]}</s-text>
              </div>

              <div style={{ flex: 1 }}>
                {slots[dayKey].map((slot, slotIndex) => (
                  <div
                    key={slotIndex}
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <s-select
                        name={`slot_${dayKey}_${slotIndex}_start`}
                        value={slot.start}
                        onChange={(e) =>
                          updateSlot(
                            dayKey,
                            slotIndex,
                            'start',
                            e.currentTarget.value
                          )
                        }
                      >
                        {TIME_OPTIONS.map((t) => (
                          <s-option key={t} value={t}>
                            {t}
                          </s-option>
                        ))}
                      </s-select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <s-select
                        name={`slot_${dayKey}_${slotIndex}_end`}
                        value={slot.end}
                        onChange={(e) =>
                          updateSlot(
                            dayKey,
                            slotIndex,
                            'end',
                            e.currentTarget.value
                          )
                        }
                      >
                        {TIME_OPTIONS.map((t) => (
                          <s-option key={t} value={t}>
                            {t}
                          </s-option>
                        ))}
                      </s-select>
                    </div>
                    {slotIndex > 0 && (
                      <s-button
                        variant="tertiary"
                        icon="delete"
                        onClick={() => removeBreak(dayKey, slotIndex)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ paddingTop: '0.25rem' }}>
                <s-button variant="tertiary" onClick={() => addBreak(dayKey)}>
                  Add break
                </s-button>
              </div>
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
        value={JSON.stringify(slots)}
      />
    </div>
  );
}
