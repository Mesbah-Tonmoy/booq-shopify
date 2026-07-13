import { useState } from 'react';

const DEFAULT_SLOT = { start: '9:00 AM', end: '5:00 pm' };

export default function DateSpecificHoursModal({ onApply, timeOptions }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([{ ...DEFAULT_SLOT }]);

  const reset = () => {
    setSelectedDate('');
    setSlots([{ ...DEFAULT_SLOT }]);
  };

  const handleApply = () => {
    if (!selectedDate) return;
    onApply(selectedDate, slots);
    reset();
  };

  const handleCancel = () => {
    reset();
  };

  const addSlot = () => setSlots((prev) => [...prev, { ...DEFAULT_SLOT }]);

  const removeSlot = (index) =>
    setSlots((prev) => prev.filter((_, i) => i !== index));

  const updateSlot = (index, field, value) =>
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );

  return (
    <s-modal
      id="date-specific-hours-modal"
      heading="Select the date(s) you want to assign specific hours"
      size="small"
      padding="base"
      accessibilityLabel="Select dates and assign specific hours"
    >
      <s-stack direction="block" gap="base" alignItems="center">
        {/* Calendar */}
        <s-date-picker
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {/* Time slots */}
        <div>
          <div className="mb-2">
            <s-text type="strong">What hours are you available?</s-text>
          </div>
          <div className="flex flex-col gap-2">
            {slots.map((slot, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-[130px]">
                  <s-select
                    value={slot.start}
                    onChange={(e) => updateSlot(index, 'start', e.target.value)}
                  >
                    {timeOptions.map((t) => (
                      <s-option key={t} value={t}>
                        {t}
                      </s-option>
                    ))}
                  </s-select>
                </div>
                <span className="text-[#8C9196]">
                  <s-icon type="menu-horizontal" />
                </span>
                <div className="w-[130px]">
                  <s-select
                    value={slot.end}
                    onChange={(e) => updateSlot(index, 'end', e.target.value)}
                  >
                    {timeOptions.map((t) => (
                      <s-option key={t} value={t}>
                        {t}
                      </s-option>
                    ))}
                  </s-select>
                </div>
                <s-button
                  type="button"
                  icon="x"
                  variant="tertiary"
                  accessibilityLabel="Remove slot"
                  onClick={() => removeSlot(index)}
                />
                {index === slots.length - 1 && (
                  <s-button
                    type="button"
                    icon="plus"
                    variant="tertiary"
                    accessibilityLabel="Add slot"
                    onClick={addSlot}
                  />
                )}
              </div>
            ))}
            {slots.length === 0 && (
              <div className="flex items-center gap-2">
                <div className="py-1.5 px-4 bg-[#F6F6F7] rounded-[6px] text-[#8C9196] text-[14px] border border-transparent">
                  Unavailable
                </div>
                <s-button
                  type="button"
                  icon="plus"
                  variant="tertiary"
                  accessibilityLabel="Add slot"
                  onClick={addSlot}
                />
              </div>
            )}
          </div>
        </div>
      </s-stack>

      <s-button
        slot="secondary-actions"
        commandFor="date-specific-hours-modal"
        command="--hide"
        onClick={handleCancel}
      >
        Cancel
      </s-button>

      <s-button
        slot="primary-action"
        variant="primary"
        commandFor="date-specific-hours-modal"
        command="--hide"
        onClick={handleApply}
      >
        Apply
      </s-button>
    </s-modal>
  );
}
