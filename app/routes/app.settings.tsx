import { useState, useEffect } from 'react';
import {
  Form,
  useLoaderData,
  useActionData,
  useNavigation,
} from 'react-router';
import { useAppBridge } from '@shopify/app-bridge-react';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { authenticate } from '../shopify.server';
import prisma from '../db.server';
import { getJSON, getString } from '../utils/formData';
import type { Prisma } from '@prisma/client';
import { useWidgetSettings } from '../hooks/useWidgetSettings';
import { useNotificationSettings } from '../hooks/useNotificationSettings';
import { useHolidaySettings } from '../hooks/useHolidaySettings';
import { useEmailTemplateSettings } from '../hooks/useEmailTemplateSettings';
import {
  SettingsTabs,
  GeneralConfigTab,
  WidgetStyleTab,
  NotificationsTab,
} from '../components/Settings';
import type {
  CustomerNotificationSettings,
  EmailTemplates,
  HolidaySettings,
  OwnerNotificationSettings,
  ShopSetting,
  WidgetSettings,
} from '../types/settings';
import type { Route } from './+types/app.settings';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { session } = await authenticate.admin(request);

  let shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
    include: { settings: true },
  });

  if (!shop) {
    shop = await prisma.shop.create({
      data: {
        domain: session.shop,
        accessToken: session.accessToken!,
      },
      include: { settings: true },
    });
  }

  const previewService = await prisma.service.findFirst({
    where: { shopId: shop.id, status: 'active' },
    orderBy: { createdAt: 'asc' },
    select: { name: true },
  });

  const previewStaff = await prisma.staff.findMany({
    where: { shopId: shop.id, status: 'active' },
    take: 2,
    orderBy: { menuOrderBy: 'asc' },
    select: { name: true, photoUrl: true },
  });

  return {
    shop,
    settings: shop.settings || null,
    previewService,
    previewStaff,
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    return { error: 'Shop not found' };
  }

  const widgetSettingsData = getJSON<WidgetSettings>(
    formData,
    'widgetSettings'
  );
  const customerNotificationData = getJSON<CustomerNotificationSettings>(
    formData,
    'customerNotificationSettings'
  );
  const ownerNotificationData = getJSON<OwnerNotificationSettings>(
    formData,
    'ownerNotificationSettings'
  );
  const holidaySettingsData = getJSON<HolidaySettings>(
    formData,
    'holidaySettings'
  );
  const emailTemplatesData = getJSON<EmailTemplates>(
    formData,
    'emailTemplates'
  );

  const shopSettingsData: ShopSetting = {
    companyName: getString(formData, 'companyName') || null,
    adminEmail: getString(formData, 'adminEmail') || null,
    additionalEmails: getString(formData, 'additionalEmails') || null,
    refundOnBookingCancel:
      getString(formData, 'refundOnBookingCancel') === 'on',
  };

  // Prisma's JSON input types require an index signature our domain interfaces
  // don't have; these values are always plain JSON-serializable objects here.
  const widgetSettingsJson = (widgetSettingsData ?? undefined) as
    | Prisma.InputJsonValue
    | undefined;
  const customerNotificationJson = (customerNotificationData ?? undefined) as
    | Prisma.InputJsonValue
    | undefined;
  const ownerNotificationJson = (ownerNotificationData ?? undefined) as
    | Prisma.InputJsonValue
    | undefined;
  const shopSettingJson = shopSettingsData as unknown as Prisma.InputJsonValue;
  const holidaySettingsJson = (holidaySettingsData ?? undefined) as
    | Prisma.InputJsonValue
    | undefined;
  const emailTemplatesJson = (emailTemplatesData ?? undefined) as
    | Prisma.InputJsonValue
    | undefined;

  await prisma.settings.upsert({
    where: { shopId: shop.id },
    create: {
      shopId: shop.id,
      weekStartsOn: getString(formData, 'weekStartsOn') || 'Sunday',
      timezone: getString(formData, 'timeZone') || 'Asia/Dhaka',
      dateFormat:
        getString(formData, 'dateFormat') || 'Default (Eg: Sun, 31 Dec 2023)',
      timeFormat:
        getString(formData, 'timeFormat') || '12-hour format (Eg: 2 PM)',
      cancellationPolicy:
        getString(formData, 'cancellationPolicy') || 'Strict-48 hours notice',
      slotReservationTime:
        getString(formData, 'slotReservationTime') || '5 min',
      bookingRedirection:
        getString(formData, 'bookingRedirection') || 'Cart page',
      paymentStatus: getString(formData, 'paymentStatus') || 'Paid',
      universalBookingLink:
        getString(formData, 'universalBookingLink') === 'on',
      widgetSettings: widgetSettingsJson,
      customerNotificationSettings: customerNotificationJson,
      ownerNotificationSettings: ownerNotificationJson,
      shopSetting: shopSettingJson,
      holidaySettings: holidaySettingsJson,
      emailTemplates: emailTemplatesJson,
    },
    update: {
      weekStartsOn: getString(formData, 'weekStartsOn') || 'Sunday',
      timezone: getString(formData, 'timeZone') || 'Asia/Dhaka',
      dateFormat:
        getString(formData, 'dateFormat') || 'Default (Eg: Sun, 31 Dec 2023)',
      timeFormat:
        getString(formData, 'timeFormat') || '12-hour format (Eg: 2 PM)',
      cancellationPolicy:
        getString(formData, 'cancellationPolicy') || 'Strict-48 hours notice',
      slotReservationTime:
        getString(formData, 'slotReservationTime') || '5 min',
      bookingRedirection:
        getString(formData, 'bookingRedirection') || 'Cart page',
      paymentStatus: getString(formData, 'paymentStatus') || 'Paid',
      universalBookingLink:
        getString(formData, 'universalBookingLink') === 'on',
      widgetSettings: widgetSettingsJson,
      customerNotificationSettings: customerNotificationJson,
      ownerNotificationSettings: ownerNotificationJson,
      shopSetting: shopSettingJson,
      holidaySettings: holidaySettingsJson,
      emailTemplates: emailTemplatesJson,
    },
  });

  return { success: true, message: 'Settings saved successfully' };
};

