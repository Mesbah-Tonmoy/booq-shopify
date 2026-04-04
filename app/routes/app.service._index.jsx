import { useEffect, useState, useCallback } from 'react';
import { useFetcher, useLoaderData, useNavigate } from 'react-router';
import { useAppBridge } from '@shopify/app-bridge-react';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { authenticate } from '../shopify.server';
import prisma from '../db.server';
import {
  PrimaryActionButton,
  ClickableButton,
} from '../components/WorkingButtons';

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
    orderBy: { createdAt: 'desc' },
  });

  return { services, shopId: shop.id };
};

// Action - Handle delete operation
export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get('_action');

  // Get shop
  const shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    return { error: 'Shop not found' };
  }

  // DELETE
  if (actionType === 'delete') {
    const serviceId = parseInt(formData.get('serviceId'));
    await prisma.service.delete({
      where: { id: serviceId },
    });
    return { success: true, message: 'Service deleted successfully' };
  }

  return { error: 'Invalid action' };
};

export default function ServiceListPage() {
  const { services } = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const modalId = 'delete-service-modal';

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
      formData.append('_action', 'delete');
      formData.append('serviceId', serviceToDelete);
      fetcher.submit(formData, { method: 'post' });
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const currentPagedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <s-page heading="Service">
      <PrimaryActionButton onClick={() => navigate('/app/service/new')}>
        Add Service
      </PrimaryActionButton>

      <s-section
        padding="none"
        accessibilityLabel="Services table with pagination"
      >
        <s-table
          paginate
          hasPreviousPage={currentPage > 1}
          hasNextPage={currentPage < totalPages}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          paginationLabel={`Page ${currentPage} of ${totalPages || 1}`}
        >
          <s-grid slot="filters" gap="small-200" gridTemplateColumns="40% 50%">
            <s-text-field
              label="Search services"
              labelAccessibilityVisibility="exclusive"
              icon="search"
              placeholder="Searching all services"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </s-grid>

          <s-table-header-row>
            <s-table-header listSlot="primary">Service</s-table-header>
            <s-table-header>Variations</s-table-header>
            <s-table-header format="numeric">Bookings</s-table-header>
            <s-table-header>Status</s-table-header>
            <s-table-header listSlot="secondary">Actions</s-table-header>
          </s-table-header-row>

          <s-table-body>
            {currentPagedServices.length === 0 ? (
              <s-table-row>
                <s-table-cell colSpan="5">
                  <div style={{ padding: '3rem', textAlign: 'center' }}>
                    <s-text color="subdued">
                      {services.length === 0
                        ? 'Set up services that your customers can book.'
                        : 'No services match your search. Try adjusting your filters.'}
                    </s-text>
                    {services.length === 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <PrimaryActionButton
                          onClick={() => navigate('/app/service/new')}
                        >
                          Add service
                        </PrimaryActionButton>
                      </div>
                    )}
                  </div>
                </s-table-cell>
              </s-table-row>
            ) : (
              currentPagedServices.map((service) => (
                <s-table-row key={service.id}>
                  <s-table-cell>
                    <s-link href={`/app/service/${service.id}`}>
                      {service.name}
                    </s-link>
                  </s-table-cell>
                  <s-table-cell>
                    <s-text variant="body-sm" color="subdued">
                      No Variations
                    </s-text>
                  </s-table-cell>
                  <s-table-cell>0</s-table-cell>
                  <s-table-cell>
                    <s-badge tone="success">Active</s-badge>
                  </s-table-cell>
                  <s-table-cell>
                    <s-stack direction="inline" gap="small small-400">
                      <s-button
                        icon="edit"
                        onClick={() => navigate(`/app/service/${service.id}`)}
                        accessibilityLabel="Edit service"
                      />
                      <s-button
                        icon="delete"
                        tone="critical"
                        commandFor={modalId}
                        command="--show"
                        onClick={() => handleDelete(service.id)}
                        accessibilityLabel="Delete service"
                      />
                    </s-stack>
                  </s-table-cell>
                </s-table-row>
              ))
            )}
          </s-table-body>
        </s-table>
      </s-section>

      {/* Delete Confirmation Modal */}
      <s-modal id={modalId} heading="Delete service">
        <s-paragraph>
          Are you sure you want to delete this service? This action cannot be
          undone.
        </s-paragraph>
        <s-button
          slot="secondary-actions"
          commandFor={modalId}
          command="--hide"
        >
          Cancel
        </s-button>
        <s-button
          slot="primary-action"
          variant="primary"
          tone="critical"
          commandFor={modalId}
          command="--hide"
          onClick={confirmDelete}
        >
          Delete
        </s-button>
      </s-modal>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
