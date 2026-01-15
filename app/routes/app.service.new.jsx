import { useEffect, useState } from "react";
import { Form, useActionData, useLoaderData, useNavigation, useNavigate } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import {
  ProductSelectionSection,
  SlotConfigurationSection,
  CapacitySetup,
  OthersTabContent,
  LocationStaffTabContent,
  ReviewPublishTabContent,
} from "../components/ServiceComponents";

// Loader - Load locations and staff
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  // Get shop
  const shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    throw new Error("Shop not found");
  }

  // Load locations and staff
  const locations = await prisma.location.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
  });

  const staffMembers = await prisma.staff.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
  });

  // Load service categories
  const serviceCategories = await prisma.serviceCategory.findMany({
    where: { shopId: shop.id },
    orderBy: { name: "asc" },
  });

  return { locations, staffMembers, serviceCategories };
};

// Action - Handle service creation
export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  // Get shop
  const shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    return { error: "Shop not found" };
  }

  // CREATE service
  const name = formData.get("name");
  const category = formData.get("category");
  const timezone = formData.get("timezone");
  const serviceType = formData.get("serviceType");
  const shopifyProductId = formData.get("shopifyProductId");
  const shopifyVariantIds = formData.get("shopifyVariantIds");
  const minDays = formData.get("minDays") ? parseInt(formData.get("minDays")) : null;
  const maxDays = formData.get("maxDays") ? parseInt(formData.get("maxDays")) : null;
  const multiDayBooking = formData.get("multiDayBooking");
  const allowedDays = formData.get("allowedDays");
  const capacity = formData.get("capacity") ? parseInt(formData.get("capacity")) : null;

  // Parse JSON fields
  const bundleBooking = formData.get("bundleBooking");
  const cancelBooking = formData.get("cancelBooking");
  const paymentPreferences = formData.get("paymentPreferences");
  const customerFields = formData.get("customerFields");
  const selectedLocations = formData.get("selectedLocations");
  const selectedStaff = formData.get("selectedStaff");
  const locationType = formData.get("locationType") || null;

  // Parse "Others" tab fields
  const minimumAdvancedNotice = formData.get("minimumAdvancedNotice") ? parseInt(formData.get("minimumAdvancedNotice")) : null;
  const minimumAdvancedNoticeUnit = formData.get("minimumAdvancedNoticeUnit");
  const serviceVisibilityDays = formData.get("serviceVisibilityDays") ? parseInt(formData.get("serviceVisibilityDays")) : null;
  const maxProductQuantities = formData.get("maxProductQuantities") ? parseInt(formData.get("maxProductQuantities")) : null;
  const notificationEmail = formData.get("notificationEmail");
  const allowReschedule = formData.get("allowReschedule") === "true";
  const hideLocationSelection = formData.get("hideLocationSelection") === "true";
  const hideStaffSelection = formData.get("hideStaffSelection") === "true";

  // Validate required fields
  if (!name || name.trim() === "") {
    return { error: "Service name is required" };
  }

  const serviceData = {
    name: name.trim(),
    category: category || null,
    timezone,
    serviceType,
    shopifyProductId: shopifyProductId || null,
    shopifyVariantIds: shopifyVariantIds ? JSON.parse(shopifyVariantIds) : null,
    minDays,
    maxDays,
    multiDayBooking,
    allowedDays: allowedDays ? JSON.parse(allowedDays) : null,
    capacity,
    bundleBooking: bundleBooking ? JSON.parse(bundleBooking) : null,
    cancelBooking: cancelBooking ? JSON.parse(cancelBooking) : null,
    paymentPreferences: paymentPreferences ? JSON.parse(paymentPreferences) : null,
    customerFields: customerFields ? JSON.parse(customerFields) : null,
    selectedLocations: selectedLocations ? JSON.parse(selectedLocations) : null,
    selectedStaff: selectedStaff ? JSON.parse(selectedStaff) : null,
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
  const slotConfiguration = formData.get("slotConfiguration");
  if (slotConfiguration) {
    await prisma.slots.create({
      data: {
        serviceId: newService.id,
        slotConfiguration: JSON.parse(slotConfiguration),
      },
    });
  }
  
  return { success: true, message: "Service created successfully" };
};

