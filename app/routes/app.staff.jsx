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
import { StaffForm, StaffListItem } from '../components/StaffComponents';

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
    orderBy: { menuOrderBy: 'asc' },
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
    const staffId = parseInt(formData.get('staffId'));
    await prisma.staff.delete({
      where: { id: staffId },
    });
    return { success: true, message: 'Staff member deleted successfully' };
  }

  // CREATE or UPDATE
  const staffId = formData.get('staffId');
  const name = formData.get('name');
  const email = formData.get('email') || null;
  const phone = formData.get('phone');

  // Validate required fields
  if (!name || name.trim() === '') {
    return { error: 'Name is required' };
  }
  if (!phone || phone.trim() === '') {
    return { error: 'Phone number is required' };
  }
  const bio = formData.get('bio') || null;
  const photoUrl = formData.get('photoUrl') || null;
  const timezone = formData.get('timezone');
  const status = formData.get('status');
  const menuOrderBy = parseInt(formData.get('menuOrderBy')) || 0;
  const maxCapacity = parseInt(formData.get('maxCapacity')) || 1;
  const locationId = formData.get('locationId')
    ? parseInt(formData.get('locationId'))
    : null;
  const staffGroupId = formData.get('staffGroupId')
    ? parseInt(formData.get('staffGroupId'))
    : null;

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

  if (staffId && staffId !== 'new') {
    // UPDATE
    await prisma.staff.update({
      where: { id: parseInt(staffId) },
      data: staffData,
    });
    return {
      success: true,
      message: 'Staff member updated successfully',
      clear: true,
    };
  } else {
    // CREATE
    await prisma.staff.create({
      data: staffData,
    });
    return {
      success: true,
      message: 'Staff member created successfully',
      clear: true,
    };
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

  const isSubmitting = navigation.state === 'submitting';

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
    formData.append('_action', 'delete');
    formData.append('staffId', staffId);
    fetcher.submit(formData, { method: 'post' });
  };

  const handleCancel = () => {
    setEditingStaff(null);
    setFormKey((prev) => prev + 1);
  };

  const handleSubmit = () => {
    const form = document.getElementById('staff-form');
    if (form) {
      if (form.checkValidity()) {
        form.requestSubmit();
      } else {
        form.reportValidity();
      }
    }
  };

  return (
    <s-page
      heading={editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
      badge={editingStaff ? 'Edit' : 'New'}
    >
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
        {editingStaff ? 'Update Staff Member' : 'Create Staff Member'}
      </s-button>

      <Form method="post" id="staff-form" key={formKey}>
        <input type="hidden" name="staffId" value={editingStaff?.id || 'new'} />

        <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
          {/* Left Column - Form */}
          <s-grid-item gridColumn="span 5">
            <StaffForm
              formData={editingStaff}
              locations={locations}
              staffGroups={staffGroups}
            />
          </s-grid-item>

          {/* Right Column - Staff List */}
          <s-grid-item gridColumn="span 7">
            <s-section heading={`Staff Members (${staffs.length})`}>
              <s-paragraph>
                Manage your team members and their settings
              </s-paragraph>

              {/* Search and Filter */}
              <div style={{ marginBottom: '1rem' }}>
                <s-text-field
                  label="Search staff members"
                  label-accessibility-visibility="hidden"
                  placeholder="Search staff members..."
                  prefix-icon="search"
                />
              </div>

              {/* Staff List */}
              <s-table>
                <s-table-header-row>
                  <s-table-header>Staff Member</s-table-header>
                  <s-table-header>Location</s-table-header>
                  <s-table-header>Status</s-table-header>
                  <s-table-header>Bookings</s-table-header>
                  <s-table-header>Action</s-table-header>
                </s-table-header-row>

                <s-table-body>
                  {staffs.length === 0 ? (
                    <s-table-row>
                      <s-table-cell>
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                          <s-text color="subdued">
                            No staff members yet. Create your first staff member
                            to get started.
                          </s-text>
                        </div>
                      </s-table-cell>
                    </s-table-row>
                  ) : (
                    staffs.map((staff) => (
                      <StaffListItem
                        key={staff.id}
                        staff={staff}
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
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
