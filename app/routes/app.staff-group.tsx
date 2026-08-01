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
import {
  StaffGroupForm,
  StaffGroupListItem,
  type StaffGroupWithCount,
} from '../components/StaffGroupComponents';
import type { Route } from './+types/app.staff-group';

// Loader - Fetch all staff groups
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

  // Fetch all staff groups for this shop with staff count
  const staffGroups = await prisma.staffGroup.findMany({
    where: { shopId: shop.id },
    include: {
      _count: {
        select: { staffs: true },
      },
    },
    orderBy: { id: 'desc' },
  });

  return { staffGroups, shopId: shop.id };
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
    const staffGroupId = getInt(formData, 'staffGroupId');
    await prisma.staffGroup.delete({
      where: { id: staffGroupId! },
    });
    return { success: true, message: 'Staff group deleted successfully' };
  }

  // CREATE or UPDATE
  const staffGroupId = getString(formData, 'staffGroupId');
  const name = getString(formData, 'name') || '';
  const slug = getString(formData, 'slug') || '';

  const staffGroupData = {
    name,
    slug,
    shopId: shop.id,
  };

  if (staffGroupId && staffGroupId !== 'new') {
    // UPDATE
    await prisma.staffGroup.update({
      where: { id: parseInt(staffGroupId) },
      data: staffGroupData,
    });
    return {
      success: true,
      message: 'Staff group updated successfully',
      clear: true,
    };
  } else {
    // CREATE
    await prisma.staffGroup.create({
      data: staffGroupData,
    });
    return {
      success: true,
      message: 'Staff group created successfully',
      clear: true,
    };
  }
};

export default function StaffGroupPage() {
  const { staffGroups } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const fetcher = useFetcher<{ success?: boolean; message?: string }>();
  const shopify = useAppBridge();

  const [editingStaffGroup, setEditingStaffGroup] =
    useState<StaffGroupWithCount | null>(null);
  const [formKey, setFormKey] = useState(0);

  const isSubmitting = navigation.state === 'submitting';

  // Show toast notification on success
  useEffect(() => {
    if (actionData && 'success' in actionData && actionData.success) {
      if (actionData.message) shopify.toast.show(actionData.message);

      // Clear form after successful creation
      if ('clear' in actionData && actionData.clear) {
        setEditingStaffGroup(null);
        setFormKey((prev) => prev + 1);
      }
    }
  }, [actionData, shopify]);

  // Show toast for delete actions
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.message) {
      shopify.toast.show(fetcher.data.message);
    }
  }, [fetcher.data, shopify]);

  const handleEdit = (staffGroup: StaffGroupWithCount) => {
    setEditingStaffGroup(staffGroup);
  };

  const handleDelete = (staffGroupId: number) => {
    const formData = new FormData();
    formData.append('_action', 'delete');
    formData.append('staffGroupId', String(staffGroupId));
    fetcher.submit(formData, { method: 'post' });
  };

  const handleCancel = () => {
    setEditingStaffGroup(null);
    setFormKey((prev) => prev + 1);
  };

  const handleSubmit = () => {
    const form = document.getElementById(
      'staff-group-form'
    ) as HTMLFormElement | null;
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
      heading={editingStaffGroup ? 'Edit Staff Group' : 'Add Staff Group'}
    >
      <br />
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
        {editingStaffGroup ? 'Update Staff Group' : 'Save Staff Group'}
      </s-button>

      <Form method="post" id="staff-group-form" key={formKey}>
        <input
          type="hidden"
          name="staffGroupId"
          value={editingStaffGroup?.id || 'new'}
        />

        <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
          {/* Left Column - Form */}
          <s-grid-item gridColumn="span 5">
            <s-section>
              <s-heading>Add Staff Group</s-heading>
              <StaffGroupForm formData={editingStaffGroup ?? undefined} />
            </s-section>
          </s-grid-item>

          {/* Right Column - Staff Group List */}
          <s-grid-item gridColumn="span 7">
            <s-section heading={`Staff Groups (${staffGroups.length})`}>
              <s-paragraph>
                Organize your staff into groups for better management
              </s-paragraph>

              <s-section padding="none">
                <s-table>
                  <s-table-header-row>
                    <s-table-header>Category name</s-table-header>
                    <s-table-header>Slug</s-table-header>
                    <s-table-header>Services</s-table-header>
                    <s-table-header>Actions</s-table-header>
                  </s-table-header-row>

                  <s-table-body>
                    {staffGroups.length === 0 ? (
                      <s-table-row>
                        <s-table-cell>
                          <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <s-text color="subdued">
                              No staff groups yet. Create your first staff group
                              to get started.
                            </s-text>
                          </div>
                        </s-table-cell>
                      </s-table-row>
                    ) : (
                      staffGroups.map((staffGroup: StaffGroupWithCount) => (
                        <StaffGroupListItem
                          key={staffGroup.id}
                          staffGroup={staffGroup}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </s-table-body>
                </s-table>
              </s-section>
            </s-section>
          </s-grid-item>
        </s-grid>
      </Form>
    </s-page>
  );
}

export const headers: Route.HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