export default function NewServicePage() {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const shopify = useAppBridge();

  const [selectedTab, setSelectedTab] = useState(0);
  const [formKey] = useState(0);
  const [currentServiceType, setCurrentServiceType] = useState("regular");
  const [validationErrors, setValidationErrors] = useState([]);

  const isSubmitting = navigation.state === "submitting";

  // Show toast notification on success and redirect
  useEffect(() => {
    if (actionData?.success) {
      shopify.toast.show(actionData.message);
      navigate("/app/service");
    }
    if (actionData?.error) {
      shopify.toast.show(actionData.error, { isError: true });
    }
  }, [actionData, shopify, navigate]);

  const handleSubmit = () => {
    const form = document.getElementById("service-form");
    if (form) {
      if (form.checkValidity()) {
        form.requestSubmit();
      } else {
        form.reportValidity();
      }
    }
  };

  // Listen to service type changes
  const handleServiceTypeChange = (e) => {
    const value = e.target.value;
    setCurrentServiceType(value);
  };

  // Validate current step
  const validateStep = (step) => {
    const form = document.getElementById("service-form");
    const errors = [];

    if (step === 0) {
      // Step 1: Product/Slot configuration
      const serviceName = form.querySelector('[name="name"]')?.value;
      if (!serviceName || serviceName.trim() === "") {
        errors.push("Service name is required");
      }

      const productId = form.querySelector('[name="shopifyProductId"]')?.value;
      if (!productId) {
        errors.push("Product link is required");
      }

      const serviceType = form.querySelector('[name="serviceType"]')?.value;
      if (!serviceType) {
        errors.push("Service type is required");
      }

      const slotConfiguration = form.querySelector('[name="slotConfiguration"]')?.value;
      if (!slotConfiguration || slotConfiguration === '{}') {
        errors.push("Slot configuration is required");
      }
    } else if (step === 1) {
      // Step 2: Location & Staff
      const locationType = form.querySelector('[name="locationType"]')?.value;
      if (!locationType) {
        errors.push("Location type is required");
      }
    } else if (step === 2) {
      // Step 3: Others
      const paymentPreferences = form.querySelector('[name="paymentPreferences"]')?.value;
      if (!paymentPreferences) {
        errors.push("Payment preference is required");
      }
    }

    return errors;
  };

  // Handle next button
  const handleNext = () => {
    const errors = validateStep(selectedTab);
    if (errors.length > 0) {
      setValidationErrors(errors);
      shopify.toast.show(errors.join(", "), { isError: true });
      return;
    }
    setValidationErrors([]);
    setSelectedTab(selectedTab + 1);
  };

  // Handle previous button
  const handlePrevious = () => {
    setValidationErrors([]);
    setSelectedTab(selectedTab - 1);
  };

  // Handle step click (with validation)
  const handleStepClick = (targetStep) => {
    // If going backwards, allow without validation
    if (targetStep < selectedTab) {
      setValidationErrors([]);
      setSelectedTab(targetStep);
      return;
    }

    // If going forward, validate all steps in between
    for (let step = selectedTab; step < targetStep; step++) {
      const errors = validateStep(step);
      if (errors.length > 0) {
        setValidationErrors(errors);
        shopify.toast.show(`Please complete Step ${step + 1}: ${errors.join(", ")}`, { isError: true });
        return;
      }
    }

    // All validations passed
    setValidationErrors([]);
    setSelectedTab(targetStep);
  };

  const tabs = [
    "Product/Slot configuration",
    "Location & Staff Member",
    "Others",
    "Review & Publish",
  ];

  return (
    <s-page heading="Add New Service" badge="New">

      <Form method="post" id="service-form" key={formKey} onChange={handleServiceTypeChange}>
        <input
          type="hidden"
          name="serviceId"
          value="new"
        />

        <s-card>
          {/* Tabs Navigation */}
          <div style={{ padding: "0.5rem 1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleStepClick(index)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: selectedTab === index ? "#E3E3E3" : "transparent",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#303030",
                    border: "none",
                    borderRadius: "8px",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 0: Product/Slot Configuration */}
          <div style={{ padding: "1.5rem", display: selectedTab === 0 ? "block" : "none" }}>
            <s-stack direction="block" gap="large">
              {/* Product Selection Section */}
              <ProductSelectionSection formData={null} serviceCategories={loaderData?.serviceCategories || []} />

              {/* Slot Configuration Section */}
              <SlotConfigurationSection formData={null} currentServiceType={currentServiceType} />

              {/* Capacity Setup */}
              <CapacitySetup formData={null} />
            </s-stack>
          </div>

          {/* Tab 1: Location & Staff Member */}
          <div style={{ padding: "1.5rem", display: selectedTab === 1 ? "block" : "none" }}>
            <LocationStaffTabContent 
              formData={null} 
              locations={loaderData?.locations || []} 
              staffMembers={loaderData?.staffMembers || []} 
            />
          </div>

          {/* Tab 2: Others */}
          <div style={{ padding: "1.5rem", display: selectedTab === 2 ? "block" : "none" }}>
            <OthersTabContent formData={null} />
          </div>

          {/* Tab 3: Review & Publish */}
          <div style={{ padding: "1.5rem", display: selectedTab === 3 ? "block" : "none" }}>
            <ReviewPublishTabContent 
              formData={null} 
              locations={loaderData?.locations || []} 
              staffMembers={loaderData?.staffMembers || []} 
              onTabChange={setSelectedTab}
            />
          </div>

          {/* Navigation Buttons */}
          <div style={{ padding: "1.5rem", borderTop: "1px solid #e1e3e5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {selectedTab > 0 && (
                <s-button onClick={handlePrevious}>
                  <s-icon type="arrow-left"></s-icon>
                  Previous
                </s-button>
              )}
            </div>
            <div>
              {selectedTab < 3 ? (
                <s-button variant="primary" onClick={handleNext}>
                  Next
                  <s-icon type="arrow-right"></s-icon>
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
            </div>
          </div>
        </s-card>
      </Form>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
