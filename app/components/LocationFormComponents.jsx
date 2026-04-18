/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

// Basic Information Tab Component
export function BasicInformationTab({ formData = {} }) {
  const [isBasicOpen, setIsBasicOpen] = useState(true);
  const [isAddressOpen, setIsAddressOpen] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(true);

  return (
    <s-stack direction="block" gap="small">
      {/* Basic Information Section */}
      <s-section>
        <s-stack
          direction="inline"
          alignItems="center"
          justifyContent="space-between"
          gap="small-100"
          className="cursor-pointer"
          paddingBlockEnd={isBasicOpen ? 'small-300' : ''}
          onClick={() => setIsBasicOpen(!isBasicOpen)}
        >
          <s-heading>Basic Information</s-heading>
          <s-icon type={isBasicOpen ? 'chevron-down' : 'chevron-up'} />
        </s-stack>
        <div style={{ display: isBasicOpen ? 'block' : 'none' }}>
          <s-stack direction="block" gap="small">
            {/* Location Name */}
            <s-stack>
              <s-text-field
                name="name"
                label="Name"
                required
                placeholder=""
                {...(formData?.name ? { value: formData.name } : {})}
              />
              <s-text slot="helper-text">
                Give your location a descriptive name(e.g.,Main office
              </s-text>
            </s-stack>

            {/* Location and Timezone */}
            <s-grid gridTemplateColumns="1fr 2fr" gap="small">
              <s-grid-item>
                <s-form-field>
                  <s-select
                    name="country"
                    label="Country"
                    required
                    key={`country-${formData?.id || 'new'}`}
                    {...(formData?.country
                      ? { value: formData.country }
                      : { value: 'Bangladesh' })}
                  >
                    <s-option value="Bangladesh">Bangladesh</s-option>
                    <s-option value="United States">United States</s-option>
                    <s-option value="United Kingdom">United Kingdom</s-option>
                    <s-option value="Canada">Canada</s-option>
                    <s-option value="Australia">Australia</s-option>
                    <s-option value="India">India</s-option>
                  </s-select>
                </s-form-field>
              </s-grid-item>
              <s-grid-item>
                <s-form-field>
                  <s-select
                    name="timezone"
                    label="Time zone"
                    required
                    key={`timezone-${formData?.id || 'new'}`}
                    {...(formData?.timezone
                      ? { value: formData.timezone }
                      : { value: 'Asia/Dhaka' })}
                    details="Booking time displays here"
                  >
                    <s-option value="Asia/Dhaka">
                      Dhaka (standard time)
                    </s-option>
                    <s-option value="America/New_York">New York (EST)</s-option>
                    <s-option value="America/Los_Angeles">
                      Los Angeles (PST)
                    </s-option>
                    <s-option value="Europe/London">London (GMT)</s-option>
                    <s-option value="Asia/Tokyo">Tokyo (JST)</s-option>
                    <s-option value="Australia/Sydney">Sydney (AEST)</s-option>
                  </s-select>
                </s-form-field>
              </s-grid-item>
            </s-grid>

            {/* Status */}
            <s-select
              name="status"
              label="Status"
              required
              key={`status-${formData?.id || 'new'}`}
              {...(formData?.status
                ? { value: formData.status }
                : { value: 'enabled' })}
            >
              <s-option value="enabled">Enabled - Active for bookings</s-option>
              <s-option value="disabled">Disabled - Not available</s-option>
            </s-select>
          </s-stack>
        </div>
      </s-section>

      {/* Address Information Section */}
      <s-section>
        <s-stack
          direction="inline"
          alignItems="center"
          justifyContent="space-between"
          gap="small-100"
          className="cursor-pointer"
          paddingBlockEnd={isAddressOpen ? 'small-300' : ''}
          onClick={() => setIsAddressOpen(!isAddressOpen)}
        >
          <s-heading>Address Information</s-heading>
          <s-icon type={isAddressOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
        </s-stack>

        <div style={{ display: isAddressOpen ? 'block' : 'none' }}>
          <s-stack direction="block" gap="small">
            <s-form-field>
              <s-text-field
                name="street"
                label="Street address"
                placeholder=""
                {...(formData?.address?.street
                  ? { value: formData.address.street }
                  : {})}
                details="Full street address (building number + street name)"
              />
            </s-form-field>

            <s-grid gridTemplateColumns="1fr 1fr" gap="small">
              <s-grid-item>
                <s-form-field>
                  <s-text-field
                    name="city"
                    label="City"
                    {...(formData?.address?.city
                      ? { value: formData.address.city }
                      : {})}
                  />
                </s-form-field>
              </s-grid-item>
              <s-grid-item>
                <s-form-field>
                  <s-text-field
                    name="state"
                    label="State/Division"
                    {...(formData?.address?.state
                      ? { value: formData.address.state }
                      : {})}
                  />
                </s-form-field>
              </s-grid-item>
            </s-grid>

            <s-form-field>
              <s-text-field
                name="postalCode"
                label="Postal/ZIP Code"
                {...(formData?.address?.postalCode
                  ? { value: formData.address.postalCode }
                  : {})}
              />
            </s-form-field>
          </s-stack>
        </div>
      </s-section>

      {/* Contact & Notification Section */}
      <s-section>
        <s-stack
          direction="inline"
          alignItems="center"
          justifyContent="space-between"
          gap="small-100"
          className="cursor-pointer"
          paddingBlockEnd={isContactOpen ? 'small-300' : ''}
          onClick={() => setIsContactOpen(!isContactOpen)}
        >
          <s-heading>Contact &amp; Notification</s-heading>
          <s-icon type={isContactOpen ? 'chevron-down' : 'chevron-up'} />
        </s-stack>

        <div style={{ display: isContactOpen ? 'block' : 'none' }}>
          <s-stack direction="block" gap="small">
            <s-form-field>
              <s-text-field
                name="email"
                label="Email Address"
                type="email"
                {...(formData?.email ? { value: formData.email } : {})}
                details="Notifications go to this email. Add more emails with commas."
              />
            </s-form-field>

            <s-grid gridTemplateColumns="1fr 1fr" gap="small">
              <s-grid-item>
                <s-form-field>
                  <s-text-field
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    {...(formData?.phone ? { value: formData.phone } : {})}
                    details="Location contact number"
                  />
                </s-form-field>
              </s-grid-item>

              <s-grid-item>
                <s-form-field>
                  <s-text-field
                    name="website"
                    label="Website"
                    type="url"
                    {...(formData?.website ? { value: formData.website } : {})}
                    details="Optional booking URL"
                  />
                </s-form-field>
              </s-grid-item>
            </s-grid>
          </s-stack>
        </div>
      </s-section>
    </s-stack>
  );
}

// Advanced Settings Tab Component
export function AdvancedSettingsTab({ formData = {} }) {
  const workingHours = formData?.workingHours || {};
  const [openDays, setOpenDays] = useState(() => {
    const initial = {};
    [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ].forEach((day) => {
      const dayData = workingHours[day.toLowerCase()];
      initial[day.toLowerCase()] =
        dayData?.open ??
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day);
    });
    return initial;
  });

  const [breakEnabled, setBreakEnabled] = useState(() => {
    const initial = {};
    [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ].forEach((day) => {
      const dayData = workingHours[day.toLowerCase()];
      initial[day.toLowerCase()] = dayData?.breakEnabled ?? false;
    });
    return initial;
  });

  const [showEdits, setShowEdits] = useState(true);

  // Sync state when formData changes (when editing a different location)
  useEffect(() => {
    const wh = formData?.workingHours || {};
    const openInitial = {};
    const breakInitial = {};
    [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ].forEach((day) => {
      const dayData = wh[day.toLowerCase()];
      openInitial[day.toLowerCase()] =
        dayData?.open ??
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day);
      breakInitial[day.toLowerCase()] = dayData?.breakEnabled ?? false;
    });
    setOpenDays(openInitial);
    setBreakEnabled(breakInitial);
  }, [formData]);

  const getWorkingHourData = (day) => {
    const dayData = workingHours[day.toLowerCase()];
    return {
      open:
        dayData?.open ??
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day),
      start: dayData?.start || '09:00',
      end: dayData?.end || '17:00',
      breakEnabled: dayData?.breakEnabled ?? false,
      breakStart: dayData?.breakStart || '12:00',
      breakEnd: dayData?.breakEnd || '13:00',
    };
  };

  const handleCheckboxChange = (day, checked) => {
    setOpenDays((prev) => ({
      ...prev,
      [day.toLowerCase()]: checked,
    }));
  };

  const handleBreakChange = (day, checked) => {
    setBreakEnabled((prev) => ({
      ...prev,
      [day.toLowerCase()]: checked,
    }));
  };

  return (
    <s-stack direction="block" gap="small">
      {/* Capacity Settings */}
      <s-section>
        <s-heading variant="heading-sm" as="h3">
          Capacity Settings
        </s-heading>
        <s-form-field>
          <s-text-field
            name="maxCapacity"
            label="Maximum Capacity"
            type="number"
            min="1"
            {...(formData?.maxCapacity
              ? { value: String(formData.maxCapacity) }
              : { value: '10' })}
            details="Maximum concurrent bookings for this location"
          />
        </s-form-field>
      </s-section>

      {/* Working Hours */}
      <s-section>
        <div>
          <s-stack
            direction="inline"
            alignItems="center"
            justifyContent="space-between"
            gap="base"
          >
            <s-heading variant="heading-lg" as="h2">
              Working Hours
            </s-heading>
            <s-button variant="plain" onClick={() => setShowEdits(!showEdits)}>
              {showEdits ? 'Hide Edits' : 'Show Edits'}
            </s-button>
          </s-stack>
        </div>

        {showEdits && (
          <div style={{ marginTop: '10px' }}>
            <s-stack direction="block" gap="base">
              {[
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ].map((day) => {
                const dayData = getWorkingHourData(day);
                const isOpen = openDays[day.toLowerCase()];
                const hasBreak = breakEnabled[day.toLowerCase()];

                return (
                  <div
                    key={day}
                    style={{
                      backgroundColor: '#f6f6f7',
                      borderRadius: '8px',
                      padding: '1rem',
                      border: '2px solid #e3e3e3',
                    }}
                  >
                    {/* Day name and Open checkbox */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <s-text variant="heading-md" as="h3">
                        {day}
                      </s-text>
                      <s-checkbox
                        name={`workingHours_${day.toLowerCase()}_open`}
                        checked={isOpen}
                        onChange={(e) =>
                          handleCheckboxChange(day, e.target.checked)
                        }
                      >
                        Open
                      </s-checkbox>
                    </div>

                    {isOpen && (
                      <div style={{ marginTop: '1rem' }}>
                        {/* Start and End Time */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                            marginBottom: '1rem',
                          }}
                        >
                          <div>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <s-text variant="body-sm" fontWeight="semibold">
                                Start Date
                              </s-text>
                            </div>
                            <s-text-field
                              name={`workingHours_${day.toLowerCase()}_start`}
                              type="time"
                              {...(dayData.start
                                ? { value: dayData.start }
                                : { value: '09:00' })}
                            />
                          </div>
                          <div>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <s-text variant="body-sm" fontWeight="semibold">
                                End Time
                              </s-text>
                            </div>
                            <s-text-field
                              name={`workingHours_${day.toLowerCase()}_end`}
                              type="time"
                              {...(dayData.end
                                ? { value: dayData.end }
                                : { value: '17:00' })}
                            />
                          </div>
                        </div>

                        {/* Break Time Checkbox */}
                        <div style={{ marginBottom: hasBreak ? '1rem' : '0' }}>
                          <s-checkbox
                            label="Break Time (Optional)"
                            name={`workingHours_${day.toLowerCase()}_breakEnabled`}
                            checked={hasBreak}
                            onChange={(e) =>
                              handleBreakChange(day, e.target.checked)
                            }
                          />
                        </div>

                        {/* Break Time Fields */}
                        {hasBreak && (
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '1rem',
                            }}
                          >
                            <div>
                              <div style={{ marginBottom: '0.5rem' }}>
                                <s-text variant="body-sm" fontWeight="semibold">
                                  Start time
                                </s-text>
                              </div>
                              <s-text-field
                                name={`workingHours_${day.toLowerCase()}_breakStart`}
                                type="time"
                                {...(dayData.breakStart
                                  ? { value: dayData.breakStart }
                                  : { value: '12:00' })}
                              />
                              <div style={{ marginTop: '0.25rem' }}>
                                <s-text variant="body-sm" color="subdued">
                                  When break starts
                                </s-text>
                              </div>
                            </div>
                            <div>
                              <div style={{ marginBottom: '0.5rem' }}>
                                <s-text variant="body-sm" fontWeight="semibold">
                                  End Time
                                </s-text>
                              </div>
                              <s-text-field
                                name={`workingHours_${day.toLowerCase()}_breakEnd`}
                                type="time"
                                {...(dayData.breakEnd
                                  ? { value: dayData.breakEnd }
                                  : { value: '13:00' })}
                              />
                              <div style={{ marginTop: '0.25rem' }}>
                                <s-text variant="body-sm" color="subdued">
                                  When break ends
                                </s-text>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </s-stack>
          </div>
        )}
      </s-section>

      {/* Additional Information */}
      <s-section>
        <s-heading variant="heading-sm" as="h3">
          Additional Information
        </s-heading>

        <s-form-field>
          <s-text-area
            name="details"
            label="Location Details"
            multiline
            rows={3}
            {...(formData?.details ? { value: formData.details } : {})}
            details="Internal notes about this location"
          />
        </s-form-field>

        <div style={{ marginTop: '.75rem' }}>
          <s-form-field>
            <s-text-area
              name="instructions"
              label="Customer Instructions"
              multiline
              rows={3}
              {...(formData?.instructions
                ? { value: formData.instructions }
                : {})}
              details="Special Instructions that customers will see when booking at this location"
            />
          </s-form-field>
        </div>
      </s-section>
    </s-stack>
  );
}

// Location List Item Component
export function LocationListItem({ location, onEdit, onDelete }) {
  const popoverId = `location-actions-${location.id}`;
  const modalId = `delete-modal-${location.id}`;
  const detailsModalId = `details-modal-${location.id}`;

  return (
    <>
      <s-table-row>
        <s-table-cell>
          <s-stack direction="inline">
            <s-icon type="location" />
            <s-text variant="body-sm" fontWeight="semibold">
              {location.name}
            </s-text>
          </s-stack>
        </s-table-cell>
        <s-table-cell>
          <s-text variant="body-sm">{location.country}</s-text>
        </s-table-cell>
        <s-table-cell>
          <s-badge
            tone={location.status === 'enabled' ? 'success' : 'critical'}
          >
            {location.status}
          </s-badge>
        </s-table-cell>
        <s-table-cell>
          <s-text variant="body-sm">{location.maxCapacity || 100}</s-text>
        </s-table-cell>
        <s-table-cell>
          <div style={{ textAlign: 'right' }}>
            <s-button
              variant="tertiary"
              commandFor={popoverId}
              command="--toggle"
            >
              •••
            </s-button>
          </div>

          {/* Popover for actions */}
          <s-popover id={popoverId}>
            <s-stack direction="block" gap="xs">
              <div
                style={{ padding: '0.75rem 0.75rem 0.5rem', fontWeight: '600' }}
              >
                Actions
              </div>
              <s-button
                variant="tertiary"
                commandFor={detailsModalId}
                command="--show"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                icon="text-align-left"
              >
                Details
              </s-button>
              <s-button
                variant="tertiary"
                commandFor={popoverId}
                command="--hide"
                onClick={() => onEdit(location)}
                style={{ width: '100%', justifyContent: 'flex-start' }}
                icon="edit"
              >
                Edit
              </s-button>
              <s-button
                variant="tertiary"
                tone="critical"
                commandFor={modalId}
                command="--show"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                icon="delete"
              >
                Delete
              </s-button>
            </s-stack>
          </s-popover>

          {/* Details modal */}
          <s-modal id={detailsModalId} heading="Location Details">
            <s-stack direction="block" gap="base">
              <s-section>
                <s-heading>Basic Information</s-heading>
                <s-stack direction="block" gap="base">
                  <div>
                    <s-text variant="body-sm" fontWeight="semibold">
                      Name: {location.name}
                    </s-text>
                  </div>
                  <div>
                    <s-text variant="body-sm" fontWeight="semibold">
                      Country: {location.country}
                    </s-text>
                  </div>
                  <div>
                    <s-text variant="body-sm" fontWeight="semibold">
                      Timezone: {location.timezone}
                    </s-text>
                  </div>
                  <s-stack direction="inline" gap="small" alignItems="center">
                    <s-text variant="body-sm" fontWeight="semibold">
                      Status
                    </s-text>
                    <s-badge
                      tone={
                        location.status === 'enabled' ? 'success' : 'critical'
                      }
                    >
                      {location.status}
                    </s-badge>
                  </s-stack>
                  <div>
                    <s-text variant="body-sm" fontWeight="semibold">
                      Maximum Capacity: {location.maxCapacity || 100}
                    </s-text>
                  </div>
                </s-stack>
              </s-section>

              {(location.address?.street ||
                location.address?.city ||
                location.address?.state ||
                location.address?.postalCode) && (
                <s-section>
                  <s-text variant="heading-sm" as="h3">
                    Address Information
                  </s-text>
                  <s-stack direction="block" gap="base">
                    {location.address?.street && (
                      <div>
                        <s-text variant="body-sm" fontWeight="semibold">
                          Street
                        </s-text>
                        <s-text variant="body-sm">
                          {location.address.street}
                        </s-text>
                      </div>
                    )}
                    {location.address?.city && (
                      <div>
                        <s-text variant="body-sm" fontWeight="semibold">
                          City: {location.address.city}
                        </s-text>
                      </div>
                    )}
                    {location.address?.state && (
                      <div>
                        <s-text variant="body-sm" fontWeight="semibold">
                          State/Division: {location.address.state}
                        </s-text>
                      </div>
                    )}
                    {location.address?.postalCode && (
                      <div>
                        <s-text variant="body-sm" fontWeight="semibold">
                          Postal/ZIP Code: {location.address.postalCode}
                        </s-text>
                      </div>
                    )}
                  </s-stack>
                </s-section>
              )}

              {(location.email || location.phone || location.website) && (
                <s-section>
                  <s-text variant="heading-sm" as="h3">
                    Contact Information
                  </s-text>
                  <s-stack direction="block" gap="base">
                    {location.email && (
                      <div>
                        <s-text variant="body-sm" fontWeight="semibold">
                          Email: {location.email}
                        </s-text>
                      </div>
                    )}
                    {location.phone && (
                      <div>
                        <s-text variant="body-sm" fontWeight="semibold">
                          Phone: {location.phone}
                        </s-text>
                      </div>
                    )}
                    {location.website && (
                      <div>
                        <s-text variant="body-sm" fontWeight="semibold">
                          Website: {location.website}
                        </s-text>
                      </div>
                    )}
                  </s-stack>
                </s-section>
              )}

              {(location.details || location.instructions) && (
                <s-section>
                  <s-text variant="heading-sm" as="h3">
                    Additional Information
                  </s-text>
                  <s-stack direction="block" gap="base">
                    {location.details && (
                      <div>
                        <s-text variant="body-sm" fontWeight="semibold">
                          Location Details: {location.details}
                        </s-text>
                      </div>
                    )}
                    {location.instructions && (
                      <div>
                        <s-text variant="body-sm" fontWeight="semibold">
                          Customer Instructions: {location.instructions}
                        </s-text>
                      </div>
                    )}
                  </s-stack>
                </s-section>
              )}
            </s-stack>
            <s-button
              slot="primary-action"
              variant="primary"
              commandFor={detailsModalId}
              command="--hide"
            >
              Close
            </s-button>
          </s-modal>

          {/* Delete confirmation modal */}
          <s-modal id={modalId} heading="Delete location?">
            <s-stack gap="base">
              <s-text>Are you sure want to delete this location?</s-text>
            </s-stack>
            <s-button
              slot="primary-action"
              variant="primary"
              tone="critical"
              commandFor={modalId}
              command="--hide"
              onClick={() => onDelete(location.id)}
            >
              Delete location
            </s-button>
            <s-button
              slot="secondary-actions"
              variant="secondary"
              commandFor={modalId}
              command="--hide"
            >
              Cancel
            </s-button>
          </s-modal>
        </s-table-cell>
      </s-table-row>
    </>
  );
}
