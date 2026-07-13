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
import { useWidgetSettings } from '../hooks/useWidgetSettings';
import { useNotificationSettings } from '../hooks/useNotificationSettings';
import {
  SettingsTabs,
  GeneralConfigTab,
  WidgetStyleTab,
  NotificationsTab,
} from '../components/Settings';

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  let shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
    include: { settings: true },
  });

  if (!shop) {
    shop = await prisma.shop.create({
      data: {
        domain: session.shop,
        accessToken: session.accessToken,
      },
      include: { settings: true },
    });
  }

  return { shop, settings: shop.settings || null };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    return { error: 'Shop not found' };
  }

  const widgetSettings = formData.get('widgetSettings');
  const widgetSettingsData = widgetSettings ? JSON.parse(widgetSettings) : null;

  const customerNotificationSettings = formData.get(
    'customerNotificationSettings'
  );
  const customerNotificationData = customerNotificationSettings
    ? JSON.parse(customerNotificationSettings)
    : null;

  const ownerNotificationSettings = formData.get('ownerNotificationSettings');
  const ownerNotificationData = ownerNotificationSettings
    ? JSON.parse(ownerNotificationSettings)
    : null;

  const shopSettingsData = {
    companyName: formData.get('companyName') || null,
    adminEmail: formData.get('adminEmail') || null,
    additionalEmails: formData.get('additionalEmails') || null,
    refundOnBookingCancel: formData.get('refundOnBookingCancel') === 'on',
  };

  await prisma.settings.upsert({
    where: { shopId: shop.id },
    create: {
      shopId: shop.id,
      weekStartsOn: formData.get('weekStartsOn') || 'Sunday',
      timezone: formData.get('timeZone') || 'Asia/Dhaka',
      dateFormat:
        formData.get('dateFormat') || 'Default (Eg: Sun, 31 Dec 2023)',
      timeFormat: formData.get('timeFormat') || '12-hour format (Eg: 2 PM)',
      cancellationPolicy:
        formData.get('cancellationPolicy') || 'Strict-48 hours notice',
      slotReservationTime: formData.get('slotReservationTime') || '5 min',
      bookingRedirection: formData.get('bookingRedirection') || 'Cart page',
      paymentStatus: formData.get('paymentStatus') || 'Paid',
      universalBookingLink: formData.get('universalBookingLink') === 'on',
      widgetSettings: widgetSettingsData,
      customerNotificationSettings: customerNotificationData,
      ownerNotificationSettings: ownerNotificationData,
      shopSetting: shopSettingsData,
    },
    update: {
      weekStartsOn: formData.get('weekStartsOn') || 'Sunday',
      timezone: formData.get('timeZone') || 'Asia/Dhaka',
      dateFormat:
        formData.get('dateFormat') || 'Default (Eg: Sun, 31 Dec 2023)',
      timeFormat: formData.get('timeFormat') || '12-hour format (Eg: 2 PM)',
      cancellationPolicy:
        formData.get('cancellationPolicy') || 'Strict-48 hours notice',
      slotReservationTime: formData.get('slotReservationTime') || '5 min',
      bookingRedirection: formData.get('bookingRedirection') || 'Cart page',
      paymentStatus: formData.get('paymentStatus') || 'Paid',
      universalBookingLink: formData.get('universalBookingLink') === 'on',
      widgetSettings: widgetSettingsData,
      customerNotificationSettings: customerNotificationData,
      ownerNotificationSettings: ownerNotificationData,
      shopSetting: shopSettingsData,
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
  const { settings } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const shopify = useAppBridge();

  const [activeTab, setActiveTab] = useState(0);
  const widgetSettings = useWidgetSettings(settings);
  const notificationSettings = useNotificationSettings(settings);

  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (actionData?.success) {
      shopify.toast.show(actionData.message);
    }
  }, [actionData, shopify]);

  const handleSubmit = () => {
    document.getElementById('settings-form')?.requestSubmit();
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
            <GeneralConfigTab widgetSettings={widgetSettings} />
          </div>

          <div className={activeTab === 1 ? 'block' : 'hidden'}>
            <WidgetStyleTab widgetSettings={widgetSettings} />
          </div>

          <div className={activeTab === 2 ? 'block' : 'hidden'}>
            <NotificationsTab
              notificationSettings={notificationSettings}
              widgetSettings={widgetSettings}
            />
          </div>
        </s-stack>
      </Form>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
