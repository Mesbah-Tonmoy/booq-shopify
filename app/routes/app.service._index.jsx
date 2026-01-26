import { useEffect, useState, useCallback } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { PrimaryActionButton, ClickableButton } from "../components/WorkingButtons";

// Loader - Fetch all services
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

  // Fetch all services for this shop
  const services = await prisma.service.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
  });

  return { services, shopId: shop.id };
};

// Action - Handle delete operation
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
    const serviceId = parseInt(formData.get("serviceId"));
    await prisma.service.delete({
      where: { id: serviceId },
    });
    return { success: true, message: "Service deleted successfully" };
  }

  return { error: "Invalid action" };
};

export default function ServiceListPage() {
  const { services } = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const modalId = "delete-service-modal";

  // Show toast for delete actions
  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show(fetcher.data.message);
    }
    if (fetcher.data?.error) {
      shopify.toast.show(fetcher.data.error, { isError: true });
    }
  }, [fetcher.data, shopify]);

  const handleDelete = useCallback((id) => {
    setServiceToDelete(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (serviceToDelete) {
      const formData = new FormData();
      formData.append("_action", "delete");
      formData.append("serviceId", serviceToDelete);
      fetcher.submit(formData, { method: "post" });
      setServiceToDelete(null);
    }
  }, [serviceToDelete, fetcher]);

  // Filter services based on search query
  const filteredServices = services.filter((service) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      service.name?.toLowerCase().includes(query) ||
      service.category?.toLowerCase().includes(query) ||
      service.serviceType?.toLowerCase().includes(query)
    );
  });

  return (
    <s-page heading="Service">
      <PrimaryActionButton onClick={() => navigate("/app/service/new")}>
        Add service
      </PrimaryActionButton>

      <s-card>
        {/* Header Section */}
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #e1e3e5" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <s-text variant="heading-md" fontWeight="semibold">
                Service ({services.length})
              </s-text>
              <div style={{ marginTop: "0.25rem" }}>
                <s-text variant="body-sm" color="subdued">
                  Showing {filteredServices.length} of {services.length} services
                </s-text>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #e1e3e5" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <s-button size="slim">Add filter +</s-button>
            <div style={{ width: "300px" }}>
              <s-text-field
                label="Search services"
                label-accessibility-visibility="hidden"
                placeholder="Search services..."
                prefix-icon="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {services.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <s-empty-state
              heading="Create your first service"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <s-text>Set up services that your customers can book.</s-text>
              <div style={{ marginTop: "1rem" }}>
                <PrimaryActionButton onClick={() => navigate("/app/service/new")}>
                  Add service
                </PrimaryActionButton>
              </div>
            </s-empty-state>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e1e3e5" }}>
                  <th style={{ padding: "0.75rem 1.5rem", textAlign: "left" }}>
                    <s-text variant="body-sm" fontWeight="semibold">Service</s-text>
                  </th>
                  <th style={{ padding: "0.75rem 1.5rem", textAlign: "left" }}>
                    <s-text variant="body-sm" fontWeight="semibold">Variations</s-text>
                  </th>
                  <th style={{ padding: "0.75rem 1.5rem", textAlign: "left" }}>
                    <s-text variant="body-sm" fontWeight="semibold">Bookings</s-text>
                  </th>
                  <th style={{ padding: "0.75rem 1.5rem", textAlign: "left" }}>
                    <s-text variant="body-sm" fontWeight="semibold">Status</s-text>
                  </th>
                  <th style={{ padding: "0.75rem 1.5rem", textAlign: "right" }}>
                    <s-text variant="body-sm" fontWeight="semibold">Actions</s-text>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "3rem", textAlign: "center" }}>
                      <s-text color="subdued">
                        No services match your search. Try adjusting your filters.
                      </s-text>
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.id} style={{ borderBottom: "1px solid #e1e3e5" }}>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <ClickableButton
                          variant="plain"
                          onClick={() => navigate(`/app/service/${service.id}`)}
                        >
                          <s-text variant="body-sm" fontWeight="semibold">{service.name}</s-text>
                        </ClickableButton>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <s-text variant="body-sm" color="subdued">No Variations</s-text>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <s-text variant="body-sm">0</s-text>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <s-badge tone="success">Active</s-badge>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "flex-end" }}>
                          <ClickableButton
                            variant="plain"
                            icon="edit"
                            size="slim"
                            onClick={() => navigate(`/app/service/${service.id}`)}
                          />
                          <ClickableButton
                            variant="plain"
                            icon="delete"
                            size="slim"
                            tone="critical"
                            commandFor={modalId}
                            command="--show"
                            onClick={() => handleDelete(service.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredServices.length > 0 && (
          <div style={{
            padding: "1rem 1.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            borderTop: "1px solid #e1e3e5"
          }}>
            <s-button size="slim" icon="chevron-left" disabled />
            <s-text variant="body-sm">
              1-{Math.min(filteredServices.length, 25)} of {filteredServices.length}
            </s-text>
            <s-button size="slim" icon="chevron-right" disabled />
          </div>
        )}
      </s-card>

      {/* Delete Confirmation Modal */}
      <s-modal id={modalId}>
        <div slot="heading">Delete service</div>
        <div style={{ padding: "1rem 0" }}>
          <s-text>
            Are you sure you want to delete this service? This action cannot be undone.
          </s-text>
        </div>
        <ClickableButton 
          slot="secondary-action" 
          commandFor={modalId}
          command="--hide"
        >
          Cancel
        </ClickableButton>
        <ClickableButton 
          slot="primary-action"
          variant="primary" 
          tone="critical"
          commandFor={modalId}
          command="--hide"
          onClick={confirmDelete}
        >
          Delete
        </ClickableButton>
      </s-modal>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
