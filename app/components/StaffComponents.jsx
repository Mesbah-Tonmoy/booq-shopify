/* eslint-disable react/prop-types */
import { useState } from "react";

// Staff Form Component
export function StaffForm({ formData, locations, staffGroups }) {
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [isEmailOpen, setIsEmailOpen] = useState(true);
  const [isOrgOpen, setIsOrgOpen] = useState(true);
  const [isCapacityOpen, setIsCapacityOpen] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Profile Name Section */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #e1e3e5",
          padding: "1rem",
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsProfileOpen(!isProfileOpen);
            }
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: isProfileOpen ? "1rem" : "0",
          }}
        >
          <s-heading>Profile name</s-heading>
          <s-icon type={isProfileOpen ? "chevron-down" : "chevron-up"}></s-icon>
        </div>

        <div style={{ display: isProfileOpen ? "block" : "none" }}>
          <s-stack direction="block" gap="base">
            {/* Full Name */}
            <div>
              <div style={{ marginBottom: "0.5rem" }}>
                <s-text variant="body-md" fontWeight="semibold">Full name</s-text>
              </div>
              <s-text-field
                name="name"
                label="Full name"
                label-accessibility-visibility="hidden"
                placeholder=""
                required
                {...(formData?.name ? { value: formData.name } : {})}
              />
              <div style={{ marginTop: "0.25rem" }}>
                <s-text variant="body-sm" color="subdued">
                  The name customer and colleagues will see
                </s-text>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <div style={{ marginBottom: "0.5rem" }}>
                <s-text variant="body-md" fontWeight="semibold">Phone number</s-text>
              </div>
              <s-text-field
                name="phone"
                type="tel"
                label="Phone number"
                label-accessibility-visibility="hidden"
                placeholder=""
                required
                {...(formData?.phone ? { value: formData.phone } : {})}
              />
              <div style={{ marginTop: "0.25rem" }}>
                <s-text variant="body-sm" color="subdued">
                  Optional contact number
                </s-text>
              </div>
            </div>

            {/* Bio/Notes */}
            <div>
              <div style={{ marginBottom: "0.5rem" }}>
                <s-text variant="body-md" fontWeight="semibold">Bio/Notes</s-text>
              </div>
              <s-text-field
                name="bio"
                multiline="3"
                label="Bio/Notes"
                label-accessibility-visibility="hidden"
                placeholder=""
                {...(formData?.bio ? { value: formData.bio } : {})}
              />
              <div style={{ marginTop: "0.25rem" }}>
                <s-text variant="body-sm" color="subdued">
                  Brief description about this staff member
                </s-text>
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <div style={{ marginBottom: "0.5rem" }}>
                <s-text variant="body-md" fontWeight="semibold">Photo URL (Optional)</s-text>
              </div>
              <s-text-field
                name="photoUrl"
                type="url"
                label="Photo URL"
                label-accessibility-visibility="hidden"
                placeholder=""
                {...(formData?.photoUrl ? { value: formData.photoUrl } : {})}
              />
              <div style={{ marginTop: "0.25rem" }}>
                <s-text variant="body-sm" color="subdued">
                  URL to a profile photo
                </s-text>
              </div>
            </div>
          </s-stack>
        </div>
      </div>

      {/* Email for receiving booking notifications */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #e1e3e5",
          padding: "1rem",
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsEmailOpen(!isEmailOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsEmailOpen(!isEmailOpen);
            }
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: isEmailOpen ? "1rem" : "0",
          }}
        >
          <s-heading>Email for receiving booking notifications</s-heading>
          <s-icon type={isEmailOpen ? "chevron-down" : "chevron-up"}></s-icon>
        </div>

        <div style={{ display: isEmailOpen ? "block" : "none" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <s-text variant="body-sm">
              If you want to send booking notifications to two or more emails, enter emails separated by a comma.
            </s-text>
          </div>
          <s-form-field label="Email address( for booking notifications)">
            <s-text-field
              name="email"
              type="email"
              label="Email address"
              label-accessibility-visibility="hidden"
              placeholder=""
              {...(formData?.email ? { value: formData.email } : {})}
            />
            <div style={{ marginTop: "0.25rem" }}>
              <s-text slot="helper-text" variant="body-sm" color="subdued">
                Enter multiple emails, separated by a comma.
              </s-text>
            </div>
          </s-form-field>
        </div>
      </div>

      {/* Organization & Settings */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #e1e3e5",
          padding: "1rem",
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsOrgOpen(!isOrgOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOrgOpen(!isOrgOpen);
            }
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: isOrgOpen ? "1rem" : "0",
          }}
        >
          <s-heading>Organization &amp; Settings</s-heading>
          <s-icon type={isOrgOpen ? "chevron-down" : "chevron-up"}></s-icon>
        </div>

        <div style={{ display: isOrgOpen ? "block" : "none" }}>
          <s-stack direction="block" gap="base">
            {/* Time zone and Status */}
            <div>
              <div style={{ marginBottom: "0.5rem" }}>
                <s-text variant="body-md" fontWeight="semibold">Time zone</s-text>
              </div>
              <s-select
                name="timezone"
                label="Time zone"
                label-accessibility-visibility="hidden"
                key={`timezone-${formData?.id || 'new'}`}
                {...(formData?.timezone ? { value: formData.timezone } : { value: "Asia/Dhaka" })}
              >
                <s-option value="Asia/Dhaka">Eastern time (ET)</s-option>
                <s-option value="America/New_York">New York (EST)</s-option>
                <s-option value="America/Los_Angeles">Los Angeles (PST)</s-option>
                <s-option value="Europe/London">London (GMT)</s-option>
                <s-option value="Asia/Tokyo">Tokyo (JST)</s-option>
              </s-select>
              <div style={{ marginTop: "0.25rem" }}>
                <s-text variant="body-sm" color="subdued">
                  Staf member working time zone
                </s-text>
              </div>
            </div>

            <div>
              <div style={{ marginBottom: "0.5rem" }}>
                <s-text variant="body-md" fontWeight="semibold">Status</s-text>
              </div>
              <s-select
                name="status"
                label="Status"
                label-accessibility-visibility="hidden"
                key={`status-${formData?.id || 'new'}`}
                {...(formData?.status ? { value: formData.status } : { value: "active" })}
              >
                <s-option value="active">Active</s-option>
                <s-option value="inactive">Inactive</s-option>
              </s-select>
            </div>

            {/* Menu order */}
            <div>
              <div style={{ marginBottom: "0.5rem" }}>
                <s-text variant="body-md" fontWeight="semibold">Menu order</s-text>
              </div>
              <s-text-field
                name="menuOrderBy"
                type="number"
                label="Menu order"
                label-accessibility-visibility="hidden"
                placeholder="0"
                {...(formData?.menuOrderBy ? { value: String(formData.menuOrderBy) } : { value: "0" })}
              />
              <div style={{ marginTop: "0.25rem" }}>
                <s-text variant="body-sm" color="subdued">
                  Order in staff listings ( lower number appears first)
                </s-text>
              </div>
            </div>
          </s-stack>
        </div>
      </div>

      {/* Locations (Optional) */}
      <s-section heading="Locations (Optional)">
        <div style={{ marginBottom: "0.75rem" }}>
          <s-text variant="body-sm">
            If you want to send booking notifications to two or more emails, enter emails separated by a comma.
          </s-text>
        </div>
        <s-form-field>
          <s-select
            name="locationId"
            label="Location"
            label-accessibility-visibility="hidden"
            key={`location-${formData?.id || 'new'}`}
            {...(formData?.locationId ? { value: String(formData.locationId) } : {})}
          >
            <s-option value="">Select a location</s-option>
            {locations.map((location) => (
              <s-option key={location.id} value={String(location.id)}>
                {location.name}
              </s-option>
            ))}
          </s-select>
        </s-form-field>
      </s-section>

      {/* Staff groups */}
      <s-section heading="Staff groups">
        <div style={{ marginBottom: "0.75rem" }}>
          <s-text variant="body-sm">
            If you want to send booking notifications to two or more emails, enter emails separated by a comma.
          </s-text>
        </div>
        <s-form-field>
          <s-select
            name="staffGroupId"
            label="Staff group"
            label-accessibility-visibility="hidden"
            key={`staffGroup-${formData?.id || 'new'}`}
            {...(formData?.staffGroupId ? { value: String(formData.staffGroupId) } : {})}
          >
            <s-option value="">Select a staff group</s-option>
            {staffGroups.map((group) => (
              <s-option key={group.id} value={String(group.id)}>
                {group.name}
              </s-option>
            ))}
          </s-select>
        </s-form-field>
      </s-section>

      {/* Staff member capacity */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #e1e3e5",
          padding: "1rem",
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsCapacityOpen(!isCapacityOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsCapacityOpen(!isCapacityOpen);
            }
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: isCapacityOpen ? "1rem" : "0",
          }}
        >
          <s-heading>Staff member capacity</s-heading>
          <s-icon type={isCapacityOpen ? "chevron-down" : "chevron-up"}></s-icon>
        </div>

        <div style={{ display: isCapacityOpen ? "block" : "none" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <s-text variant="body-sm">
              Set the maximum number of appointments this staff member can handle per time slot
            </s-text>
          </div>
          <div>
            <div style={{ marginBottom: "0.5rem" }}>
              <s-text variant="body-md" fontWeight="semibold">Maximum concurrent appointments</s-text>
            </div>
            <s-text-field
              name="maxCapacity"
              type="number"
              label="Maximum concurrent appointments"
              label-accessibility-visibility="hidden"
              placeholder="1"
              required
              {...(formData?.maxCapacity ? { value: String(formData.maxCapacity) } : { value: "1" })}
            />
            <div style={{ marginTop: "0.25rem" }}>
              <s-text variant="body-sm" color="subdued">
                To use this, turn on capacity by staff member&apos; in service availability settings
              </s-text>
            </div>
          </div>
        </div>
      </div>

      {/* BlockOut Date & Time (optional) */}
      <s-section heading="BlockOut Date & Time (optional)">
        <div style={{ marginBottom: "0.75rem" }}>
          <s-text variant="body-sm">
            Block bookings for holidays, maintenance, or unavailable times.
          </s-text>
        </div>
        <s-button variant="primary" tone="base">
          Add Block Out Period
        </s-button>
      </s-section>
    </div>
  );
}