const TABS = [
  { id: 0, label: 'General Config' },
  { id: 1, label: 'Widget Style' },
  { id: 2, label: 'Notifications & Workflow' },
];

export default function SettingsPage() {
  const { settings, previewService, previewStaff } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const shopify = useAppBridge();

  const [activeTab, setActiveTab] = useState(0);
  const widgetSettings = useWidgetSettings(settings);
  const notificationSettings = useNotificationSettings(settings);
  const holidaySettings = useHolidaySettings(settings);
  const emailTemplateSettings = useEmailTemplateSettings(settings);

  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (
      actionData &&
      'success' in actionData &&
      actionData.success &&
      actionData.message
    ) {
      shopify.toast.show(actionData.message);
    }
  }, [actionData, shopify]);

  const handleSubmit = () => {
    (
      document.getElementById('settings-form') as HTMLFormElement | null
    )?.requestSubmit();
  };

  return (
    <s-page heading="Settings">
      <s-button
        slot="primary-action"
        variant="primary"
        onClick={handleSubmit}
        {...(isSubmitting ? { loading: true } : {})}
      >
        Save Settings
      </s-button>

      <Form method="post" id="settings-form">
        <s-stack gap="base">
          <div>
            <SettingsTabs
              tabs={TABS}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          <div className={activeTab === 0 ? 'block' : 'hidden'}>
            <GeneralConfigTab
              widgetSettings={widgetSettings}
              holidaySettings={holidaySettings}
              settings={settings}
              previewService={previewService}
              previewStaff={previewStaff}
            />
          </div>

          <div className={activeTab === 1 ? 'block' : 'hidden'}>
            <WidgetStyleTab
              widgetSettings={widgetSettings}
              previewService={previewService}
              previewStaff={previewStaff}
            />
          </div>

          <div className={activeTab === 2 ? 'block' : 'hidden'}>
            <NotificationsTab
              notificationSettings={notificationSettings}
              widgetSettings={widgetSettings}
              emailTemplateSettings={emailTemplateSettings}
              previewService={previewService}
              previewStaff={previewStaff}
            />
          </div>
        </s-stack>
      </Form>
    </s-page>
  );
}

export const headers: Route.HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
