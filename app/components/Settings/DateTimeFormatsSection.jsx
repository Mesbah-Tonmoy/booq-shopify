/* eslint-disable react/prop-types */
export function DateTimeFormatsSection({ settings }) {
  return (
    <s-stack direction="block" gap="base">
      <s-form-field>
        <s-select
          name="weekStartsOn"
          label="Week Starts On"
          value={settings?.weekStartsOn || 'Sunday'}
        >
          <s-option value="Sunday">Sunday</s-option>
          <s-option value="Monday">Monday</s-option>
        </s-select>
      </s-form-field>

      <s-form-field>
        <s-select
          name="dateFormat"
          label="Date Format"
          value={settings?.dateFormat || 'Default (Eg: Sun, 31 Dec 2023)'}
        >
          <s-option value="Default (Eg: Sun, 31 Dec 2023)">
            Default (Eg: Sun, 31 Dec 2023)
          </s-option>
          <s-option value="Numeric (Eg: 31/12/2023)">
            Numeric (Eg: 31/12/2023)
          </s-option>
          <s-option value="US Numeric (Eg: 12/31/2023)">
            US Numeric (Eg: 12/31/2023)
          </s-option>
          <s-option value="ISO (Eg: 2023-12-31)">ISO (Eg: 2023-12-31)</s-option>
        </s-select>
      </s-form-field>

      <s-form-field>
        <s-select
          name="timeFormat"
          label="Time Format"
          value={settings?.timeFormat || '12-hour format (Eg: 2 PM)'}
        >
          <s-option value="12-hour format (Eg: 2 PM)">
            12-hour format (Eg: 2 PM)
          </s-option>
          <s-option value="24-hour format (Eg: 14:00)">
            24-hour format (Eg: 14:00)
          </s-option>
        </s-select>
      </s-form-field>
    </s-stack>
  );
}
