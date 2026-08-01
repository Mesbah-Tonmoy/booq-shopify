import type { Dispatch, SetStateAction } from 'react';

interface WidgetPositioningSectionProps {
  dateTimePickerPosition: string;
  setDateTimePickerPosition: Dispatch<SetStateAction<string>>;
  hideEndTime: boolean;
  setHideEndTime: Dispatch<SetStateAction<boolean>>;
  hideSlotAvailabilityCount: boolean;
  setHideSlotAvailabilityCount: Dispatch<SetStateAction<boolean>>;
}

export function WidgetPositioningSection({
  dateTimePickerPosition,
  setDateTimePickerPosition,
  hideEndTime,
  setHideEndTime,
  hideSlotAvailabilityCount,
  setHideSlotAvailabilityCount,
}: WidgetPositioningSectionProps) {
  return (
    <s-section heading="Widget Positioning" padding="base">
      <s-form-field>
        <s-select
          label="Date Time Picker Position"
          value={dateTimePickerPosition}
          onChange={(e) => setDateTimePickerPosition(e.currentTarget.value)}
        >
          <s-option value="before_add_to_cart">
            Default (Before add to cart button)
          </s-option>
          <s-option value="after_add_to_cart">
            After add to cart button
          </s-option>
          <s-option value="custom">Custom position</s-option>
        </s-select>
        <s-text slot="helper-text" color="subdued">
          Choose where to position the booking widget
        </s-text>
      </s-form-field>

      <div className="mt-4">
        <s-checkbox
          checked={hideEndTime}
          onChange={(e) => setHideEndTime(e.currentTarget.checked)}
          label="Hide End Time"
          details="Display only start time for the each slot (e.g., hotel check-ins"
        />
      </div>

      <div className="mt-4">
        <s-checkbox
          checked={hideSlotAvailabilityCount}
          onChange={(e) =>
            setHideSlotAvailabilityCount(e.currentTarget.checked)
          }
          label="Hide Slot Availability Count"
          details="Hide number of remaining slots from customers"
        />
      </div>
    </s-section>
  );
}
