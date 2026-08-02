import { useState } from 'react';
import type { Staff, Location, StaffGroup } from '@prisma/client';
import type { StaffWorkingHours } from '../types/staff';
import { WorkingHoursDayEditor } from './WorkingHoursDayEditor';

export type StaffFormData = Omit<Partial<Staff>, 'workingHours'> & {
  workingHours?: StaffWorkingHours | null;
};

interface StaffFormProps {
  formData?: StaffFormData | null;
  locations: Pick<Location, 'id' | 'name'>[];
  staffGroups: Pick<StaffGroup, 'id' | 'name'>[];
}

// Staff Form Component
export function StaffForm({
  formData,
  locations,
  staffGroups,
}: StaffFormProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [isEmailOpen, setIsEmailOpen] = useState(true);
  const [isOrgOpen, setIsOrgOpen] = useState(true);
  const [isCapacityOpen, setIsCapacityOpen] = useState(true);
  const [isLocationsOpen, setIsLocationsOpen] = useState(true);
  const [isStaffGroupsOpen, setIsStaffGroupsOpen] = useState(true);
  const [isBlockOutOpen, setIsBlockOutOpen] = useState(true);

  return (
    <s-stack direction="block" gap="small">
      {/* Profile Name Section */}
      <s-section>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsProfileOpen(!isProfileOpen);
            }
          }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: isProfileOpen ? '1rem' : '0',
          }}
        >
          <s-heading>Profile name</s-heading>
          <s-icon type={isProfileOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
        </div>

        <div style={{ display: isProfileOpen ? 'block' : 'none' }}>
          <s-stack direction="block" gap="small">
            {/* Full Name */}
            <s-text-field
              name="name"
              label="Full name"
              placeholder=""
              required
              {...(formData?.name ? { value: formData.name } : {})}
              details="The name customer and colleagues will see"
            />

            {/* Phone Number */}
            <s-text-field
              name="phone"
              label="Phone number"
              placeholder=""
              required
              {...(formData?.phone ? { value: formData.phone } : {})}
              details="Optional contact number"
            />

            {/* Bio/Notes */}
            <s-text-area
              name="bio"
              rows={3}
              label="Bio/Notes"
              placeholder=""
              {...(formData?.bio ? { value: formData.bio } : {})}
              details="Brief description about this staff member"
            />

            {/* Photo URL */}
            <s-url-field
              name="photoUrl"
              label="Photo URL"
              placeholder=""
              {...(formData?.photoUrl ? { value: formData.photoUrl } : {})}
              details="URL to a profile photo"
            />
          </s-stack>
        </div>
      </s-section>

      {/* Email for receiving booking notifications */}
      <s-section>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsEmailOpen(!isEmailOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsEmailOpen(!isEmailOpen);
            }
          }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: isEmailOpen ? '1rem' : '0',
          }}
        >
          <s-heading>Email for receiving booking notifications</s-heading>
          <s-icon type={isEmailOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
        </div>

        <div style={{ display: isEmailOpen ? 'block' : 'none' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <s-text>
              If you want to send booking notifications to two or more emails,
              enter emails separated by a comma.
            </s-text>
          </div>
          <s-email-field
            name="email"
            label="Email address"
            placeholder=""
            {...(formData?.email ? { value: formData.email } : {})}
            details="Enter multiple emails, separated by a comma."
          />
        </div>
      </s-section>

      {/* Organization & Settings */}
      <s-section>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsOrgOpen(!isOrgOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOrgOpen(!isOrgOpen);
            }
          }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: isOrgOpen ? '1rem' : '0',
          }}
        >
          <s-heading>Organization &amp; Settings</s-heading>
          <s-icon type={isOrgOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
        </div>

        <div style={{ display: isOrgOpen ? 'block' : 'none' }}>
          <s-stack direction="block" gap="small">
            {/* Time zone and Status */}
            <s-select
              name="timezone"
              label="Time zone"
              key={`timezone-${formData?.id || 'new'}`}
              {...(formData?.timezone
                ? { value: formData.timezone }
                : { value: 'Asia/Dhaka' })}
              details="Staf member working time zone"
            >
              <s-option value="Asia/Dhaka">Eastern time (ET)</s-option>
              <s-option value="America/New_York">New York (EST)</s-option>
              <s-option value="America/Los_Angeles">Los Angeles (PST)</s-option>
              <s-option value="Europe/London">London (GMT)</s-option>
              <s-option value="Asia/Tokyo">Tokyo (JST)</s-option>
            </s-select>

            <s-select
              name="status"
              label="Status"
              key={`status-${formData?.id || 'new'}`}
              {...(formData?.status
                ? { value: formData.status }
                : { value: 'active' })}
            >
              <s-option value="active">Active</s-option>
              <s-option value="inactive">Inactive</s-option>
            </s-select>

            {/* Menu order */}
            <s-number-field
              name="menuOrderBy"
              label="Menu order"
              placeholder="0"
              {...(formData?.menuOrderBy
                ? { value: String(formData.menuOrderBy) }
                : { value: '0' })}
              details="Order in staff listings ( lower number appears first)"
            />
          </s-stack>
        </div>
      </s-section>

      {/* Locations (Optional) */}
      <s-section>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsLocationsOpen(!isLocationsOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsLocationsOpen(!isLocationsOpen);
            }
          }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: isLocationsOpen ? '1rem' : '0',
          }}
        >
          <s-heading>Locations (Optional)</s-heading>
          <s-icon type={isLocationsOpen ? 'chevron-down' : 'chevron-up'} />
        </div>

        <div style={{ display: isLocationsOpen ? 'block' : 'none' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <s-text>
              If you want to send booking notifications to two or more emails,
              enter emails separated by a comma.
            </s-text>
          </div>
          <s-select
            name="locationId"
            label="Location"
            key={`location-${formData?.id || 'new'}`}
            {...(formData?.locationId
              ? { value: String(formData.locationId) }
              : {})}
          >
            <s-option value="">Select a location</s-option>
            {locations.map((location) => (
              <s-option key={location.id} value={String(location.id)}>
                {location.name}
              </s-option>
            ))}
          </s-select>
        </div>
      </s-section>

      {/* Staff groups */}
      <s-section>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsStaffGroupsOpen(!isStaffGroupsOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsStaffGroupsOpen(!isStaffGroupsOpen);
            }
          }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: isStaffGroupsOpen ? '1rem' : '0',
          }}
        >
          <s-heading>Staff groups</s-heading>
          <s-icon type={isStaffGroupsOpen ? 'chevron-down' : 'chevron-up'} />
        </div>

        <div style={{ display: isStaffGroupsOpen ? 'block' : 'none' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <s-text>
              If you want to send booking notifications to two or more emails,
              enter emails separated by a comma.
            </s-text>
          </div>
          <s-form-field>
            <s-select
              name="staffGroupId"
              label="Staff group"
              key={`staffGroup-${formData?.id || 'new'}`}
              {...(formData?.staffGroupId
                ? { value: String(formData.staffGroupId) }
                : {})}
            >
              <s-option value="">Select a staff group</s-option>
              {staffGroups.map((group) => (
                <s-option key={group.id} value={String(group.id)}>
                  {group.name}
                </s-option>
              ))}
            </s-select>
          </s-form-field>
        </div>
      </s-section>

      {/* Staff member capacity */}
      <s-section>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsCapacityOpen(!isCapacityOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsCapacityOpen(!isCapacityOpen);
            }
          }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: isCapacityOpen ? '1rem' : '0',
          }}
        >
          <s-heading>Staff member capacity</s-heading>
          <s-icon type={isCapacityOpen ? 'chevron-down' : 'chevron-up'} />
        </div>

        <div style={{ display: isCapacityOpen ? 'block' : 'none' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <s-text>
              Set the maximum number of appointments this staff member can
              handle per time slot
            </s-text>
          </div>
          <div>
            <s-number-field
              name="maxCapacity"
              label="Maximum concurrent appointments"
              placeholder="1"
              required
              {...(formData?.maxCapacity
                ? { value: String(formData.maxCapacity) }
                : { value: '1' })}
              details="To use this, turn on capacity by staff member' in service
                availability settings"
            />
          </div>
        </div>
      </s-section>

      <WorkingHoursDayEditor
        initialWorkingHours={formData?.workingHours}
        title="Working Hours"
      />

      {/* BlockOut Date & Time (optional) */}
      <s-section>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsBlockOutOpen(!isBlockOutOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsBlockOutOpen(!isBlockOutOpen);
            }
          }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: isBlockOutOpen ? '1rem' : '0',
          }}
        >
          <s-heading>BlockOut Date &amp; Time (optional)</s-heading>
          <s-icon type={isBlockOutOpen ? 'chevron-down' : 'chevron-up'} />
        </div>

        <div style={{ display: isBlockOutOpen ? 'block' : 'none' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <s-text>
              Block bookings for holidays, maintenance, or unavailable times.
            </s-text>
          </div>
          <s-button variant="primary">Add Block Out Period</s-button>
        </div>
      </s-section>
    </s-stack>
  );
}

