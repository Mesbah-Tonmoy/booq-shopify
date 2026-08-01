/* eslint-disable react/prop-types */
export function ShopSettingsSection({ settings }) {
  const shopSetting = settings?.shopSetting || {};

  return (
    <s-stack direction="block" gap="base">
      <s-form-field>
        <s-text-field
          name="companyName"
          label="Company Name"
          {...(shopSetting.companyName
            ? { value: shopSetting.companyName }
            : {})}
        />
      </s-form-field>

      <s-form-field>
        <s-text-field
          name="adminEmail"
          label="Admin Email"
          type="email"
          {...(shopSetting.adminEmail
            ? { value: shopSetting.adminEmail }
            : {})}
        />
      </s-form-field>

      <s-form-field>
        <s-text-field
          name="additionalEmails"
          label="Add additional emails"
          {...(shopSetting.additionalEmails
            ? { value: shopSetting.additionalEmails }
            : {})}
        />
        <s-text slot="helper-text" color="subdued">
          All the booking related emails such as confirmation, cancellation,
          rescheduling, reminders etc are sent to admin email.
        </s-text>
      </s-form-field>
    </s-stack>
  );
}
