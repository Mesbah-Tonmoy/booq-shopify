import { useState } from 'react';
import type { ClearErrorFn, FormErrors, ServiceFormData } from './types';

interface MultiDaySlotConfigurationProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Slot Configuration for Multi-Day Booking
export function MultiDaySlotConfiguration({
  formData,
  clearError = () => {},
}: MultiDaySlotConfigurationProps) {
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

  const [allowedDays, setAllowedDays] = useState<string[]>(
    formData?.allowedDays || [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
    ]
  );

  const toggleDay = (day: string) => {
    if (allowedDays.includes(day)) {
      setAllowedDays(allowedDays.filter((d) => d !== day));
    } else {
      setAllowedDays([...allowedDays, day]);
    }
    clearError('slotConfiguration');
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
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

      <div style={{ marginBottom: '1.5rem' }}>
        <s-text>
          Set minimum & maximum no. of days a customer can book this service
        </s-text>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          {dayKeys.map((dayKey, index) => (
            <s-button
              key={dayKey}
              variant={allowedDays.includes(dayKey) ? 'primary' : 'secondary'}
              onClick={() => toggleDay(dayKey)}
            >
              {days[index]}
            </s-button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <s-text>Multi-Day Booking Options</s-text>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <input
                type="radio"
                name="multiDayBooking"
                value="flexible"
                defaultChecked={formData?.multiDayBooking !== 'consecutive'}
              />
              <div>
                <s-text>Flexible Date Selection</s-text>
                <s-paragraph>
                  Customer can book multiple dates, either consecutive or
                  non-consecutive.
                </s-paragraph>
              </div>
            </label>
          </div>
          <div>
            <label
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <input
                type="radio"
                name="multiDayBooking"
                value="consecutive"
                defaultChecked={formData?.multiDayBooking === 'consecutive'}
              />
              <div>
                <s-text>Consecutive date Selection</s-text>
                <s-paragraph>
                  Customer can book multiple days only if they are consecutive,
                  with no gaps between dates.
                </s-paragraph>
              </div>
            </label>
          </div>
        </div>
      </div>

      <input
        type="hidden"
        name="allowedDays"
        value={JSON.stringify(allowedDays)}
      />
    </div>
  );
}
