import { useState } from 'react';
import type { Location } from '@prisma/client';
import type { LocationAddress, LocationWorkingHours } from '../types/location';
import { WorkingHoursDayEditor } from './WorkingHoursDayEditor';

export type LocationFormData = Omit<
  Partial<Location>,
  'address' | 'workingHours'
> & {
  address?: LocationAddress | null;
  workingHours?: LocationWorkingHours | null;
};

interface BasicInformationTabProps {
  formData?: LocationFormData;
}

// Basic Information Tab Component
export function BasicInformationTab({
  formData = {},
}: BasicInformationTabProps) {
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
              <s-email-field
                name="email"
                label="Email Address"
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
                    {...(formData?.phone ? { value: formData.phone } : {})}
                    details="Location contact number"
                  />
                </s-form-field>
              </s-grid-item>

              <s-grid-item>
                <s-form-field>
                  <s-url-field
                    name="website"
                    label="Website"
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

interface AdvancedSettingsTabProps {
  formData?: LocationFormData;
}

// Advanced Settings Tab Component
export function AdvancedSettingsTab({
  formData = {},
}: AdvancedSettingsTabProps) {
  return (
    <s-stack direction="block" gap="small">
      {/* Capacity Settings */}
      <s-section>
        <s-heading>Capacity Settings</s-heading>
        <s-form-field>
          <s-number-field
            name="maxCapacity"
            label="Maximum Capacity"
            min={1}
            {...(formData?.maxCapacity
              ? { value: String(formData.maxCapacity) }
              : { value: '10' })}
            details="Maximum concurrent bookings for this location"
          />
        </s-form-field>
      </s-section>

      <WorkingHoursDayEditor initialWorkingHours={formData?.workingHours} />

      {/* Additional Information */}
      <s-section>
        <s-heading>Additional Information</s-heading>

        <s-form-field>
          <s-text-area
            name="details"
            label="Location Details"
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

export type LocationWithParsedFields = Omit<
  Location,
  'address' | 'workingHours'
> & {
  address?: LocationAddress | null;
  workingHours?: LocationWorkingHours | null;
};

interface LocationListItemProps {
  location: LocationWithParsedFields;
  onEdit: (location: LocationWithParsedFields) => void;
  onDelete: (id: number) => void;
}

// Location List Item Component
export function LocationListItem({
  location,
  onEdit,
  onDelete,
}: LocationListItemProps) {
  const popoverId = `location-actions-${location.id}`;
  const modalId = `delete-modal-${location.id}`;
  const detailsModalId = `details-modal-${location.id}`;

  return (
    <>
      <s-table-row>
        <s-table-cell>
          <s-stack direction="inline">
            <s-icon type="location" />
            <s-text>{location.name}</s-text>
          </s-stack>
        </s-table-cell>
        <s-table-cell>
          <s-text>{location.country}</s-text>
        </s-table-cell>
        <s-table-cell>
          <s-badge
            tone={location.status === 'enabled' ? 'success' : 'critical'}
          >
            {location.status}
          </s-badge>
        </s-table-cell>
        <s-table-cell>
          <s-text>{location.maxCapacity || 100}</s-text>
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
            <s-stack direction="block" gap="small">
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
                    <s-text>Name: {location.name}</s-text>
                  </div>
                  <div>
                    <s-text>Country: {location.country}</s-text>
                  </div>
                  <div>
                    <s-text>Timezone: {location.timezone}</s-text>
                  </div>
                  <s-stack direction="inline" gap="small" alignItems="center">
                    <s-text>Status</s-text>
                    <s-badge
                      tone={
                        location.status === 'enabled' ? 'success' : 'critical'
                      }
                    >
                      {location.status}
                    </s-badge>
                  </s-stack>
                  <div>
                    <s-text>
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
                  <s-text>Address Information</s-text>
                  <s-stack direction="block" gap="base">
                    {location.address?.street && (
                      <div>
                        <s-text>Street</s-text>
                        <s-text>{location.address.street}</s-text>
                      </div>
                    )}
                    {location.address?.city && (
                      <div>
                        <s-text>City: {location.address.city}</s-text>
                      </div>
                    )}
                    {location.address?.state && (
                      <div>
                        <s-text>
                          State/Division: {location.address.state}
                        </s-text>
                      </div>
                    )}
                    {location.address?.postalCode && (
                      <div>
                        <s-text>
                          Postal/ZIP Code: {location.address.postalCode}
                        </s-text>
                      </div>
                    )}
                  </s-stack>
                </s-section>
              )}

              {(location.email || location.phone || location.website) && (
                <s-section>
                  <s-text>Contact Information</s-text>
                  <s-stack direction="block" gap="base">
                    {location.email && (
                      <div>
                        <s-text>Email: {location.email}</s-text>
                      </div>
                    )}
                    {location.phone && (
                      <div>
                        <s-text>Phone: {location.phone}</s-text>
                      </div>
                    )}
                    {location.website && (
                      <div>
                        <s-text>Website: {location.website}</s-text>
                      </div>
                    )}
                  </s-stack>
                </s-section>
              )}

              {(location.details || location.instructions) && (
                <s-section>
                  <s-text>Additional Information</s-text>
                  <s-stack direction="block" gap="base">
                    {location.details && (
                      <div>
                        <s-text>Location Details: {location.details}</s-text>
                      </div>
                    )}
                    {location.instructions && (
                      <div>
                        <s-text>
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
