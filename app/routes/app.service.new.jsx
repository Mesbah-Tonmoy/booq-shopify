import { useEffect, useState } from "react";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
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
  const bookingType = formData.get("bookingType");
  const serviceType = formData.get("serviceType");
  const shopifyProductId = formData.get("shopifyProductId");
  const shopifyVariantIds = formData.get("shopifyVariantIds");
  const duration = parseInt(formData.get("duration")) || 60;
  const durationUnit = formData.get("durationUnit") || "Minutes";
  const slotConfiguration = formData.get("slotConfiguration");
  const minDays = formData.get("minDays") ? parseInt(formData.get("minDays")) : null;
  const maxDays = formData.get("maxDays") ? parseInt(formData.get("maxDays")) : null;
  const multiDayBooking = formData.get("multiDayBooking");
  const allowedDays = formData.get("allowedDays");

  // Validate required fields
  if (!name || name.trim() === "") {
    return { error: "Service name is required" };
  }

  const serviceData = {
    name: name.trim(),
    category: category || null,
    timezone,
    bookingType,
    serviceType,
    shopifyProductId: shopifyProductId || null,
    shopifyVariantIds: shopifyVariantIds ? JSON.parse(shopifyVariantIds) : null,
    duration,
    durationUnit,
    slotConfiguration: slotConfiguration ? JSON.parse(slotConfiguration) : null,
    minDays,
    maxDays,
    multiDayBooking,
    allowedDays: allowedDays ? JSON.parse(allowedDays) : null,
    shopId: shop.id,
  };

  await prisma.service.create({
    data: serviceData,
  });
  
  return { success: true, message: "Service created successfully", redirect: "/app/service" };
};

export default function NewServicePage() {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const navigation = useNavigation();
  const shopify = useAppBridge();

  const [selectedTab, setSelectedTab] = useState(0);
  const [formKey] = useState(0);
  const [currentServiceType, setCurrentServiceType] = useState("regular");

  const isSubmitting = navigation.state === "submitting";

  // Show toast notification on success and redirect
  useEffect(() => {
    if (actionData?.success) {
      shopify.toast.show(actionData.message);
      if (actionData.redirect) {
        window.location.href = actionData.redirect;
      }
    }
    if (actionData?.error) {
      shopify.toast.show(actionData.error, { isError: true });
    }
  }, [actionData, shopify]);

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

  const tabs = [
    "Product/Slot configuration",
    "Location & Staff Member",
    "Others",
    "Review & Publish",
  ];

  return (
    <s-page heading="Add New Service" badge="New">
      <s-button
        slot="primary-action"
        variant="primary"
        onClick={handleSubmit}
        {...(isSubmitting ? { loading: true } : {})}
      >
        Save Service
      </s-button>

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
                  onClick={() => setSelectedTab(index)}
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
        </s-card>
      </Form>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
