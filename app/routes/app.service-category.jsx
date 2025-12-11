import { useEffect, useState } from "react";
import { Form, useActionData, useFetcher, useLoaderData, useNavigation } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { ServiceCategoryForm, ServiceCategoryListItem } from "../components/ServiceCategoryComponents";

// Loader - Fetch all service categories
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

  // Fetch all service categories for this shop
  const serviceCategories = await prisma.serviceCategory.findMany({
    where: { shopId: shop.id },
    orderBy: { id: "desc" },
  });

  return { serviceCategories, shopId: shop.id };
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
    const serviceCategoryId = parseInt(formData.get("serviceCategoryId"));
    await prisma.serviceCategory.delete({
      where: { id: serviceCategoryId },
    });
    return { success: true, message: "Service category deleted successfully" };
  }

  // CREATE or UPDATE
  const serviceCategoryId = formData.get("serviceCategoryId");
  const name = formData.get("name");
  const slug = formData.get("slug");

  // Validate required fields
  if (!name || name.trim() === "") {
    return { error: "Category name is required" };
  }
  if (!slug || slug.trim() === "") {
    return { error: "Slug is required" };
  }

  const serviceCategoryData = {
    name: name.trim(),
    slug: slug.trim(),
    shopId: shop.id,
  };

  if (serviceCategoryId && serviceCategoryId !== "new") {
    // UPDATE
    await prisma.serviceCategory.update({
      where: { id: parseInt(serviceCategoryId) },
      data: serviceCategoryData,
    });
    return { success: true, message: "Service category updated successfully" };
  } else {
    // CREATE
    await prisma.serviceCategory.create({
      data: serviceCategoryData,
    });
    return { success: true, message: "Service category created successfully", clear: true };
  }
};

export default function ServiceCategoryPage() {
  const { serviceCategories } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  const [editingServiceCategory, setEditingServiceCategory] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const isSubmitting = navigation.state === "submitting";

  // Show toast notification on success
  useEffect(() => {
    if (actionData?.success) {
      shopify.toast.show(actionData.message);
      
      // Clear form after successful creation
      if (actionData.clear) {
        setEditingServiceCategory(null);
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

  const handleEdit = (serviceCategory) => {
    setEditingServiceCategory(serviceCategory);
  };

  const handleDelete = (serviceCategoryId) => {
    const formData = new FormData();
    formData.append("_action", "delete");
    formData.append("serviceCategoryId", serviceCategoryId);
    fetcher.submit(formData, { method: "post" });
  };

  const handleCancel = () => {
    setEditingServiceCategory(null);
    setFormKey((prev) => prev + 1);
  };

  const handleSubmit = () => {
    const form = document.getElementById("service-category-form");
    if (form) {
      if (form.checkValidity()) {
        form.requestSubmit();
      } else {
        form.reportValidity();
      }
    }
  };

  return (
    <s-page heading={editingServiceCategory ? "Edit Service Category" : "Add Service Category"} badge={editingServiceCategory ? "Edit" : "New"}>
      {editingServiceCategory && (
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
        {editingServiceCategory ? "Update Service Category" : "Save Service Category"}
      </s-button>

      <Form method="post" id="service-category-form" key={formKey}>
        <input
          type="hidden"
          name="serviceCategoryId"
          value={editingServiceCategory?.id || "new"}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {/* Left Column - Form */}
          <div>
            <s-section>
              <s-heading>Add Service Category</s-heading>
              <ServiceCategoryForm formData={editingServiceCategory} />
            </s-section>
          </div>

          {/* Right Column - Service Category List */}
          <div>
            <s-section heading={`Service Categories (${serviceCategories.length})`}>
              <s-paragraph>Organize your services into categories for better management</s-paragraph>

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

              {/* Service Category List */}
              <div>
                {serviceCategories.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    <s-text color="subdued">
                      No service categories yet. Create your first service category to get started.
                    </s-text>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {serviceCategories.map((serviceCategory, index) => (
                      <div
                        key={serviceCategory.id}
                        style={{
                          borderBottom: index < serviceCategories.length - 1 ? "1px solid #e1e3e5" : "none",
                        }}
                      >
                        <ServiceCategoryListItem
                          serviceCategory={serviceCategory}
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
