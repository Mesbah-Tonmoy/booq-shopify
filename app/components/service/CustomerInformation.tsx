import { useState } from 'react';
import type {
  ClearErrorFn,
  CustomerField,
  FormErrors,
  ServiceFormData,
} from './types';

interface CustomerInformationProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

const DEFAULT_FIELDS: CustomerField[] = [
  {
    id: 1,
    name: 'firstName',
    label: 'First name',
    type: 'text',
    required: true,
    visible: true,
  },
  {
    id: 2,
    name: 'lastName',
    label: 'Last name',
    type: 'text',
    required: true,
    visible: true,
  },
  {
    id: 3,
    name: 'phone',
    label: 'Phone No',
    type: 'tel',
    required: true,
    visible: true,
  },
  {
    id: 4,
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    visible: true,
  },
];

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
];

// Customer Information Component
export function CustomerInformation({ formData }: CustomerInformationProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [fields, setFields] = useState<CustomerField[]>(
    formData?.customerFields || DEFAULT_FIELDS
  );
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState<CustomerField | null>(null);
  const [modalFieldName, setModalFieldName] = useState('');
  const [modalFieldType, setModalFieldType] = useState('text');

  const toggleFieldSetting = (
    fieldId: number,
    setting: keyof CustomerField
  ) => {
    setFields(
      fields.map((field) =>
        field.id === fieldId ? { ...field, [setting]: !field[setting] } : field
      )
    );
  };

  const handleEditField = (field: CustomerField) => {
    setEditingField(field);
    setModalFieldName(field.label);
    setModalFieldType(field.type);
    setShowModal(true);
  };

  const handleAddField = () => {
    setEditingField(null);
    setModalFieldName('');
    setModalFieldType('text');
    setShowModal(true);
  };

  const handleSaveField = () => {
    if (!modalFieldName.trim()) {
      return;
    }

    if (editingField) {
      // Update existing field
      setFields(
        fields.map((field) =>
          field.id === editingField.id
            ? { ...field, label: modalFieldName, type: modalFieldType }
            : field
        )
      );
    } else {
      // Add new field
      const newField: CustomerField = {
        id: Date.now(),
        name: modalFieldName.toLowerCase().replace(/\s+/g, '_'),
        label: modalFieldName,
        type: modalFieldType,
        required: false,
        visible: true,
      };
      setFields([...fields, newField]);
    }

    setShowModal(false);
    setEditingField(null);
  };

  const handleDeleteField = (fieldId: number) => {
    if (confirm('Are you sure you want to delete this field?')) {
      setFields(fields.filter((field) => field.id !== fieldId));
    }
  };

  const getFieldTypeLabel = (type: string) => {
    const fieldType = FIELD_TYPES.find((ft) => ft.value === type);
    return fieldType ? fieldType.label : type;
  };

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        className="cursor-pointer"
        paddingBlockEnd={isOpen ? 'small-300' : ''}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Customer information</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Collect customer information during the booking process.
          </s-text>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {fields.map((field) => (
              <div
                key={field.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  border: '1px solid #e1e3e5',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <s-text type="strong">{field.label}</s-text>
                  <s-text
                    color="subdued"
                    style={{ display: 'block', marginTop: '0.25rem' }}
                  >
                    {getFieldTypeLabel(field.type)}
                  </s-text>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <s-button
                    variant="tertiary"
                    icon="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditField(field);
                    }}
                  />
                  <s-button
                    variant="tertiary"
                    icon={field.visible ? 'view' : 'hide'}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFieldSetting(field.id, 'visible');
                    }}
                  />
                  <s-button
                    variant="tertiary"
                    icon="delete"
                    tone="critical"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteField(field.id);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <s-button style={{ marginTop: '0.5rem' }} onClick={handleAddField}>
            Add Additional Fields
          </s-button>

          <input
            type="hidden"
            name="customerFields"
            value={JSON.stringify(fields)}
          />
        </s-stack>
      )}

      {/* Modal for Edit/Add Field */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e1e3e5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <s-text type="strong" style={{ fontSize: '18px' }}>
                {editingField ? 'Edit Field' : 'Add Field'}
              </s-text>
              <s-button
                variant="tertiary"
                icon="x"
                onClick={() => setShowModal(false)}
              />
            </div>
            <div style={{ padding: '1.5rem' }}>
              <s-stack gap="base">
                <div>
                  <s-text style={{ marginBottom: '0.5rem', display: 'block' }}>
                    Field Name
                  </s-text>
                  <s-text-field
                    value={modalFieldName}
                    onChange={(e) => setModalFieldName(e.currentTarget.value)}
                    placeholder="Enter field name"
                  />
                </div>

                <div>
                  <s-text style={{ marginBottom: '0.5rem', display: 'block' }}>
                    Field Type
                  </s-text>
                  <s-select
                    value={modalFieldType}
                    onChange={(e) => setModalFieldType(e.currentTarget.value)}
                  >
                    {FIELD_TYPES.map((type) => (
                      <s-option key={type.value} value={type.value}>
                        {type.label}
                      </s-option>
                    ))}
                  </s-select>
                </div>
              </s-stack>
            </div>
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #e1e3e5',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem',
              }}
            >
              <s-button onClick={() => setShowModal(false)}>Cancel</s-button>
              <s-button variant="primary" onClick={handleSaveField}>
                Save
              </s-button>
            </div>
          </div>
        </div>
      )}
    </s-section>
  );
}
