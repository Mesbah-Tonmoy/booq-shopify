import { useEffect, useState } from "react";
import { Form, useActionData, useFetcher, useLoaderData, useNavigation } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { StaffForm, StaffListItem } from "../components/StaffComponents";

// Loader - Fetch all staff members with relations
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

  // Fetch all staff members for this shop with relations
  const staffs = await prisma.staff.findMany({
    where: { shopId: shop.id },
    include: {
      location: true,
      staffGroup: true,
    },
    orderBy: { menuOrderBy: "asc" },
  });

  // Fetch locations and staff groups for dropdowns
  const locations = await prisma.location.findMany({
    where: { shopId: shop.id },
    select: { id: true, name: true },
  });

  const staffGroups = await prisma.staffGroup.findMany({
    where: { shopId: shop.id },
    select: { id: true, name: true },
  });

  return { staffs, locations, staffGroups, shopId: shop.id };
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
    const staffId = parseInt(formData.get("staffId"));
    await prisma.staff.delete({
      where: { id: staffId },
    });
    return { success: true, message: "Staff member deleted successfully" };
  }

  // CREATE or UPDATE
  const staffId = formData.get("staffId");
  const name = formData.get("name");
  const email = formData.get("email") || null;
  const phone = formData.get("phone");

  // Validate required fields
  if (!name || name.trim() === "") {
    return { error: "Name is required" };
  }
  if (!phone || phone.trim() === "") {
    return { error: "Phone number is required" };
  }
  const bio = formData.get("bio") || null;
  const photoUrl = formData.get("photoUrl") || null;
  const timezone = formData.get("timezone");
  const status = formData.get("status");
  const menuOrderBy = parseInt(formData.get("menuOrderBy")) || 0;
  const maxCapacity = parseInt(formData.get("maxCapacity")) || 1;
  const locationId = formData.get("locationId") ? parseInt(formData.get("locationId")) : null;
  const staffGroupId = formData.get("staffGroupId") ? parseInt(formData.get("staffGroupId")) : null;

  const staffData = {
    name: name.trim(),
    email,
    phone: phone.trim(),
    bio,
    photoUrl,
    timezone,
    status,
    menuOrderBy,
    maxCapacity,
    shopId: shop.id,
    locationId,
    staffGroupId,
  };

  if (staffId && staffId !== "new") {
    // UPDATE
    await prisma.staff.update({
      where: { id: parseInt(staffId) },
      data: staffData,
    });
    return { success: true, message: "Staff member updated successfully" };
  } else {
    // CREATE
    await prisma.staff.create({
      data: staffData,
    });
    return { success: true, message: "Staff member created successfully", clear: true };
  }
};

export default function StaffPage() {
  const { staffs, locations, staffGroups } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  const [editingStaff, setEditingStaff] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const isSubmitting = navigation.state === "submitting";

  // Show toast notification on success
  useEffect(() => {
    if (actionData?.success) {
      shopify.toast.show(actionData.message);
      
      // Clear form after successful creation
      if (actionData.clear) {
        setEditingStaff(null);
        setFormKey((prev) => prev + 1);
      }
    }
    if (actionData?.error) {
      shopify.toast.show(actionData.error, { isError: true });
    }
  }, [actionData, shopify]);

  // Show toast for delete actions
  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show(fetcher.data.message);
    }
  }, [fetcher.data, shopify]);

  const handleEdit = (staff) => {
    setEditingStaff(staff);
  };

  const handleDelete = (staffId) => {
    const formData = new FormData();
    formData.append("_action", "delete");
    formData.append("staffId", staffId);
    fetcher.submit(formData, { method: "post" });
  };

  const handleCancel = () => {
    setEditingStaff(null);
    setFormKey((prev) => prev + 1);
  };

  const handleSubmit = () => {
    const form = document.getElementById("staff-form");
    if (form) {
      if (form.checkValidity()) {
        form.requestSubmit();
      } else {
        form.reportValidity();
      }
    }
  };

  return (
    <s-page heading={editingStaff ? "Edit Staff Member" : "Add Staff Member"} badge={editingStaff ? "Edit" : "New"}>
      {editingStaff && (
        <s-button slot="secondary-actions" onClick={handleCancel}>
          Cancel
        </s-button>
      )}
      <s-button
        slot="primary-action"
        variant="primary"
        onClick={handleSubmit}
        {...(isSubmitting ? { loading: true } : {})}
      >
        {editingStaff ? "Update Staff Member" : "Create Staff Member"}
      </s-button>

      <Form method="post" id="staff-form" key={formKey}>
        <input
          type="hidden"
          name="staffId"
          value={editingStaff?.id || "new"}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {/* Left Column - Form */}
          <div>
            <StaffForm 
              formData={editingStaff} 
              locations={locations}
              staffGroups={staffGroups}
            />
          </div>

          {/* Right Column - Staff List */}
          <div>
            <s-section heading={`Staff Members (${staffs.length})`}>
              <s-paragraph>Manage your team members and their settings</s-paragraph>

              {/* Search and Filter */}
              <div style={{ marginBottom: "1rem" }}>
                <s-text-field
                  placeholder="Search staff members..."
                  prefix-icon="search"
                />
              </div>

              {/* List Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr 1fr 0.8fr 40px",
                  gap: "0.5rem",
                  padding: "0.75rem 0.5rem",
                  borderBottom: "1px solid #e1e3e5",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Staff Member</s-text>
                </div>
                <div style={{ textAlign: "left" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Location</s-text>
                </div>
                <div style={{ textAlign: "left" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Status</s-text>
                </div>
                <div style={{ textAlign: "left" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Bookings</s-text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Action</s-text>
                </div>
              </div>

              {/* Staff List */}
              <div>
                {staffs.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    <s-text color="subdued">
                      No staff members yet. Create your first staff member to get started.
                    </s-text>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {staffs.map((staff, index) => (
                      <div
                        key={staff.id}
                        style={{
                          borderBottom: index < staffs.length - 1 ? "1px solid #e1e3e5" : "none",
                        }}
                      >
                        <StaffListItem
                          staff={staff}
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
