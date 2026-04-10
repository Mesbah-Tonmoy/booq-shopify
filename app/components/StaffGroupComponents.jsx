/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

// Staff Group Form Component
export function StaffGroupForm({ formData }) {
  const [name, setName] = useState(formData?.name || '');
  const [slug, setSlug] = useState(formData?.slug || '');

  // Update form when editing
  useEffect(() => {
    setName(formData?.name || '');
    setSlug(formData?.slug || '');
  }, [formData]);

  // Auto-generate slug from name (only for new groups)
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);

    // Auto-generate slug only if we're creating a new group or if slug is empty
    if (!formData?.id || !slug) {
      const generatedSlug = generateSlug(newName);
      setSlug(generatedSlug);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Group Name Field */}
      <s-form-field label="Group name" required>
        <s-text-field
          name="name"
          label="Group name"
          label-accessibility-visibility="hidden"
          value={name}
          onInput={handleNameChange}
          placeholder="e.g., Senior Stylists"
          required
        />
        <div slot="helper-text" style={{ marginTop: '0.25rem' }}>
          <s-text variant="body-sm" color="subdued">
            Enter a descriptive name for this staff group
          </s-text>
        </div>
      </s-form-field>

      {/* Slug Field */}
      <s-form-field label="Slug" required>
        <s-text-field
          name="slug"
          label="Slug"
          label-accessibility-visibility="hidden"
          value={slug}
          onInput={(e) => setSlug(e.target.value)}
          placeholder="e.g., senior-stylists"
          required
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
        />
        <div slot="helper-text" style={{ marginTop: '0.25rem' }}>
          <s-text variant="body-sm" color="subdued">
            URL-friendly identifier (auto-generated from name)
          </s-text>
        </div>
      </s-form-field>
    </div>
  );
}

// Staff Group List Item Component
export function StaffGroupListItem({ staffGroup, onEdit, onDelete }) {
  const popoverId = `staff-group-actions-${staffGroup.id}`;
  const modalId = `delete-modal-${staffGroup.id}`;

  const staffCount = staffGroup._count?.staffs || 0;
  const serviceLabel = staffCount === 1 ? 'Service' : 'Services';

  return (
    <>
      <s-table-row>
        {/* Category Name */}
        <s-table-cell>
          <s-text variant="body-sm" fontWeight="semibold">
            {staffGroup.name}
          </s-text>
        </s-table-cell>

        {/* Slug */}
        <s-table-cell>
          <s-text variant="body-sm" color="subdued">
            {staffGroup.slug}
          </s-text>
        </s-table-cell>

        {/* Service Count */}
        <s-table-cell>
          <s-badge tone="info">{`${staffCount} ${serviceLabel}`}</s-badge>
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
            <s-stack direction="block">
              <s-button
                variant="tertiary"
                commandFor={popoverId}
                command="--hide"
                onClick={() => onEdit(staffGroup)}
                icon="edit"
              >
                Edit
              </s-button>
              <s-button
                variant="tertiary"
                tone="critical"
                commandFor={modalId}
                command="--show"
                icon="delete"
              >
                Delete
              </s-button>
            </s-stack>
          </s-popover>

          {/* Delete confirmation modal */}
          <s-modal id={modalId} heading="Delete staff group?">
            <s-stack gap="base">
              <s-text>
                Are you sure you want to delete &quot;{staffGroup.name}&quot;?
                This action cannot be undone.
              </s-text>
            </s-stack>
            <s-button
              slot="primary-action"
              variant="primary"
              tone="critical"
              commandFor={modalId}
              command="--hide"
              onClick={() => onDelete(staffGroup.id)}
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
