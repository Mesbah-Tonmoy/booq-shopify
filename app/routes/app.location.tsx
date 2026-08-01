import { useEffect, useState } from 'react';
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
} from 'react-router';
import { useAppBridge } from '@shopify/app-bridge-react';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { authenticate } from '../shopify.server';

import prisma from '../db.server';
import { getInt, getString } from '../utils/formData';
import type { LocationAddress, LocationDayHours } from '../types/location';
import type { Location, Prisma } from '@prisma/client';

import {
  BasicInformationTab,
  AdvancedSettingsTab,
  LocationListItem,
  type LocationFormData,
  type LocationWithParsedFields,
} from '../components/LocationFormComponents';
import type { Route } from './+types/app.location';

// Loader - Fetch all locations
export const loader = async ({ request }: Route.LoaderArgs) => {
  const { session } = await authenticate.admin(request);

  // Find or create shop
  let shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    shop = await prisma.shop.create({
      data: {
        domain: session.shop,
        accessToken: session.accessToken!,
      },
    });
  }

  // Fetch all locations for this shop
  const locations = await prisma.location.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
  });

  return { locations, shopId: shop.id };
};

// Action - Handle CRUD operations
export const action = async ({ request }: Route.ActionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = getString(formData, '_action');

  // Get shop
  const shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    return { error: 'Shop not found' };
  }

  // DELETE
  if (actionType === 'delete') {
    const locationId = getInt(formData, 'locationId');
    await prisma.location.delete({
      where: { id: locationId! },
    });
    return { success: true, message: 'Location deleted successfully' };
  }

  // CREATE or UPDATE
  const locationId = getString(formData, 'locationId');
  const name = getString(formData, 'name') || '';
  const country = getString(formData, 'country') || '';
  const timezone = getString(formData, 'timezone') || '';
  const status = getString(formData, 'status') || '';
  const email = getString(formData, 'email');
  const phone = getString(formData, 'phone');
  const website = getString(formData, 'website');
  const maxCapacity = getInt(formData, 'maxCapacity') || 10;
  const details = getString(formData, 'details');
  const instructions = getString(formData, 'instructions');

  // Build address JSON
  const address: LocationAddress = {
    street: getString(formData, 'street') || '',
    city: getString(formData, 'city') || '',
    state: getString(formData, 'state') || '',
    postalCode: getString(formData, 'postalCode') || '',
  };

  // Build workingHours JSON
  const workingHours: Record<string, LocationDayHours> = {};
  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  days.forEach((day) => {
    const isOpen = getString(formData, `workingHours_${day}_open`) === 'on';
    const breakEnabled =
      getString(formData, `workingHours_${day}_breakEnabled`) === 'on';
    workingHours[day] = {
      open: isOpen,
      start: isOpen
        ? getString(formData, `workingHours_${day}_start`) || '09:00'
        : undefined,
      end: isOpen
        ? getString(formData, `workingHours_${day}_end`) || '17:00'
        : undefined,
      breakEnabled: breakEnabled,
      breakStart: breakEnabled
        ? getString(formData, `workingHours_${day}_breakStart`) || '12:00'
        : undefined,
      breakEnd: breakEnabled
        ? getString(formData, `workingHours_${day}_breakEnd`) || '13:00'
        : undefined,
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
    // Prisma's JSON input types require an index signature our domain
    // interfaces don't have; these are always plain JSON-serializable objects.
    address: address as unknown as Prisma.InputJsonValue,
    workingHours: workingHours as unknown as Prisma.InputJsonValue,
    shopId: shop.id,
  };

  if (locationId && locationId !== 'new') {
    // UPDATE
    await prisma.location.update({
      where: { id: parseInt(locationId) },
      data: locationData,
    });
    return { success: true, message: 'Location updated successfully' };
  } else {
    // CREATE
    await prisma.location.create({
      data: locationData,
    });
    return {
      success: true,
      message: 'Location created successfully',
      clear: true,
    };
  }
};

export default function LocationPage() {
  const { locations } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const fetcher = useFetcher<{ success?: boolean; message?: string }>();
  const shopify = useAppBridge();

  const [selectedTab, setSelectedTab] = useState(0);
  const [editingLocation, setEditingLocation] =
    useState<LocationFormData | null>(null);
  const [formKey, setFormKey] = useState(0); // For resetting form

  const isSubmitting = navigation.state === 'submitting';

  // Show toast notification on success
  useEffect(() => {
    if (
      actionData &&
      'success' in actionData &&
      actionData.success &&
      actionData.message
    ) {
      shopify.toast.show(actionData.message);

      // Clear form after successful creation
      if ('clear' in actionData && actionData.clear) {
        setEditingLocation(null);
        setFormKey((prev) => prev + 1); // Reset form
      }
    }
  }, [actionData, shopify]);

  // Show toast for delete actions
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.message) {
      shopify.toast.show(fetcher.data.message);
    }
  }, [fetcher.data, shopify]);

  const handleEdit = (location: LocationFormData) => {
    setEditingLocation(location);
    setSelectedTab(0); // Switch to first tab
  };

  const handleDelete = (locationId: number) => {
    const formData = new FormData();
    formData.append('_action', 'delete');
    formData.append('locationId', String(locationId));
    fetcher.submit(formData, { method: 'post' });
  };

  const handleCancel = () => {
    setEditingLocation(null);
    setFormKey((prev) => prev + 1);
  };

  const handleSubmit = () => {
    const form = document.getElementById(
      'location-form'
    ) as HTMLFormElement | null;
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
    <s-page heading={editingLocation ? 'Edit Location' : 'Add New Location'}>
      {editingLocation && (
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
        {editingLocation ? 'Update Location' : 'Save Location'}
      </s-button>
      <s-stack gap="base base">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setSelectedTab(0)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedTab === 0 ? '#E3E3E3' : 'transparent',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              color: '#303030',
              border: 'none',
              borderRadius: '8px',
            }}
          >
            Basic Information
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab(1)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedTab === 1 ? '#E3E3E3' : 'transparent',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              color: '#303030',
              border: 'none',
              borderRadius: '8px',
            }}
          >
            Advanced settings
          </button>
        </div>

        <Form method="post" id="location-form" key={formKey}>
          <input
            type="hidden"
            name="locationId"
            value={editingLocation?.id || 'new'}
          />

          <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
            <s-grid-item gridColumn="span 5">
              {selectedTab === 0 && (
                <BasicInformationTab formData={editingLocation ?? undefined} />
              )}

              {selectedTab === 1 && (
                <AdvancedSettingsTab formData={editingLocation ?? undefined} />
              )}
            </s-grid-item>
            <s-grid-item gridColumn="span 7">
              <s-section heading={`All Locations (${locations.length})`}>
                <s-paragraph>
                  Manage your business locations and their settings.
                </s-paragraph>

                {/* Location List */}
                <s-table>
                  <s-table-header-row>
                    <s-table-header>Location</s-table-header>
                    <s-table-header>Country</s-table-header>
                    <s-table-header>Status</s-table-header>
                    <s-table-header>Limit</s-table-header>
                    <s-table-header>Action</s-table-header>
                  </s-table-header-row>

                  <s-table-body>
                    {locations.length === 0 ? (
                      <s-table-row>
                        <s-table-cell>
                          <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <s-text color="subdued">
                              No locations yet. Create your first location to
                              get started.
                            </s-text>
                          </div>
                        </s-table-cell>
                      </s-table-row>
                    ) : (
                      locations.map((location: Location) => (
                        <LocationListItem
                          key={location.id}
                          location={
                            location as unknown as LocationWithParsedFields
                          }
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </s-table-body>
                </s-table>
              </s-section>
            </s-grid-item>
          </s-grid>
        </Form>
      </s-stack>
    </s-page>
  );
}

export const headers: Route.HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
