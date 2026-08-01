import { useState } from 'react';
import { useNavigate } from 'react-router';
import type {
  ClearErrorFn,
  FormErrors,
  ServiceFormData,
  StaffOption,
} from './types';

interface StaffMembersSectionProps {
  formData?: ServiceFormData;
  staffMembers: StaffOption[];
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Staff Members Section Component
export function StaffMembersSection({
  formData,
  staffMembers,
}: StaffMembersSectionProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<number[]>(
    formData?.selectedStaff || []
  );
  const [hideStaffSelection, setHideStaffSelection] = useState(
    formData?.hideStaffSelection || false
  );
  const [showStaffPanel, setShowStaffPanel] = useState(false);

  const toggleStaffInPanel = (staffId: number) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter((id) => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  const removeStaff = (staffId: number, e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setSelectedStaff(selectedStaff.filter((id) => id !== staffId));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const selectedStaffObjects = staffMembers.filter((staff) =>
    selectedStaff.includes(staff.id)
  );

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        paddingBlockEnd={isOpen ? 'small-300' : ''}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Staff Members (Optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-button onClick={() => navigate('/app/staff')}>
            Create Staff Member
            <s-icon type="arrow-right"></s-icon>
          </s-button>
          <s-icon
            type={isOpen ? 'chevron-down' : 'chevron-up'}
            onClick={() => setIsOpen(!isOpen)}
            style={{ cursor: 'pointer' }}
          ></s-icon>
        </s-stack>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Staff members added here will appear to customers as part of the
            booking process. Useful for services with more than one staff.
          </s-text>

          {/* Display selected staff */}
          {selectedStaffObjects.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {selectedStaffObjects.map((staff) => (
                <div
                  key={staff.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    border: '2px solid #005BD3',
                    borderRadius: '8px',
                    backgroundColor: '#f6f8fa',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}
                  >
                    {getInitials(staff.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <s-text type="strong">{staff.name}</s-text>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <s-button
                      variant="tertiary"
                      icon="edit"
                      onClick={() =>
                        (window.location.href = `/app/staff/${staff.id}`)
                      }
                    />
                    <s-button
                      variant="tertiary"
                      icon="delete"
                      tone="critical"
                      onClick={(e) => removeStaff(staff.id, e)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <s-button onClick={() => setShowStaffPanel(true)}>
            Add Staff Member
          </s-button>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
            }}
          >
            <input
              type="checkbox"
              checked={hideStaffSelection}
              onChange={(e) => setHideStaffSelection(e.target.checked)}
            />
            <s-text>
              Hide staff selection in booking widget, When there's only one
              option.
            </s-text>
          </label>

          <input
            type="hidden"
            name="selectedStaff"
            value={JSON.stringify(selectedStaff)}
          />
          <input
            type="hidden"
            name="hideStaffSelection"
            value={String(hideStaffSelection)}
          />
        </s-stack>
      )}

      {/* Staff Selection Panel */}
      {showStaffPanel && (
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
          onClick={() => setShowStaffPanel(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
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
                Select Staff Members
              </s-text>
              <s-button
                variant="tertiary"
                icon="x"
                onClick={() => setShowStaffPanel(false)}
              />
            </div>
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {staffMembers.length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  {staffMembers.map((staff) => {
                    const isSelected = selectedStaff.includes(staff.id);
                    return (
                      <div
                        key={staff.id}
                        onClick={() => toggleStaffInPanel(staff.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.75rem',
                          border: isSelected
                            ? '2px solid #005BD3'
                            : '1px solid #e1e3e5',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#f6f8fa' : 'white',
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background:
                              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '16px',
                          }}
                        >
                          {getInitials(staff.name)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <s-text type="strong">{staff.name}</s-text>
                        </div>
                        {isSelected && (
                          <s-icon
                            type="check-circle"
                            style={{ color: '#005BD3' }}
                          ></s-icon>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <s-text color="subdued">
                    No staff members available. Create one first.
                  </s-text>
                </div>
              )}
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
              <s-button onClick={() => setShowStaffPanel(false)}>
                Cancel
              </s-button>
              <s-button
                variant="primary"
                onClick={() => setShowStaffPanel(false)}
              >
                Done
              </s-button>
            </div>
          </div>
        </div>
      )}
    </s-section>
  );
}
