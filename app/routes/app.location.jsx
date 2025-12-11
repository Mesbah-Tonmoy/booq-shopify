import { useEffect, useState } from "react";
import { Form, useActionData, useFetcher, useLoaderData, useNavigation } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import {
  BasicInformationTab,
  AdvancedSettingsTab,
  LocationListItem,
} from "../components/LocationFormComponents";

// Loader - Fetch all locations
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  
  // Find or create shop
  let shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    shop = await prisma.shop.create({
      data: {
        domain: session.shop,
        accessToken: session.accessToken,
      },
    });
  }

  // Fetch all locations for this shop
  const locations = await prisma.location.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
  });

  return { locations, shopId: shop.id };
};

// Action - Handle CRUD operations
export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("_action");

  // Get shop
  const shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    return { error: "Shop not found" };
  }

  // DELETE
  if (actionType === "delete") {
    const locationId = parseInt(formData.get("locationId"));
    await prisma.location.delete({
      where: { id: locationId },
    });
    return { success: true, message: "Location deleted successfully" };
  }

  // CREATE or UPDATE
  const locationId = formData.get("locationId");
  const name = formData.get("name");
  const country = formData.get("country");
  const timezone = formData.get("timezone");
  const status = formData.get("status");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const website = formData.get("website");
  const maxCapacity = parseInt(formData.get("maxCapacity")) || 10;
  const details = formData.get("details");
  const instructions = formData.get("instructions");

  // Build address JSON
  const address = {
    street: formData.get("street") || "",
    city: formData.get("city") || "",
    state: formData.get("state") || "",
    postalCode: formData.get("postalCode") || "",
  };

  // Build workingHours JSON
  const workingHours = {};
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  
  days.forEach((day) => {
    const isOpen = formData.get(`workingHours_${day}_open`) === "on";
    const breakEnabled = formData.get(`workingHours_${day}_breakEnabled`) === "on";
    workingHours[day] = {
      open: isOpen,
      start: isOpen ? formData.get(`workingHours_${day}_start`) || "09:00" : null,
      end: isOpen ? formData.get(`workingHours_${day}_end`) || "17:00" : null,
      breakEnabled: breakEnabled,
      breakStart: breakEnabled ? formData.get(`workingHours_${day}_breakStart`) || "12:00" : null,
      breakEnd: breakEnabled ? formData.get(`workingHours_${day}_breakEnd`) || "13:00" : null,
    };
  });

  const locationData = {
    name,
    country,
    timezone,
    status,
    email: email || null,
    phone: phone || null,
    website: website || null,
    maxCapacity,
    details: details || null,
    instructions: instructions || null,
    address,
    workingHours,
    shopId: shop.id,
  };

  if (locationId && locationId !== "new") {
    // UPDATE
    await prisma.location.update({
      where: { id: parseInt(locationId) },
      data: locationData,
    });
    return { success: true, message: "Location updated successfully" };
  } else {
    // CREATE
    await prisma.location.create({
      data: locationData,
    });
    return { success: true, message: "Location created successfully", clear: true };
  }
};

export default function LocationPage() {
  const { locations } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  const [selectedTab, setSelectedTab] = useState(0);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formKey, setFormKey] = useState(0); // For resetting form

  const isSubmitting = navigation.state === "submitting";

  // Show toast notification on success
  useEffect(() => {
    if (actionData?.success) {
      shopify.toast.show(actionData.message);
      
      // Clear form after successful creation
      if (actionData.clear) {
        setEditingLocation(null);
        setFormKey((prev) => prev + 1); // Reset form
      }
    }
  }, [actionData, shopify]);

  // Show toast for delete actions
  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show(fetcher.data.message);
    }
  }, [fetcher.data, shopify]);

  const handleEdit = (location) => {
    setEditingLocation(location);
    setSelectedTab(0); // Switch to first tab
  };

  const handleDelete = (locationId) => {
    const formData = new FormData();
    formData.append("_action", "delete");
    formData.append("locationId", locationId);
    fetcher.submit(formData, { method: "post" });
  };

  const handleCancel = () => {
    setEditingLocation(null);
    setFormKey((prev) => prev + 1);
  };

  const handleSubmit = () => {
    const form = document.getElementById("location-form");
    if (form) {
      // Check if form is valid before submitting
      if (form.checkValidity()) {
        form.requestSubmit();
      } else {
        // Trigger validation messages
        form.reportValidity();
      }
    }
  };

  return (
    <s-page heading={editingLocation ? "Edit Location" : "Add New Location"} badge={editingLocation ? "Edit" : "New"}>
      <s-button
        slot="primary-action"
        variant="primary"
        onClick={handleSubmit}
        {...(isSubmitting ? { loading: true } : {})}
      >
        {editingLocation ? "Update Location" : "Save Location"}
      </s-button>
      {editingLocation && (
        <s-button slot="secondary-actions" onClick={handleCancel}>
          Cancel
        </s-button>
      )}

      <Form method="post" id="location-form" key={formKey}>
        <input
          type="hidden"
          name="locationId"
          value={editingLocation?.id || "new"}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {/* Left Column - Form */}
          <div>
            <s-card>
              <div style={{ padding: "0.5rem 1rem" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedTab(0)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: selectedTab === 0 ? "#E3E3E3" : "transparent",
                      cursor: "pointer",
                      fontWeight: "500",
                      fontSize: "14px",
                      color: "#303030",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  >
                    Basic Information
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTab(1)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: selectedTab === 1 ? "#E3E3E3" : "transparent",
                      cursor: "pointer",
                      fontWeight: "500",
                      fontSize: "14px",
                      color: "#303030",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  >
                    Advanced settings
                  </button>
                </div>
              </div>

              <div style={{ padding: "1.5rem", display: selectedTab === 0 ? "block" : "none" }}>
                <BasicInformationTab formData={editingLocation} />
              </div>

              <div style={{ padding: "1.5rem", display: selectedTab === 1 ? "block" : "none" }}>
                <AdvancedSettingsTab formData={editingLocation} />
              </div>
            </s-card>
          </div>

          {/* Right Column - Location List */}
          <div>
            <s-section heading={`All Locations (${locations.length})`}>
              <s-paragraph>Manage your business locations and their settings.</s-paragraph>

              {/* List Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1fr 1fr 40px",
                  gap: "0.5rem",
                  padding: "0.75rem 0.5rem",
                  borderBottom: "1px solid #e1e3e5",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Location</s-text>
                </div>
                <div style={{ textAlign: "left" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Country</s-text>
                </div>
                <div style={{ textAlign: "left" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Status</s-text>
                </div>
                <div style={{ textAlign: "left" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Limit</s-text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Action</s-text>
                </div>
              </div>

              {/* Location List */}
              <div>
                {locations.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    <s-text color="subdued">
                      No locations yet. Create your first location to get started.
                    </s-text>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {locations.map((location, index) => (
                      <div
                        key={location.id}
                        style={{
                          borderBottom: index < locations.length - 1 ? "1px solid #e1e3e5" : "none",
                        }}
                      >
                        <LocationListItem
                          location={location}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </s-section>
          </div>
        </div>
      </Form>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
