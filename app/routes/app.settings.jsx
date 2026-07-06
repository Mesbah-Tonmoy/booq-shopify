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
import { CollapsibleCard } from 'app/components/CollapsibleCard';
import { WidgetPreview } from 'app/components/WidgetPreview';

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  // Find or create shop
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

  return {
    shop,
    settings: shop.settings || null,
  };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  // Get shop
  const shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    return { error: 'Shop not found' };
  }

  // Parse widget settings JSON
  const widgetSettings = formData.get('widgetSettings');
  const widgetSettingsData = widgetSettings ? JSON.parse(widgetSettings) : null;

  // Parse notification settings JSON
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

  // Parse shop settings to save in JSON
  const shopSettingsData = {
    companyName: formData.get('companyName') || null,
    adminEmail: formData.get('adminEmail') || null,
    additionalEmails: formData.get('additionalEmails') || null,
    refundOnBookingCancel: formData.get('refundOnBookingCancel') === 'on',
  };

  // Upsert general settings
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

const WorkingHoursSection = () => {
  const [schedule, setSchedule] = useState('Working hours (default)');

  const timeOptions = [
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM',
    '5:00 pm',
    '5:30 PM',
    '6:00 PM',
  ];

  return (
    <div className="flex flex-col gap-[10px] pt-2">
      {/* Top Part */}
      <div>
        <s-select
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        >
          <s-option value="Working hours (default)">
            Working hours (default)
          </s-option>
        </s-select>
        <div className="flex justify-between items-center mt-3">
          <s-text color="subdued">New Schedule</s-text>
          <s-button type="button" icon="plus">
            Create schedule
          </s-button>
        </div>
      </div>

      <hr className="border-none border-t border-[#E1E3E5] m-0" />

      {/* Weekly hours */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1">
            <s-icon type="clock" />
            <div className="flex items-center gap-1">
              <s-text type="strong" interestFor="weekly-hours-tooltip">
                Weekly hours
              </s-text>
              <s-tooltip id="weekly-hours-tooltip">
                Set when you are typically available for meetings
              </s-tooltip>
            </div>
          </div>
          <div className="flex border border-[#E1E3E5] rounded-[6px] overflow-hidden">
            <s-button type="button" icon="list-bulleted" variant="tertiary">
              List
            </s-button>
            <s-button type="button" icon="calendar" variant="tertiary">
              Calendar
            </s-button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              day: 'Mon',
              slots: [
                { start: '9:00 AM', end: '5:00 pm' },
                { start: '9:00 AM', end: '5:00 pm' },
              ],
            },
            { day: 'Tue', slots: [{ start: '9:00 AM', end: '5:00 pm' }] },
            { day: 'Wed', slots: [{ start: '9:00 AM', end: '5:00 pm' }] },
            { day: 'Thu', slots: [{ start: '9:00 AM', end: '5:00 pm' }] },
            { day: 'Sat', slots: [] },
            { day: 'Sun', slots: [] },
          ].map(({ day, slots }) => (
            <div key={day} className="flex items-start gap-2">
              <div className="min-w-[50px] py-[5px] px-2 bg-[#F6F6F7] rounded-[6px] text-center text-[14px] font-medium text-[#202223] border border-[#E1E3E5]">
                {day}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                {slots.length === 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="py-1.5 px-4 bg-[#F6F6F7] rounded-[6px] text-[#8C9196] text-[14px] w-[200px] border border-transparent">
                      Unavailable
                    </div>
                    <s-button
                      type="button"
                      icon="plus"
                      variant="tertiary"
                      accessibilityLabel="Add time slot"
                    />
                  </div>
                ) : (
                  slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-[130px]">
                        <s-select value={slot.start} onChange={() => {}}>
                          {timeOptions.map((t) => (
                            <s-option key={t} value={t}>
                              {t}
                            </s-option>
                          ))}
                        </s-select>
                      </div>
                      <span className="flex items-center text-[#8C9196]">
                        <s-icon type="menu-horizontal" />
                      </span>
                      <div className="w-[130px]">
                        <s-select value={slot.end} onChange={() => {}}>
                          {timeOptions.map((t) => (
                            <s-option key={t} value={t}>
                              {t}
                            </s-option>
                          ))}
                        </s-select>
                      </div>
                      <s-button
                        type="button"
                        icon="x"
                        variant="tertiary"
                        accessibilityLabel="Remove time slot"
                      />
                      {index === 0 && (
                        <s-button
                          type="button"
                          icon="plus"
                          variant="tertiary"
                          accessibilityLabel="Add time slot"
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-none border-t border-[#E1E3E5] my-2" />

      {/* Date-specific hours */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <s-icon type="calendar-list" />
            <s-text type="strong" interestFor="date-specific-hours-tooltip">
              Date-specific hours
            </s-text>
            <s-tooltip id="date-specific-hours-tooltip">
              Adjust hours for specific days
            </s-tooltip>
          </div>
          <s-button type="button" icon="plus" variant="primary">
            Hours
          </s-button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <div className="inline-block py-1.5 px-3 bg-[#F6F6F7] rounded-[6px] text-[13px] font-medium text-[#202223] mb-3 border border-[#E1E3E5]">
              2026
            </div>
            <div className="flex items-center gap-2">
              <div className="min-w-[90px] p-2 bg-[#F6F6F7] rounded-[6px] text-center text-[13px] text-[#202223] border border-transparent">
                August 28
              </div>
              <div className="py-2 px-4 bg-[#F6F6F7] rounded-[6px] text-[#8C9196] text-[13px] w-[160px] border border-transparent">
                Unavailable
              </div>
              <s-button
                type="button"
                icon="x"
                variant="tertiary"
                accessibilityLabel="Remove date-specific entry"
              />
            </div>
          </div>

          <div>
            <div className="inline-block py-1.5 px-3 bg-[#F6F6F7] rounded-[6px] text-[13px] font-medium text-[#202223] mb-3 border border-[#E1E3E5]">
              2027
            </div>
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="min-w-[90px] p-2 bg-[#F6F6F7] rounded-[6px] text-center text-[13px] text-[#202223] border border-transparent">
                    Apr 22
                  </div>
                  <div className="py-2 px-4 bg-[#F6F6F7] rounded-[6px] text-[#8C9196] text-[13px] w-[160px] border border-transparent">
                    Unavailable
                  </div>
                  <s-button
                    type="button"
                    icon="x"
                    variant="tertiary"
                    accessibilityLabel="Remove date-specific entry"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr className="border-none border-t border-[#E1E3E5] my-2" />

      {/* Time zone */}
      <div>
        <s-select
          label="Time zone"
          value="Eastern time (ET)"
          onChange={() => {}}
        >
          <s-option value="Eastern time (ET)">Eastern time (ET)</s-option>
        </s-select>
        <s-text color="subdued" className="mt-1 block">
          {"The timezone for this service's availability"}
        </s-text>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const { settings } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const shopify = useAppBridge();

  const [activeTab, setActiveTab] = useState(0);

  // Widget Settings State
  const widgetSettings = settings?.widgetSettings || {};
  const [dateTimePickerPosition, setDateTimePickerPosition] = useState(
    widgetSettings?.dateTimePickerPosition || 'before_add_to_cart'
  );
  const [hideEndTime, setHideEndTime] = useState(
    widgetSettings?.hideEndTime || false
  );
  const [hideSlotAvailabilityCount, setHideSlotAvailabilityCount] = useState(
    widgetSettings?.hideSlotAvailabilityCount || false
  );
  const [showPricing, setShowPricing] = useState(
    widgetSettings?.showPricing !== undefined
      ? widgetSettings.showPricing
      : true
  );
  const [showStaffPhotos, setShowStaffPhotos] = useState(
    widgetSettings?.showStaffPhotos !== undefined
      ? widgetSettings.showStaffPhotos
      : true
  );
  const [showDuration, setShowDuration] = useState(
    widgetSettings?.showDuration !== undefined
      ? widgetSettings.showDuration
      : true
  );
  const [showReviews, setShowReviews] = useState(
    widgetSettings?.showReviews !== undefined
      ? widgetSettings.showReviews
      : true
  );

  // Customer Notification Settings State
  const customerNotifications = settings?.customerNotificationSettings || {};
  const [bookingConfirmationEmail, setBookingConfirmationEmail] = useState(
    customerNotifications?.bookingConfirmationEmail !== undefined
      ? customerNotifications.bookingConfirmationEmail
      : true
  );
  const [reminderEmails, setReminderEmails] = useState(
    customerNotifications?.reminderEmails !== undefined
      ? customerNotifications.reminderEmails
      : true
  );
  const [cancellationEmail, setCancellationEmail] = useState(
    customerNotifications?.cancellationEmail !== undefined
      ? customerNotifications.cancellationEmail
      : true
  );
  const [reminderTiming, setReminderTiming] = useState(
    customerNotifications?.reminderTiming || '24'
  );

  // Store Owner Notification Settings State
  const ownerNotifications = settings?.ownerNotificationSettings || {};
  const [newBookingAlerts, setNewBookingAlerts] = useState(
    ownerNotifications?.newBookingAlerts !== undefined
      ? ownerNotifications.newBookingAlerts
      : true
  );
  const [noShowAlerts, setNoShowAlerts] = useState(
    ownerNotifications?.noShowAlerts || false
  );
  const [cancellationAlerts, setCancellationAlerts] = useState(
    ownerNotifications?.cancellationAlerts !== undefined
      ? ownerNotifications.cancellationAlerts
      : true
  );
  const [emailDigestFrequency, setEmailDigestFrequency] = useState(
    ownerNotifications?.emailDigestFrequency || 'daily'
  );

  const [notificationExpanded, setNotificationExpanded] = useState({
    customer: true,
    owner: true,
  });

  const isSubmitting = navigation.state === 'submitting';

  // Show toast notification on success
  useEffect(() => {
    if (actionData?.success) {
      shopify.toast.show(actionData.message);
    }
  }, [actionData, shopify]);

  const tabs = [
    { id: 0, label: 'General Config' },
    { id: 1, label: 'Widget Style' },
    { id: 2, label: 'Notifications & Workflow' },
  ];

  const sections = [
    {
      id: 'workingHours',
      title: 'Schedules: Working hours (default)',
    },
    {
      id: 'holidays',
      title: 'Holidays',
    },
    {
      id: 'calendarSettings',
      title: 'Calendar settings',
    },
    {
      id: 'dateTimeFormats',
      title: 'Date & Time Formats',
    },
    {
      id: 'advancedSettings',
      title: 'Advanced settings',
    },
    {
      id: 'shopSettings',
      title: 'Shop Settings',
    },
  ];

  const handleSubmit = () => {
    const form = document.getElementById('settings-form');
    if (form) {
      form.requestSubmit();
    }
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
          {/* Tabs */}
          <div>
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <s-button
                  key={tab.id}
                  type="button"
                  variant={activeTab === tab.id ? 'secondary' : 'tertiary'}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </s-button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className={activeTab === 0 ? 'block' : 'hidden'}>
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column - Settings Sections */}
              <div className="flex flex-col gap-4">
                {sections.map((section) => (
                  <CollapsibleCard
                    key={section.id}
                    header={<s-heading>{section.title}</s-heading>}
                  >
                    <s-stack direction="block" gap="base">
                      {section.id === 'workingHours' && <WorkingHoursSection />}
                    </s-stack>
                  </CollapsibleCard>
                ))}
              </div>

              {/* Right Column - Widget Setting Preview */}
              <WidgetPreview
                dateTimePickerPosition={dateTimePickerPosition}
                hideEndTime={hideEndTime}
                hideSlotAvailabilityCount={hideSlotAvailabilityCount}
                showPricing={showPricing}
                showStaffPhotos={showStaffPhotos}
                showDuration={showDuration}
                showReviews={showReviews}
              />
            </div>
          </div>

          <div className={activeTab === 1 ? 'block' : 'hidden'}>
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column - Widget Settings */}
              <div className="flex flex-col gap-4">
                {/* Widget Positioning */}
                <s-section heading="Widget Positioning" padding="base">
                  <s-form-field>
                    <s-select
                      label="Date Time Picker Position"
                      value={dateTimePickerPosition}
                      onChange={(e) =>
                        setDateTimePickerPosition(e.target.value)
                      }
                    >
                      <s-option value="before_add_to_cart">
                        Default (Before add to cart button)
                      </s-option>
                      <s-option value="after_add_to_cart">
                        After add to cart button
                      </s-option>
                      <s-option value="custom">Custom position</s-option>
                    </s-select>
                    <s-text slot="helper-text" color="subdued">
                      Choose where to position the booking widget
                    </s-text>
                  </s-form-field>

                  <div className="mt-4">
                    <s-checkbox
                      checked={hideEndTime}
                      onChange={(e) => setHideEndTime(e.target.checked)}
                      label="Hide End Time"
                      details="Display only start time for the each slot (e.g., hotel check-ins"
                    />
                  </div>

                  <div className="mt-4">
                    <s-checkbox
                      checked={hideSlotAvailabilityCount}
                      onChange={(e) =>
                        setHideSlotAvailabilityCount(e.target.checked)
                      }
                      label="Hide Slot Availability Count"
                      details="Hide number of remaining slots from customers"
                    />
                  </div>
                </s-section>

                {/* Functional Controls */}
                <div className="bg-white rounded-lg border border-[#e1e3e5] p-6">
                  <s-heading variant="heading-md" className="mb-4">
                    Functional Controls
                  </s-heading>

                  <div className="flex flex-col gap-4">
                    <s-checkbox
                      checked={showPricing}
                      onChange={(e) => setShowPricing(e.target.checked)}
                      label="Show pricing"
                      details="Display service Prices"
                    />

                    <s-checkbox
                      checked={showStaffPhotos}
                      onChange={(e) => setShowStaffPhotos(e.target.checked)}
                      label="Show staff photos"
                      details="Display staff profile pictures"
                    />

                    <s-checkbox
                      checked={showDuration}
                      onChange={(e) => setShowDuration(e.target.checked)}
                      label="Show duration"
                      details="Display appointment duration"
                    />

                    <s-checkbox
                      checked={showReviews}
                      onChange={(e) => setShowReviews(e.target.checked)}
                      label="Show reviews"
                      details="Display customer reviews"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Widget Preview (same as before) */}
              <WidgetPreview
                dateTimePickerPosition={dateTimePickerPosition}
                hideEndTime={hideEndTime}
                hideSlotAvailabilityCount={hideSlotAvailabilityCount}
                showPricing={showPricing}
                showStaffPhotos={showStaffPhotos}
                showDuration={showDuration}
                showReviews={showReviews}
              />
            </div>

            {/* Hidden inputs for widget settings */}
            <input
              type="hidden"
              name="widgetSettings"
              value={JSON.stringify({
                dateTimePickerPosition,
                hideEndTime,
                hideSlotAvailabilityCount,
                showPricing,
                showStaffPhotos,
                showDuration,
                showReviews,
              })}
            />
          </div>

          <div className={activeTab === 2 ? 'block' : 'hidden'}>
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column - Notification Settings */}
              <div className="flex flex-col gap-4">
                {/* Customer Notifications */}
                <div className="bg-white rounded-lg border border-[#e1e3e5] p-6">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setNotificationExpanded((prev) => ({
                        ...prev,
                        customer: !prev.customer,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setNotificationExpanded((prev) => ({
                          ...prev,
                          customer: !prev.customer,
                        }));
                      }
                    }}
                    className={`flex justify-between items-center cursor-pointer ${
                      notificationExpanded.customer ? 'mb-4' : 'mb-0'
                    }`}
                  >
                    <s-heading variant="heading-md">
                      Customer notifications
                    </s-heading>
                    <s-icon
                      type={
                        notificationExpanded.customer
                          ? 'chevron-down'
                          : 'chevron-up'
                      }
                    ></s-icon>
                  </div>

                  {notificationExpanded.customer && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <s-checkbox
                          checked={bookingConfirmationEmail}
                          onChange={(e) =>
                            setBookingConfirmationEmail(e.target.checked)
                          }
                          label="Booking confirmation email"
                          details="Send confirmation email when booking in created"
                        />
                      </div>

                      <div>
                        <s-checkbox
                          checked={reminderEmails}
                          onChange={(e) => setReminderEmails(e.target.checked)}
                          label="Reminder emails"
                          details="send reminder emails before appoinment"
                        />
                      </div>

                      <div>
                        <s-checkbox
                          checked={cancellationEmail}
                          onChange={(e) =>
                            setCancellationEmail(e.target.checked)
                          }
                          label="Cancellation email"
                          details="Send email when book in cancelled"
                        />
                      </div>

                      <div className="mt-2">
                        <s-form-field>
                          <s-text-field
                            label="Reminder timing (hours before)"
                            type="number"
                            value={reminderTiming}
                            onChange={(e) => setReminderTiming(e.target.value)}
                            min="1"
                          />
                        </s-form-field>
                      </div>
                    </div>
                  )}
                </div>

                {/* Store Owner Notifications */}
                <div className="bg-white rounded-lg border border-[#e1e3e5] p-6">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setNotificationExpanded((prev) => ({
                        ...prev,
                        owner: !prev.owner,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setNotificationExpanded((prev) => ({
                          ...prev,
                          owner: !prev.owner,
                        }));
                      }
                    }}
                    className={`flex justify-between items-center cursor-pointer ${
                      notificationExpanded.owner ? 'mb-4' : 'mb-0'
                    }`}
                  >
                    <s-heading variant="heading-md">
                      Store Owner Notifications
                    </s-heading>
                    <s-icon
                      type={
                        notificationExpanded.owner
                          ? 'chevron-down'
                          : 'chevron-up'
                      }
                    />
                  </div>

                  {notificationExpanded.owner && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <s-checkbox
                          checked={newBookingAlerts}
                          onChange={(e) =>
                            setNewBookingAlerts(e.target.checked)
                          }
                          label="New booking alerts"
                          details="Get notified about new bookings"
                        />
                      </div>

                      <div>
                        <s-checkbox
                          checked={noShowAlerts}
                          onChange={(e) => setNoShowAlerts(e.target.checked)}
                          label="No-show alerts"
                          details="Get notified when customers don't show up"
                        />
                      </div>

                      <div>
                        <s-checkbox
                          checked={cancellationAlerts}
                          onChange={(e) =>
                            setCancellationAlerts(e.target.checked)
                          }
                          label="Cancellation alerts"
                          details="Get notified about cancelled bookings"
                        />
                      </div>

                      <div className="mt-2">
                        <s-form-field>
                          <s-select
                            label="Email digest frequency"
                            value={emailDigestFrequency}
                            onChange={(e) =>
                              setEmailDigestFrequency(e.target.value)
                            }
                          >
                            <s-option value="daily">Daily</s-option>
                            <s-option value="weekly">Weekly</s-option>
                            <s-option value="monthly">Monthly</s-option>
                            <s-option value="never">Never</s-option>
                          </s-select>
                          <s-text slot="helper-text" color="subdued">
                            How often to receive summary emails
                          </s-text>
                        </s-form-field>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Widget Preview (same as Widget Settings tab) */}
              <WidgetPreview
                dateTimePickerPosition={dateTimePickerPosition}
                hideEndTime={hideEndTime}
                hideSlotAvailabilityCount={hideSlotAvailabilityCount}
                showPricing={showPricing}
                showStaffPhotos={showStaffPhotos}
                showDuration={showDuration}
                showReviews={showReviews}
              />
            </div>

            {/* Hidden inputs for notification settings */}
            <input
              type="hidden"
              name="customerNotificationSettings"
              value={JSON.stringify({
                bookingConfirmationEmail,
                reminderEmails,
                cancellationEmail,
                reminderTiming,
              })}
            />
            <input
              type="hidden"
              name="ownerNotificationSettings"
              value={JSON.stringify({
                newBookingAlerts,
                noShowAlerts,
                cancellationAlerts,
                emailDigestFrequency,
              })}
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
