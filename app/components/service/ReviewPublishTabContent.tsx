import { useEffect, useState } from 'react';
import type {
  ClearErrorFn,
  FormErrors,
  LocationOption,
  ServiceFormData,
  StaffOption,
} from './types';

interface ReviewPublishTabContentProps {
  formData?: ServiceFormData;
  locations?: LocationOption[];
  staffMembers?: StaffOption[];
  onTabChange?: (tab: number) => void;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

interface LiveFormData {
  name: string;
  category: string;
  serviceType: string;
  basePrice: string;
  paymentType: string;
  locationType: string;
}

export function ReviewPublishTabContent({
  formData,
  onTabChange,
}: ReviewPublishTabContentProps) {
  const [liveFormData, setLiveFormData] = useState<LiveFormData>({
    name: '',
    category: '',
    serviceType: '',
    basePrice: '0.00',
    paymentType: '',
    locationType: '',
  });

  // Read form values in real-time for new services (when formData is null)
  useEffect(() => {
    const form = document.getElementById(
      'service-form'
    ) as HTMLFormElement | null;
    if (!form) return;

    const getFieldValue = (name: string) =>
      (form.querySelector(`[name="${name}"]`) as HTMLInputElement | null)
        ?.value || '';

    const updateLiveData = () => {
      const name = getFieldValue('name');
      const category = getFieldValue('category');
      const serviceType = getFieldValue('serviceType');
      const locationType = getFieldValue('locationType');

      // Get price from selected product variants
      const variantIdsInput = getFieldValue('shopifyVariantIds');
      let basePrice = '0.00';
      if (variantIdsInput) {
        try {
          JSON.parse(variantIdsInput);
          // Get the first variant's price from the product data
          const productDataInput = form.querySelector(
            '[name="productData"]'
          ) as HTMLInputElement | null;
          if (productDataInput) {
            const productData = JSON.parse(productDataInput.value);
            const firstVariant = productData.variants?.[0];
            if (firstVariant) {
              basePrice = firstVariant.price;
            }
          }
        } catch {
          // Ignore parse errors
        }
      }

      // Get payment type from paymentPreferences JSON
      const paymentPrefsInput = getFieldValue('paymentPreferences');
      let paymentType = '';
      if (paymentPrefsInput) {
        try {
          const paymentPrefs = JSON.parse(paymentPrefsInput);
          paymentType = paymentPrefs.type || '';
        } catch {
          // Ignore parse errors
        }
      }

      setLiveFormData({
        name,
        category,
        serviceType,
        basePrice,
        paymentType,
        locationType,
      });
    };

    // Update on form changes
    form.addEventListener('input', updateLiveData);
    form.addEventListener('change', updateLiveData);

    // Initial update
    updateLiveData();

    return () => {
      form.removeEventListener('input', updateLiveData);
      form.removeEventListener('change', updateLiveData);
    };
  }, []);

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'regular':
        return 'Regular';
      case 'full-day':
        return 'Full-Day';
      case 'multi-day':
        return 'Multi-Day';
      default:
        return 'Standalone Service';
    }
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'fullPayment':
        return 'Full Payment';
      case 'bookNowPayLater':
        return 'Book Now, Pay Later';
      default:
        return 'Book Now, Pay Later';
    }
  };

  // Get lead time formatted
  const getLeadTime = () => {
    const notice = formData?.minimumAdvancedNotice || 0;
    const unit = formData?.minimumAdvancedNoticeUnit || 'Hours';
    if (notice === 0) return 'No lead time';
    return `${notice} ${unit.toLowerCase()}`;
  };

  // Get visibility
  const getVisibility = () => {
    const days = formData?.serviceVisibilityDays || 60;
    return `${days} days ahead`;
  };

  // Get cancellation status
  const getCancellation = () => {
    if (formData?.cancelBooking?.allowed) {
      const cutoff = formData.cancelBooking.cutoffTime || '24';
      const unit = formData.cancelBooking.cutoffUnit === 'Days' ? 'h' : 'h';
      return { allowed: true, label: `Allowed (${cutoff}${unit} cutoff)` };
    }
    return { allowed: false, label: 'Not allowed' };
  };

  // Get rescheduling status
  const getRescheduling = () => {
    if (formData?.allowReschedule) {
      return { allowed: true, label: 'Allowed (24h cutoff)' };
    }
    return { allowed: false, label: 'Not allowed' };
  };

  // Get selected locations count
  const selectedLocations = formData?.selectedLocations || [];
  const hideLocationSelection = formData?.hideLocationSelection || false;

  // Get selected staff count
  const selectedStaff = formData?.selectedStaff || [];
  const hideStaffSelection = formData?.hideStaffSelection || false;

  // Get customer fields count
  const customerFields = formData?.customerFields || [];
  const customerFieldsCount = customerFields.length;

  const cancellationData = getCancellation();
  const reschedulingData = getRescheduling();

  return (
    <s-stack direction="block" gap="large">
      <div>
        <s-text style={{ marginBottom: '0.5rem', display: 'block' }}>
          Review & Publish
        </s-text>
        <s-text color="subdued">
          Review every section and make sure everything looks good before
          publishing your service.
        </s-text>
      </div>

      {/* Service Overview */}
      <s-box
        padding="base"
        border="base"
        borderRadius="base"
        style={{ backgroundColor: 'white' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <s-text>Service overview</s-text>
          <s-button icon="edit" onClick={() => onTabChange && onTabChange(0)}>
            Edit
          </s-button>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {/* Service Name */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Service name :</s-text>
            <s-text type="strong">
              {formData?.name || liveFormData.name || 'Service name'}
            </s-text>
          </div>

          {/* Category */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Category :</s-text>
            <s-text type="strong">
              {formData?.category || liveFormData.category || 'No category'}
            </s-text>
          </div>

          {/* Service Type */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Service type :</s-text>
            <s-text type="strong">
              {getServiceTypeLabel(
                formData?.serviceType || liveFormData.serviceType
              )}
            </s-text>
          </div>

          {/* Status */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Status :</s-text>
            <s-badge tone={formData?.id ? 'success' : 'info'}>
              {formData?.id ? 'Active and Bookable' : 'Not yet published'}
            </s-badge>
          </div>

          {/* Base Price */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Base Price :</s-text>
            <s-text type="strong">
              $
              {(() => {
                // For edit mode, get price from productData
                if (formData?.productData?.variants?.[0]) {
                  return formData.productData.variants[0].price;
                }
                // For new service, use live form data
                return liveFormData.basePrice || '0.00';
              })()}
            </s-text>
          </div>

          {/* Payment Status */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Payment :</s-text>
            <s-badge tone="warning">
              {getPaymentTypeLabel(
                formData?.paymentPreferences?.type || liveFormData.paymentType
              )}
            </s-badge>
          </div>
        </div>
      </s-box>

      {/* Location & Staff Members */}
      <s-box
        padding="base"
        border="base"
        borderRadius="base"
        style={{ backgroundColor: 'white' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <s-text>Location & Staff Members</s-text>
          <s-button icon="edit" onClick={() => onTabChange && onTabChange(1)}>
            Edit
          </s-button>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {/* Location Type */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Location Type :</s-text>
            <s-text type="strong">
              {(() => {
                const locType =
                  formData?.locationType || liveFormData.locationType;
                return locType
                  ? locType.charAt(0).toUpperCase() + locType.slice(1)
                  : 'Not set';
              })()}
            </s-text>
          </div>

          {/* Locations */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Locations :</s-text>
            <s-text type="strong">
              {selectedLocations.length > 0
                ? `${selectedLocations.length} assigned ${hideLocationSelection ? '(hidden from customer)' : ''}`
                : 'None assigned'}
            </s-text>
          </div>

          {/* Staff Members */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Staff Member :</s-text>
            <s-text type="strong">
              {selectedStaff.length > 0
                ? `${selectedStaff.length} assigned ${hideStaffSelection ? '(hidden from customer)' : ''}`
                : 'None assigned'}
            </s-text>
          </div>

          {/* Customer Fields */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Customer Fields :</s-text>
            <s-text type="strong">{customerFieldsCount} configured</s-text>
          </div>
        </div>
      </s-box>

      {/* Other Settings */}
      <s-box
        padding="base"
        border="base"
        borderRadius="base"
        style={{ backgroundColor: 'white' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <s-text>Other Settings</s-text>
          <s-button icon="edit" onClick={() => onTabChange && onTabChange(2)}>
            Edit
          </s-button>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {/* Lead Time */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Lead Time :</s-text>
            <s-text type="strong">{getLeadTime()}</s-text>
          </div>

          {/* Visibility */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Visibility :</s-text>
            <s-text type="strong">{getVisibility()}</s-text>
          </div>

          {/* Cancellation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Cancellation :</s-text>
            <s-badge tone={cancellationData.allowed ? 'success' : 'critical'}>
              {cancellationData.label}
            </s-badge>
          </div>

          {/* Rescheduling */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <s-text color="subdued">Rescheduling :</s-text>
            <s-badge tone={reschedulingData.allowed ? 'success' : 'critical'}>
              {reschedulingData.label}
            </s-badge>
          </div>

          {/* Capacity */}
          {formData?.capacity && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <s-text color="subdued">Max Capacity :</s-text>
              <s-text type="strong">
                {formData.capacity} bookings per slot
              </s-text>
            </div>
          )}

          {/* Notification Email */}
          {formData?.notificationEmail && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <s-text color="subdued">Notification Email :</s-text>
              <s-text type="strong">{formData.notificationEmail}</s-text>
            </div>
          )}
        </div>
      </s-box>
    </s-stack>
  );
}
