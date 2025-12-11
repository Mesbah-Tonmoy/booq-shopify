import { useEffect, useState } from "react";
import { Form, useActionData, useFetcher, useLoaderData, useNavigation } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { StaffGroupForm, StaffGroupListItem } from "../components/StaffGroupComponents";

// Loader - Fetch all staff groups
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

  // Fetch all staff groups for this shop with staff count
  const staffGroups = await prisma.staffGroup.findMany({
    where: { shopId: shop.id },
    include: {
      _count: {
        select: { staffs: true },
      },
    },
    orderBy: { id: "desc" },
  });

  return { staffGroups, shopId: shop.id };
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
    const staffGroupId = parseInt(formData.get("staffGroupId"));
    await prisma.staffGroup.delete({
      where: { id: staffGroupId },
    });
    return { success: true, message: "Staff group deleted successfully" };
  }

  // CREATE or UPDATE
  const staffGroupId = formData.get("staffGroupId");
  const name = formData.get("name");
  const slug = formData.get("slug");

  const staffGroupData = {
    name,
    slug,
    shopId: shop.id,
  };

  if (staffGroupId && staffGroupId !== "new") {
    // UPDATE
    await prisma.staffGroup.update({
      where: { id: parseInt(staffGroupId) },
      data: staffGroupData,
    });
    return { success: true, message: "Staff group updated successfully" };
  } else {
    // CREATE
    await prisma.staffGroup.create({
      data: staffGroupData,
    });
    return { success: true, message: "Staff group created successfully", clear: true };
  }
};

export default function StaffGroupPage() {
  const { staffGroups } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  const [editingStaffGroup, setEditingStaffGroup] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const isSubmitting = navigation.state === "submitting";

  // Show toast notification on success
  useEffect(() => {
    if (actionData?.success) {
      shopify.toast.show(actionData.message);
      
      // Clear form after successful creation
      if (actionData.clear) {
        setEditingStaffGroup(null);
        setFormKey((prev) => prev + 1);
      }
    }
  }, [actionData, shopify]);

  // Show toast for delete actions
  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show(fetcher.data.message);
    }
  }, [fetcher.data, shopify]);

  const handleEdit = (staffGroup) => {
    setEditingStaffGroup(staffGroup);
  };

  const handleDelete = (staffGroupId) => {
    const formData = new FormData();
    formData.append("_action", "delete");
    formData.append("staffGroupId", staffGroupId);
    fetcher.submit(formData, { method: "post" });
  };

  const handleCancel = () => {
    setEditingStaffGroup(null);
    setFormKey((prev) => prev + 1);
  };

  const handleSubmit = () => {
    const form = document.getElementById("staff-group-form");
    if (form) {
      if (form.checkValidity()) {
        form.requestSubmit();
      } else {
        form.reportValidity();
      }
    }
  };

  return (
    <s-page heading={editingStaffGroup ? "Edit Staff Group" : "Add Staff Group"} badge={editingStaffGroup ? "Edit" : "New"}>
      {editingStaffGroup && (
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
        {editingStaffGroup ? "Update Staff Group" : "Save Staff Group"}
      </s-button>

      <Form method="post" id="staff-group-form" key={formKey}>
        <input
          type="hidden"
          name="staffGroupId"
          value={editingStaffGroup?.id || "new"}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {/* Left Column - Form */}
          <div>
            <s-section>
              <s-heading>Add Staff Group</s-heading>
              <StaffGroupForm formData={editingStaffGroup} />
            </s-section>
          </div>

          {/* Right Column - Staff Group List */}
          <div>
            <s-section heading={`Staff Groups (${staffGroups.length})`}>
              <s-paragraph>Organize your staff into groups for better management</s-paragraph>

              {/* List Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1fr 40px",
                  gap: "0.5rem",
                  padding: "0.75rem 0.5rem",
                  borderBottom: "1px solid #e1e3e5",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Category name</s-text>
                </div>
                <div style={{ textAlign: "left" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Slug</s-text>
                </div>
                <div style={{ textAlign: "left" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Services</s-text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <s-text variant="body-sm" fontWeight="semibold">More</s-text>
                </div>
              </div>

              {/* Staff Group List */}
              <div>
                {staffGroups.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    <s-text color="subdued">
                      No staff groups yet. Create your first staff group to get started.
                    </s-text>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {staffGroups.map((staffGroup, index) => (
                      <div
                        key={staffGroup.id}
                        style={{
                          borderBottom: index < staffGroups.length - 1 ? "1px solid #e1e3e5" : "none",
                        }}
                      >
                        <StaffGroupListItem
                          staffGroup={staffGroup}
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
