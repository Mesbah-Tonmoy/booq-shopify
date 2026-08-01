import { useEffect, useState } from 'react';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useNavigate,
} from 'react-router';
import { useAppBridge } from '@shopify/app-bridge-react';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { authenticate } from '../shopify.server';
import prisma from '../db.server';
import { getInt, getJSON, getString } from '../utils/formData';
import {
  ProductSelectionSection,
  SlotConfigurationSection,
  CapacitySetup,
  OthersTabContent,
  LocationStaffTabContent,
  ReviewPublishTabContent,
  type FormErrors,
  type LocationOption,
} from '../components/service';
import type { Route } from './+types/app.service.new';

// Loader - Load locations and staff
export const loader = async ({ request }: Route.LoaderArgs) => {
  const { session } = await authenticate.admin(request);

  // Get shop
  const shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    throw new Error('Shop not found');
  }

  // Load locations and staff
  const locations = await prisma.location.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
  });

  const staffMembers = await prisma.staff.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
  });

  // Load service categories
  const serviceCategories = await prisma.serviceCategory.findMany({
    where: { shopId: shop.id },
    orderBy: { name: 'asc' },
  });

  return { locations, staffMembers, serviceCategories };
};

// Action - Handle service creation
export const action = async ({ request }: Route.ActionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  // Get shop
  const shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    return { error: 'Shop not found' };
  }

  // CREATE service
  const name = getString(formData, 'name');
  const category = getString(formData, 'category');
  const timezone = getString(formData, 'timezone') || 'Eastern time (ET)';
  const serviceType = getString(formData, 'serviceType') || 'regular';
  const shopifyProductId = getString(formData, 'shopifyProductId');
  const shopifyVariantIds = getJSON<string[]>(formData, 'shopifyVariantIds');
  const minDays = getInt(formData, 'minDays');
  const maxDays = getInt(formData, 'maxDays');
  const multiDayBooking = getString(formData, 'multiDayBooking');
  const allowedDays = getJSON<string[]>(formData, 'allowedDays');
  const capacity = getInt(formData, 'capacity');

  // Parse JSON fields
  const bundleBooking = getJSON(formData, 'bundleBooking');
  const cancelBooking = getJSON(formData, 'cancelBooking');
  const paymentPreferences = getJSON(formData, 'paymentPreferences');
  const customerFields = getJSON(formData, 'customerFields');
  const selectedLocations = getJSON<number[]>(formData, 'selectedLocations');
  const selectedStaff = getJSON<number[]>(formData, 'selectedStaff');
  const locationType = getString(formData, 'locationType');

  // Parse "Others" tab fields
  const minimumAdvancedNotice = getInt(formData, 'minimumAdvancedNotice');
  const minimumAdvancedNoticeUnit = getString(
    formData,
    'minimumAdvancedNoticeUnit'
  );
  const serviceVisibilityDays = getInt(formData, 'serviceVisibilityDays');
  const maxProductQuantities = getInt(formData, 'maxProductQuantities');
  const notificationEmail = getString(formData, 'notificationEmail');
  const allowReschedule = getString(formData, 'allowReschedule') === 'true';
  const hideLocationSelection =
    getString(formData, 'hideLocationSelection') === 'true';
  const hideStaffSelection =
    getString(formData, 'hideStaffSelection') === 'true';

  // Validate required fields
  if (!name || name.trim() === '') {
    return { error: 'Service name is required' };
  }

  const serviceData = {
    name: name.trim(),
    category: category || null,
    timezone,
    serviceType,
    shopifyProductId: shopifyProductId || null,
    shopifyVariantIds: shopifyVariantIds ?? undefined,
    minDays,
    maxDays,
    multiDayBooking,
    allowedDays: allowedDays ?? undefined,
    capacity,
    bundleBooking: bundleBooking ?? undefined,
    cancelBooking: cancelBooking ?? undefined,
    paymentPreferences: paymentPreferences ?? undefined,
    customerFields: customerFields ?? undefined,
    selectedLocations: selectedLocations ?? undefined,
    selectedStaff: selectedStaff ?? undefined,
    locationType,
    minimumAdvancedNotice,
    minimumAdvancedNoticeUnit,
    serviceVisibilityDays,
    maxProductQuantities,
    notificationEmail: notificationEmail || null,
    allowReschedule,
    hideLocationSelection,
    hideStaffSelection,
    shopId: shop.id,
  };

  const newService = await prisma.service.create({
    data: serviceData,
  });

  // Handle slot configuration - save to Slots table
  const slotConfiguration = getJSON(formData, 'slotConfiguration');
  if (slotConfiguration) {
    await prisma.slots.create({
      data: {
        serviceId: newService.id,
        slotConfiguration,
      },
    });
  }

  return { success: true, message: 'Service created successfully' };
};

