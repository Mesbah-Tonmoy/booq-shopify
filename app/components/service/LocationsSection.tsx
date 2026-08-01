import { useState } from 'react';
import { useNavigate } from 'react-router';
import type {
  ClearErrorFn,
  FormErrors,
  LocationOption,
  ServiceFormData,
} from './types';

interface LocationsSectionProps {
  formData?: ServiceFormData;
  locations: LocationOption[];
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Locations Section Component
export function LocationsSection({
  formData,
  locations,
}: LocationsSectionProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedLocations, setSelectedLocations] = useState<number[]>(
    formData?.selectedLocations || []
  );
  const [hideLocationSelection, setHideLocationSelection] = useState(
    formData?.hideLocationSelection || false
  );
  const [showLocationPanel, setShowLocationPanel] = useState(false);

  const toggleLocationInPanel = (locationId: number) => {
    if (selectedLocations.includes(locationId)) {
      setSelectedLocations(selectedLocations.filter((id) => id !== locationId));
    } else {
      setSelectedLocations([...selectedLocations, locationId]);
    }
  };

  const removeLocation = (
    locationId: number,
    e: { stopPropagation: () => void }
  ) => {
    e.stopPropagation();
    setSelectedLocations(selectedLocations.filter((id) => id !== locationId));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const selectedLocationObjects = locations.filter((loc) =>
    selectedLocations.includes(loc.id)
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
          <s-heading>Locations (Optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-button onClick={() => navigate('/app/location')}>
            Create Location
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
            Locations added here will be shown to customers during booking.
            Useful for multi-branch business or on-site services
          </s-text>

          {/* Display selected locations */}
          {selectedLocationObjects.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {selectedLocationObjects.map((location) => (
                <div
                  key={location.id}
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
                    {getInitials(location.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <s-text type="strong">{location.name}</s-text>
                    {location.address && (
                      <s-text color="subdued" style={{ display: 'block' }}>
                        {typeof location.address === 'string'
                          ? location.address
                          : location.address?.street || 'No address provided'}
                      </s-text>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <s-button
                      variant="tertiary"
                      icon="edit"
                      onClick={() =>
                        (window.location.href = `/app/location/${location.id}`)
                      }
                    />
                    <s-button
                      variant="tertiary"
                      icon="delete"
                      tone="critical"
                      onClick={(e) => removeLocation(location.id, e)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <s-button onClick={() => setShowLocationPanel(true)}>
            Add Location
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
              checked={hideLocationSelection}
              onChange={(e) => setHideLocationSelection(e.target.checked)}
            />
            <s-text>
              Hide location selection in booking widget, When there's only one
              option.
            </s-text>
          </label>

          <input
            type="hidden"
            name="selectedLocations"
            value={JSON.stringify(selectedLocations)}
          />
          <input
            type="hidden"
            name="hideLocationSelection"
            value={String(hideLocationSelection)}
          />
        </s-stack>
      )}

      {/* Location Selection Panel */}
      {showLocationPanel && (
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
          onClick={() => setShowLocationPanel(false)}
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
                Select Locations
              </s-text>
              <s-button
                variant="tertiary"
                icon="x"
                onClick={() => setShowLocationPanel(false)}
              />
            </div>
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {locations.length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  {locations.map((location) => {
                    const isSelected = selectedLocations.includes(location.id);
                    return (
                      <div
                        key={location.id}
                        onClick={() => toggleLocationInPanel(location.id)}
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
                          {getInitials(location.name)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <s-text type="strong">{location.name}</s-text>
                          {location.address && (
                            <s-text
                              color="subdued"
                              style={{ display: 'block' }}
                            >
                              {typeof location.address === 'string'
                                ? location.address
                                : location.address?.street ||
                                  'No address provided'}
                            </s-text>
                          )}
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
                    No locations available. Create one first.
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
              <s-button onClick={() => setShowLocationPanel(false)}>
                Cancel
              </s-button>
              <s-button
                variant="primary"
                onClick={() => setShowLocationPanel(false)}
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
