import { useEffect, useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

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

  // Show toast for delete actions
  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show(fetcher.data.message);
    }
    if (fetcher.data?.error) {
      shopify.toast.show(fetcher.data.error, { isError: true });
    }
  }, [fetcher.data, shopify]);

  const handleDelete = (serviceId) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const formData = new FormData();
      formData.append("_action", "delete");
      formData.append("serviceId", serviceId);
      fetcher.submit(formData, { method: "post" });
    }
  };

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
    <s-page heading="Service" badge="New">
      <s-button slot="primary-action" variant="primary" onClick={() => navigate("/app/service/new")}>
        Add Service
      </s-button>

      <s-card>
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #e1e3e5" }}>
          <s-text color="subdued">Showing 1-{Math.min(25, filteredServices.length)} of {services.length} services</s-text>
        </div>

        <div style={{ padding: "1rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <s-button size="slim">Add filter +</s-button>
            <s-text-field 
              placeholder="Search services..." 
              prefix-icon="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderTop: "1px solid #e1e3e5", borderBottom: "1px solid #e1e3e5" }}>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontWeight: 600, fontSize: "12px", color: "#6d7175" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Service</s-text>
                </th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontWeight: 600, fontSize: "12px", color: "#6d7175" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Service</s-text>
                </th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontWeight: 600, fontSize: "12px", color: "#6d7175" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Variations</s-text>
                </th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontWeight: 600, fontSize: "12px", color: "#6d7175" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Variations</s-text>
                </th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontWeight: 600, fontSize: "12px", color: "#6d7175" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Bookings</s-text>
                </th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontWeight: 600, fontSize: "12px", color: "#6d7175" }}>
                  <s-text variant="body-sm" fontWeight="semibold">Status</s-text>
                </th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontWeight: 600, fontSize: "12px", color: "#6d7175" }}>
                  <s-text variant="body-sm" fontWeight="semibold">More</s-text>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: "3rem", textAlign: "center" }}>
                    <s-text color="subdued">
                      {services.length === 0 
                        ? "No services yet. Create your first service to get started."
                        : "No services match your search."}
                    </s-text>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} style={{ borderBottom: "1px solid #e1e3e5" }}>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <s-text variant="body-sm" fontWeight="semibold">{service.name}</s-text>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <s-text variant="body-sm" color="subdued">No Variations</s-text>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <s-text variant="body-sm" color="subdued">No Variations</s-text>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <s-text variant="body-sm" color="subdued">No Variations</s-text>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <s-text variant="body-sm">0</s-text>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <s-badge tone="success">6 services</s-badge>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <s-button variant="plain" icon="view" size="slim" />
                        <s-button variant="plain" icon="edit" size="slim" onClick={() => navigate(`/app/service/${service.id}`)} />
                        <s-button variant="plain" icon="more" size="slim" onClick={() => handleDelete(service.id)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredServices.length > 0 && (
          <div style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", borderTop: "1px solid #e1e3e5" }}>
            <s-button size="slim" icon="chevron-left" disabled />
            <s-text variant="body-sm">1-{Math.min(filteredServices.length, 25)} of {filteredServices.length}</s-text>
            <s-button size="slim" icon="chevron-right" disabled />
          </div>
        )}
      </s-card>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