export default function NewServicePage() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const shopify = useAppBridge();

  // Location.address is stored as Prisma JsonValue; the service form components
  // narrow it at render time, so this cast just aligns the static shape.
  const locationOptions = (loaderData?.locations ||
    []) as unknown as LocationOption[];

  const [selectedTab, setSelectedTab] = useState(0);
  const [formKey] = useState(0);
  const [currentServiceType, setCurrentServiceType] = useState('regular');
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});

  const isSubmitting = navigation.state === 'submitting';

  // Show toast notification on success and redirect
  useEffect(() => {
    if (actionData && 'success' in actionData && actionData.success) {
      if (actionData.message) shopify.toast.show(actionData.message);
      navigate('/app/service');
    }
    if (actionData && 'error' in actionData && actionData.error) {
      shopify.toast.show(actionData.error, { isError: true });
    }
  }, [actionData, shopify, navigate]);

  const handleSubmit = () => {
    const form = document.getElementById(
      'service-form'
    ) as HTMLFormElement | null;
    if (form) {
      if (form.checkValidity()) {
        form.requestSubmit();
      } else {
        form.reportValidity();
      }
    }
  };

  // Clear specific error
  const clearError = (fieldName: string) => {
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Listen to service type changes and clear errors
  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const target = e.target as unknown as HTMLInputElement;
    const { name } = target;
    if (name) clearError(name);

    if (name === 'serviceTypeRadio') {
      const value = target.value;
      setCurrentServiceType(value);
      clearError('serviceType');
    }
  };

  // Validate current step
  const validateStep = (step: number): FormErrors => {
    const form = document.getElementById(
      'service-form'
    ) as HTMLFormElement | null;
    const errors: FormErrors = {};
    if (!form) return errors;

    const getFieldValue = (selector: string) =>
      (form.querySelector(selector) as HTMLInputElement | null)?.value;

    if (step === 0) {
      // Step 1: Product/Slot configuration
      const serviceName = getFieldValue('[name="name"]');
      if (!serviceName || serviceName.trim() === '') {
        errors.name = 'Service name is required';
      }

      const productId = getFieldValue('[name="shopifyProductId"]');
      if (!productId) {
        errors.shopifyProductId = 'Product link is required';
      }

      const serviceType = getFieldValue('input[name="serviceType"]');
      if (!serviceType) {
        errors.serviceType = 'Service type is required';
      }

      const slotConfiguration = getFieldValue('[name="slotConfiguration"]');
      if (!slotConfiguration || slotConfiguration === '{}') {
        errors.slotConfiguration = 'Slot configuration is required';
      }
    } else if (step === 1) {
      // Step 2: Location & Staff
      const locationType = getFieldValue('[name="locationType"]');
      if (!locationType) {
        errors.locationType = 'Location type is required';
      }
    } else if (step === 2) {
      // Step 3: Others
      const paymentPreferences = getFieldValue('[name="paymentPreferences"]');
      if (!paymentPreferences) {
        errors.paymentPreferences = 'Payment preference is required';
      }
    }

    return errors;
  };

  // Handle next button
  const handleNext = () => {
    const errors = validateStep(selectedTab);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      shopify.toast.show(Object.values(errors).join(', '), { isError: true });
      return;
    }
    setValidationErrors({});
    setSelectedTab(selectedTab + 1);
  };

  // Handle previous button
  const handlePrevious = () => {
    setValidationErrors({});
    setSelectedTab(selectedTab - 1);
  };

  // Handle step click (with validation)
  const handleStepClick = (targetStep: number) => {
    // If going backwards, allow without validation
    if (targetStep < selectedTab) {
      setValidationErrors({});
      setSelectedTab(targetStep);
      return;
    }

    // If going forward, validate all steps in between
    for (let step = selectedTab; step < targetStep; step++) {
      const errors = validateStep(step);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        shopify.toast.show(
          `Please complete Step ${step + 1}: ${Object.values(errors).join(
            ', '
          )}`,
          { isError: true }
        );
        return;
      }
    }

    // All validations passed
    setValidationErrors({});
    setSelectedTab(targetStep);
  };

  const tabs = [
    'Product/Slot configuration',
    'Location & Staff Member',
    'Others',
    'Review & Publish',
  ];

  return (
    <s-page heading="Add New Service">
      <br />
      <s-stack gap="base base">
        {/* Tabs Navigation */}
        <s-section padding="none">
          <s-box padding="small">
            {tabs.map((tab, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleStepClick(index)}
                style={{
                  padding: '0.5rem 1rem',
                  background: selectedTab === index ? '#E3E3E3' : 'transparent',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#303030',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                {tab}
              </button>
            ))}
          </s-box>
        </s-section>

        <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
          <s-grid-item gridColumn="span 7" gridRow="span 1">
            <Form
              method="post"
              id="service-form"
              key={formKey}
              onChange={handleFormChange}
            >
              <input type="hidden" name="serviceId" value="new" />

              <s-stack gap="base">
                {/* Tab 0: Product/Slot Configuration */}
                <div
                  style={{
                    display: selectedTab === 0 ? 'block' : 'none',
                  }}
                >
                  <s-stack direction="block" gap="large">
                    {/* Product Selection Section */}
                    <ProductSelectionSection
                      formData={undefined}
                      serviceCategories={loaderData?.serviceCategories || []}
                      errors={validationErrors}
                      clearError={clearError}
                    />

                    {/* Slot Configuration Section */}
                    <SlotConfigurationSection
                      formData={undefined}
                      currentServiceType={currentServiceType}
                      errors={validationErrors}
                      clearError={clearError}
                    />

                    {/* Capacity Setup */}
                    <CapacitySetup
                      formData={undefined}
                      errors={validationErrors}
                      clearError={clearError}
                    />
                  </s-stack>
                </div>

                {/* Tab 1: Location & Staff Member */}
                <div
                  style={{
                    display: selectedTab === 1 ? 'block' : 'none',
                  }}
                >
                  <LocationStaffTabContent
                    formData={undefined}
                    locations={locationOptions}
                    staffMembers={loaderData?.staffMembers || []}
                    errors={validationErrors}
                    clearError={clearError}
                  />
                </div>

                {/* Tab 2: Others */}
                <div
                  style={{
                    display: selectedTab === 2 ? 'block' : 'none',
                  }}
                >
                  <OthersTabContent
                    formData={undefined}
                    errors={validationErrors}
                    clearError={clearError}
                  />
                </div>

                {/* Tab 3: Review & Publish */}
                <div
                  style={{
                    display: selectedTab === 3 ? 'block' : 'none',
                  }}
                >
                  <ReviewPublishTabContent
                    formData={undefined}
                    locations={locationOptions}
                    staffMembers={loaderData?.staffMembers || []}
                    onTabChange={setSelectedTab}
                    errors={validationErrors}
                    clearError={clearError}
                  />
                </div>

                {/* Navigation Buttons */}
                <s-section>
                  <s-stack direction="inline" alignItems="end">
                    {selectedTab > 0 && (
                      <s-button onClick={handlePrevious}>
                        <s-icon type="arrow-left"></s-icon>
                        Previous
                      </s-button>
                    )}
                    {selectedTab < 3 ? (
                      <s-button variant="primary" onClick={handleNext}>
                        Next
                      </s-button>
                    ) : (
                      <s-button
                        variant="primary"
                        onClick={handleSubmit}
                        {...(isSubmitting ? { loading: true } : {})}
                      >
                        Save Service
                      </s-button>
                    )}
                  </s-stack>
                </s-section>
              </s-stack>
            </Form>
          </s-grid-item>
          <s-grid-item gridColumn="span 5" gridRow="span 2">
            <s-section>
              <s-text>Half width field</s-text>
            </s-section>
          </s-grid-item>
        </s-grid>
      </s-stack>
    </s-page>
  );
}

export const headers: Route.HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
