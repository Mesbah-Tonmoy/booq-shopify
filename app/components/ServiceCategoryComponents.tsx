import { useState, useEffect } from 'react';
import type { ServiceCategory } from '@prisma/client';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

interface ServiceCategoryFormProps {
  formData?: Partial<ServiceCategory> | null;
}

// Service Category Form Component
export function ServiceCategoryForm({ formData }: ServiceCategoryFormProps) {
  const [name, setName] = useState(formData?.name || '');
  const [slug, setSlug] = useState(formData?.slug || '');

  // Update form when editing
  useEffect(() => {
    setName(formData?.name || '');
    setSlug(formData?.slug || '');
  }, [formData]);

  // Auto-generate slug from name (only for new categories)
  const handleNameChange = (newName: string) => {
    setName(newName);

    // Auto-generate slug only if we're creating a new category or if slug is empty
    if (!formData?.id || !slug) {
      const generatedSlug = generateSlug(newName);
      setSlug(generatedSlug);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Category Name Field */}
      <s-text-field
        name="name"
        label="Category Name"
        value={name}
        onInput={(e) => handleNameChange(e.currentTarget.value)}
        placeholder=""
        required
        details="Enter a descriptive name for this Service category"
      />

      {/* Slug Field */}
      <s-text-field
        name="slug"
        label="Slug"
        value={slug}
        onInput={(e) => setSlug(e.currentTarget.value)}
        placeholder=""
        required
        details="URL-friendly Identifier (auto- generated from name)"
      />
    </div>
  );
}

export type ServiceCategoryWithCount = ServiceCategory & {
  serviceCount: number;
};

interface ServiceCategoryListItemProps {
  serviceCategory: ServiceCategoryWithCount;
  onEdit: (serviceCategory: ServiceCategoryWithCount) => void;
  onDelete: (id: number) => void;
}

// Service Category List Item Component
export function ServiceCategoryListItem({
  serviceCategory,
  onEdit,
  onDelete,
}: ServiceCategoryListItemProps) {
  const popoverId = `service-category-actions-${serviceCategory.id}`;
  const modalId = `delete-modal-${serviceCategory.id}`;

  const serviceCount = serviceCategory.serviceCount;
  const serviceLabel = serviceCount === 1 ? 'Service' : 'Services';

  return (
    <>
      <s-table-row>
        {/* Category Name */}
        <s-table-cell>
          <s-text>{serviceCategory.name}</s-text>
        </s-table-cell>

        {/* Slug */}
        <s-table-cell>
          <s-text color="subdued">{serviceCategory.slug}</s-text>
        </s-table-cell>

        {/* Service Count */}
        <s-table-cell>
          <s-badge tone="success">{`${serviceCount} ${serviceLabel}`}</s-badge>
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
                commandFor={popoverId}
                command="--hide"
                onClick={() => onEdit(serviceCategory)}
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

          {/* Delete confirmation modal */}
          <s-modal id={modalId} heading="Delete service category?">
            <s-stack gap="base">
              <s-text>
                Are you sure you want to delete &quot;{serviceCategory.name}
                &quot;? This action cannot be undone.
              </s-text>
            </s-stack>
            <s-button
              slot="primary-action"
              variant="primary"
              tone="critical"
              commandFor={modalId}
              command="--hide"
              onClick={() => onDelete(serviceCategory.id)}
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
        </s-table-cell>
      </s-table-row>
    </>
  );
}
