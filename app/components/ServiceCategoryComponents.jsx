/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}

// Service Category Form Component
export function ServiceCategoryForm({ formData }) {
  const [name, setName] = useState(formData?.name || "");
  const [slug, setSlug] = useState(formData?.slug || "");

  // Update form when editing
  useEffect(() => {
    setName(formData?.name || "");
    setSlug(formData?.slug || "");
  }, [formData]);

  // Auto-generate slug from name (only for new categories)
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    
    // Auto-generate slug only if we're creating a new category or if slug is empty
    if (!formData?.id || !slug) {
      const generatedSlug = generateSlug(newName);
      setSlug(generatedSlug);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Category Name Field */}
      <div>
        <div style={{ marginBottom: "0.5rem" }}>
          <s-text variant="body-md" fontWeight="semibold">Category Name</s-text>
        </div>
        <s-text-field
          name="name"
          label="Category Name"
          label-accessibility-visibility="hidden"
          value={name}
          onInput={handleNameChange}
          placeholder=""
          required
        />
        <div style={{ marginTop: "0.25rem" }}>
          <s-text variant="body-sm" color="subdued">
            Enter a descriptive name for this Service category
          </s-text>
        </div>
      </div>

      {/* Slug Field */}
      <div>
        <div style={{ marginBottom: "0.5rem" }}>
          <s-text variant="body-md" fontWeight="semibold">Slug</s-text>
        </div>
        <s-text-field
          name="slug"
          label="Slug"
          label-accessibility-visibility="hidden"
          value={slug}
          onInput={(e) => setSlug(e.target.value)}
          placeholder=""
          required
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
        />
        <div style={{ marginTop: "0.25rem" }}>
          <s-text variant="body-sm" color="subdued">
            URL-friendly Identifier (auto- generated from name)
          </s-text>
        </div>
      </div>
    </div>
  );
}

// Service Category List Item Component
export function ServiceCategoryListItem({ serviceCategory, onEdit, onDelete }) {
  const popoverId = `service-category-actions-${serviceCategory.id}`;
  const modalId = `delete-modal-${serviceCategory.id}`;

  // Placeholder service count (would come from actual services in production)
  const serviceCount = 0;
  const serviceLabel = serviceCount === 1 ? "Service" : "Services";

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 1fr 40px",
          gap: "0.5rem",
          padding: "0.75rem 0.5rem",
          alignItems: "center",
        }}
      >
        {/* Category Name */}
        <div style={{ textAlign: "left" }}>
          <s-text variant="body-sm" fontWeight="semibold">{serviceCategory.name}</s-text>
        </div>

        {/* Slug */}
        <div style={{ textAlign: "left" }}>
          <s-text variant="body-sm" color="subdued">
            {serviceCategory.slug}
          </s-text>
        </div>

        {/* Service Count */}
        <div style={{ textAlign: "left" }}>
          <s-badge tone="success">{`${serviceCount} ${serviceLabel}`}</s-badge>
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
            commandFor={popoverId}
            command="--hide"
            onClick={() => onEdit(serviceCategory)}
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

      {/* Delete confirmation modal */}
      <s-modal id={modalId} heading="Delete service category?">
        <s-stack gap="base">
          <s-text>
            Are you sure you want to delete &quot;{serviceCategory.name}&quot;? This action cannot be undone.
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
    </>
  );
}