// Staff List Item Component
export function StaffListItem({ staff, onEdit, onDelete }) {
  const popoverId = `staff-actions-${staff.id}`;
  const modalId = `delete-modal-${staff.id}`;
  const detailsModalId = `details-modal-${staff.id}`;

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.5fr 1fr 0.8fr 40px",
          gap: "0.5rem",
          padding: "0.75rem 0.5rem",
          alignItems: "center",
        }}
      >
        {/* Staff Member */}
        <div>
          <s-stack direction="inline" gap="xs">
            <div style={{ 
              width: "32px", 
              height: "32px", 
              borderRadius: "50%", 
              backgroundColor: "#ff6a3d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "600",
              fontSize: "14px"
            }}>
              {staff.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div>
                <s-text variant="body-sm" fontWeight="semibold">{staff.name}</s-text>
              </div>
              <div>
                <s-text variant="body-sm" color="subdued">{staff.email || "No email"}</s-text>
              </div>
            </div>
          </s-stack>
        </div>

        {/* Location */}
        <div>
          <s-text variant="body-sm">{staff.location?.name || "-"}</s-text>
        </div>

        {/* Status */}
        <div>
          <s-badge tone={staff.status === "active" ? "success" : "critical"}>
            {staff.status}
          </s-badge>
        </div>

        {/* Bookings */}
        <div>
          <s-text variant="body-sm">0</s-text>
        </div>

        {/* Actions */}
        <div style={{ textAlign: "right" }}>
          <s-button
            variant="tertiary"
            commandFor={popoverId}
            command="--toggle"
          >
            •••
          </s-button>
        </div>
      </div>

      {/* Popover for actions */}
      <s-popover id={popoverId}>
        <s-stack direction="block" gap="xs">
          <div style={{ padding: "0.75rem 0.75rem 0.5rem", fontWeight: "600" }}>
            Actions
          </div>
          <s-button
            variant="tertiary"
            commandFor={detailsModalId}
            command="--show"
            style={{ width: "100%", justifyContent: "flex-start" }}
            icon="text-align-left"
          >
            Details
          </s-button>
          <s-button
            variant="tertiary"
            commandFor={popoverId}
            command="--hide"
            onClick={() => onEdit(staff)}
            style={{ width: "100%", justifyContent: "flex-start" }}
            icon="edit"
          >
            Edit
          </s-button>
          <s-button
            variant="tertiary"
            tone="critical"
            commandFor={modalId}
            command="--show"
            style={{ width: "100%", justifyContent: "flex-start" }}
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
                <s-text variant="body-sm" fontWeight="semibold">Full Name</s-text>
                <s-text variant="body-sm">{staff.name}</s-text>
              </div>
              {staff.email && (
                <div>
                  <s-text variant="body-sm" fontWeight="semibold">Email</s-text>
                  <s-text variant="body-sm">{staff.email}</s-text>
                </div>
              )}
              {staff.phone && (
                <div>
                  <s-text variant="body-sm" fontWeight="semibold">Phone</s-text>
                  <s-text variant="body-sm">{staff.phone}</s-text>
                </div>
              )}
              {staff.bio && (
                <div>
                  <s-text variant="body-sm" fontWeight="semibold">Bio</s-text>
                  <s-text variant="body-sm">{staff.bio}</s-text>
                </div>
              )}
              <div>
                <s-text variant="body-sm" fontWeight="semibold">Status</s-text>
                <s-badge tone={staff.status === "active" ? "success" : "critical"}>
                  {staff.status}
                </s-badge>
              </div>
              {staff.location && (
                <div>
                  <s-text variant="body-sm" fontWeight="semibold">Location</s-text>
                  <s-text variant="body-sm">{staff.location.name}</s-text>
                </div>
              )}
              {staff.staffGroup && (
                <div>
                  <s-text variant="body-sm" fontWeight="semibold">Staff Group</s-text>
                  <s-text variant="body-sm">{staff.staffGroup.name}</s-text>
                </div>
              )}
              <div>
                <s-text variant="body-sm" fontWeight="semibold">Maximum Capacity</s-text>
                <s-text variant="body-sm">{staff.maxCapacity}</s-text>
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
            Are you sure you want to delete &quot;{staff.name}&quot;? This action cannot be undone.
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
          slot="secondary-action"
          commandFor={modalId}
          command="--hide"
        >
          Cancel
        </s-button>
      </s-modal>
    </>
  );
}