export type StaffWithRelations = Staff & {
  location?: Pick<Location, 'name'> | null;
  staffGroup?: Pick<StaffGroup, 'name'> | null;
};

interface StaffListItemProps {
  staff: StaffWithRelations;
  onEdit: (staff: StaffWithRelations) => void;
  onDelete: (id: number) => void;
}

// Staff List Item Component
export function StaffListItem({ staff, onEdit, onDelete }: StaffListItemProps) {
  const popoverId = `staff-actions-${staff.id}`;
  const modalId = `delete-modal-${staff.id}`;
  const detailsModalId = `details-modal-${staff.id}`;

  return (
    <>
      <s-table-row>
        {/* Staff Member */}
        <s-table-cell>
          <s-stack direction="inline" gap="small-300">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ff6a3d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              {staff.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div>
                <s-text>{staff.name}</s-text>
              </div>
              <div>
                <s-text color="subdued">{staff.email || 'No email'}</s-text>
              </div>
            </div>
          </s-stack>
        </s-table-cell>

        {/* Location */}
        <s-table-cell>
          <s-text>{staff.location?.name || '-'}</s-text>
        </s-table-cell>

        {/* Status */}
        <s-table-cell>
          <s-badge tone={staff.status === 'active' ? 'success' : 'critical'}>
            {staff.status}
          </s-badge>
        </s-table-cell>

        {/* Bookings */}
        <s-table-cell>
          <s-text>0</s-text>
        </s-table-cell>

        {/* Actions */}
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
                onClick={() => onEdit(staff)}
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
          <s-modal id={detailsModalId} heading="Staff Member Details">
            <s-stack direction="block" gap="base">
              <s-section>
                <s-heading>Profile Information</s-heading>
                <s-stack direction="block" gap="base">
                  <div>
                    <s-text>Full Name: {staff.name}</s-text>
                  </div>
                  {staff.email && (
                    <div>
                      <s-text>Email: {staff.email}</s-text>
                    </div>
                  )}
                  {staff.phone && (
                    <div>
                      <s-text>Phone: {staff.phone}</s-text>
                    </div>
                  )}
                  {staff.bio && (
                    <div>
                      <s-text>Bio: {staff.bio}</s-text>
                    </div>
                  )}
                  <s-stack direction="inline" gap="small" alignItems="center">
                    <s-text>Status:</s-text>
                    <s-badge
                      tone={staff.status === 'active' ? 'success' : 'critical'}
                    >
                      {staff.status}
                    </s-badge>
                  </s-stack>
                  {staff.location && (
                    <div>
                      <s-text>Location: {staff.location.name}</s-text>
                    </div>
                  )}
                  {staff.staffGroup && (
                    <div>
                      <s-text>Staff Group: {staff.staffGroup.name}</s-text>
                    </div>
                  )}
                  <div>
                    <s-text>Maximum Capacity</s-text>
                    <s-text>{staff.maxCapacity}</s-text>
                  </div>
                </s-stack>
              </s-section>
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
          <s-modal id={modalId} heading="Delete staff member?">
            <s-stack gap="base">
              <s-text>
                Are you sure you want to delete &quot;{staff.name}&quot;? This
                action cannot be undone.
              </s-text>
            </s-stack>
            <s-button
              slot="primary-action"
              variant="primary"
              tone="critical"
              commandFor={modalId}
              command="--hide"
              onClick={() => onDelete(staff.id)}
            >
              Delete
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
