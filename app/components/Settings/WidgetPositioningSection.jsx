export function WidgetPositioningSection({
  dateTimePickerPosition,
  setDateTimePickerPosition,
  hideEndTime,
  setHideEndTime,
  hideSlotAvailabilityCount,
  setHideSlotAvailabilityCount,
}) {
  return (
    <s-section heading="Widget Positioning" padding="base">
      <s-form-field>
        <s-select
          label="Date Time Picker Position"
          value={dateTimePickerPosition}
          onChange={(e) => setDateTimePickerPosition(e.target.value)}
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
          onChange={(e) => setHideEndTime(e.target.checked)}
          label="Hide End Time"
          details="Display only start time for the each slot (e.g., hotel check-ins"
        />
      </div>

      <div className="mt-4">
        <s-checkbox
          checked={hideSlotAvailabilityCount}
          onChange={(e) => setHideSlotAvailabilityCount(e.target.checked)}
          label="Hide Slot Availability Count"
          details="Hide number of remaining slots from customers"
        />
      </div>
    </s-section>
  );
}
