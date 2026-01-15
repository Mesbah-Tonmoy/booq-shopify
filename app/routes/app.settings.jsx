import { useState, useEffect } from "react";
import { Form, useLoaderData, useActionData, useNavigation } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

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
    return { error: "Shop not found" };
  }

  // Parse widget settings JSON
  const widgetSettings = formData.get("widgetSettings");
  const widgetSettingsData = widgetSettings ? JSON.parse(widgetSettings) : null;

  // Parse notification settings JSON
  const customerNotificationSettings = formData.get("customerNotificationSettings");
  const customerNotificationData = customerNotificationSettings ? JSON.parse(customerNotificationSettings) : null;

  const ownerNotificationSettings = formData.get("ownerNotificationSettings");
  const ownerNotificationData = ownerNotificationSettings ? JSON.parse(ownerNotificationSettings) : null;

  // Parse shop settings to save in JSON
  const shopSettingsData = {
    companyName: formData.get("companyName") || null,
    adminEmail: formData.get("adminEmail") || null,
    additionalEmails: formData.get("additionalEmails") || null,
    refundOnBookingCancel: formData.get("refundOnBookingCancel") === "on",
  };

  // Upsert general settings
  await prisma.settings.upsert({
    where: { shopId: shop.id },
    create: {
      shopId: shop.id,
      weekStartsOn: formData.get("weekStartsOn") || "Sunday",
      timezone: formData.get("timeZone") || "Asia/Dhaka",
      dateFormat: formData.get("dateFormat") || "Default (Eg: Sun, 31 Dec 2023)",
      timeFormat: formData.get("timeFormat") || "12-hour format (Eg: 2 PM)",
      cancellationPolicy: formData.get("cancellationPolicy") || "Strict-48 hours notice",
      slotReservationTime: formData.get("slotReservationTime") || "5 min",
      bookingRedirection: formData.get("bookingRedirection") || "Cart page",
      paymentStatus: formData.get("paymentStatus") || "Paid",
      universalBookingLink: formData.get("universalBookingLink") === "on",
      widgetSettings: widgetSettingsData,
      customerNotificationSettings: customerNotificationData,
      ownerNotificationSettings: ownerNotificationData,
      shopSetting: shopSettingsData,
    },
    update: {
      weekStartsOn: formData.get("weekStartsOn") || "Sunday",
      timezone: formData.get("timeZone") || "Asia/Dhaka",
      dateFormat: formData.get("dateFormat") || "Default (Eg: Sun, 31 Dec 2023)",
      timeFormat: formData.get("timeFormat") || "12-hour format (Eg: 2 PM)",
      cancellationPolicy: formData.get("cancellationPolicy") || "Strict-48 hours notice",
      slotReservationTime: formData.get("slotReservationTime") || "5 min",
      bookingRedirection: formData.get("bookingRedirection") || "Cart page",
      paymentStatus: formData.get("paymentStatus") || "Paid",
      universalBookingLink: formData.get("universalBookingLink") === "on",
      widgetSettings: widgetSettingsData,
      customerNotificationSettings: customerNotificationData,
      ownerNotificationSettings: ownerNotificationData,
      shopSetting: shopSettingsData,
    },
  });

  return { success: true, message: "Settings saved successfully" };
};

export default function Settings() {
  const { shop, settings } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const shopify = useAppBridge();

  const [activeTab, setActiveTab] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    dateTime: true,
    booking: true,
    shop: true,
  });

  // Widget Settings State
  const widgetSettings = settings?.widgetSettings || {};
  const [dateTimePickerPosition, setDateTimePickerPosition] = useState(widgetSettings?.dateTimePickerPosition || "before_add_to_cart");
  const [hideEndTime, setHideEndTime] = useState(widgetSettings?.hideEndTime || false);
  const [hideSlotAvailabilityCount, setHideSlotAvailabilityCount] = useState(widgetSettings?.hideSlotAvailabilityCount || false);
  const [showPricing, setShowPricing] = useState(widgetSettings?.showPricing !== undefined ? widgetSettings.showPricing : true);
  const [showStaffPhotos, setShowStaffPhotos] = useState(widgetSettings?.showStaffPhotos !== undefined ? widgetSettings.showStaffPhotos : true);
  const [showDuration, setShowDuration] = useState(widgetSettings?.showDuration !== undefined ? widgetSettings.showDuration : true);
  const [showReviews, setShowReviews] = useState(widgetSettings?.showReviews !== undefined ? widgetSettings.showReviews : true);

  // Customer Notification Settings State
  const customerNotifications = settings?.customerNotificationSettings || {};
  const [bookingConfirmationEmail, setBookingConfirmationEmail] = useState(customerNotifications?.bookingConfirmationEmail !== undefined ? customerNotifications.bookingConfirmationEmail : true);
  const [reminderEmails, setReminderEmails] = useState(customerNotifications?.reminderEmails !== undefined ? customerNotifications.reminderEmails : true);
  const [cancellationEmail, setCancellationEmail] = useState(customerNotifications?.cancellationEmail !== undefined ? customerNotifications.cancellationEmail : true);
  const [reminderTiming, setReminderTiming] = useState(customerNotifications?.reminderTiming || "24");

  // Store Owner Notification Settings State
  const ownerNotifications = settings?.ownerNotificationSettings || {};
  const [newBookingAlerts, setNewBookingAlerts] = useState(ownerNotifications?.newBookingAlerts !== undefined ? ownerNotifications.newBookingAlerts : true);
  const [noShowAlerts, setNoShowAlerts] = useState(ownerNotifications?.noShowAlerts || false);
  const [cancellationAlerts, setCancellationAlerts] = useState(ownerNotifications?.cancellationAlerts !== undefined ? ownerNotifications.cancellationAlerts : true);
  const [emailDigestFrequency, setEmailDigestFrequency] = useState(ownerNotifications?.emailDigestFrequency || "daily");

  const [notificationExpanded, setNotificationExpanded] = useState({
    customer: true,
    owner: true,
  });

  const isSubmitting = navigation.state === "submitting";

  // Show toast notification on success
  useEffect(() => {
    if (actionData?.success) {
      shopify.toast.show(actionData.message);
    }
  }, [actionData, shopify]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const tabs = [
    { id: 0, label: "General Settings" },
    { id: 1, label: "Widget Settings" },
    { id: 2, label: "Notification Settings" },
  ];

  const sections = [
    {
      id: "dateTime",
      title: "Date & Time Formats",
    },
    {
      id: "shop",
      title: "Shop Settings",
    },
    {
      id: "booking",
      title: "Booking Settings",
    },
  ];

  const handleSubmit = () => {
    const form = document.getElementById("settings-form");
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

        {/* Tabs */}
        <div style={{ padding: "0.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "0.5rem 1rem",
                  background: activeTab === tab.id ? "#E3E3E3" : "transparent",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "14px",
                  color: "#303030",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ padding: "0.5rem", display: activeTab === 0 ? "block" : "none" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px"
          }}>
            {/* Left Column - Settings Sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {sections.map((section) => (
                <div
                  key={section.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e1e3e5",
                    padding: "1rem",
                  }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSection(section.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleSection(section.id);
                      }
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      marginBottom: expandedSections[section.id] ? "1rem" : "0",
                    }}
                  >
                    <s-heading>{section.title}</s-heading>
                    <s-icon type={expandedSections[section.id] ? "chevron-down" : "chevron-up"}></s-icon>
                  </div>

                  <div style={{ display: expandedSections[section.id] ? "block" : "none" }}>
                    <s-stack direction="block" gap="base">
                      {section.id === "dateTime" && (
                        <>
                          <s-form-field>
                            <s-select
                              name="weekStartsOn"
                              label="Week Starts On"
                              value={settings?.weekStartsOn || "Sunday"}
                            >
                              <s-option value="Sunday">Sunday</s-option>
                              <s-option value="Monday">Monday</s-option>
                              <s-option value="Saturday">Saturday</s-option>
                            </s-select>
                          </s-form-field>

                          <s-form-field>
                            <s-select
                              name="timeZone"
                              label="Time Zone"
                              value={settings?.timezone || "Asia/Dhaka"}
                            >
                              <s-option value="Antarctica - Antarctica/DumontDUrville">Antarctica - Antarctica/DumontDUrville</s-option>
                              <s-option value="Asia/Dhaka">Asia/Dhaka (Bangladesh Standard Time)</s-option>
                              <s-option value="America/New_York">America/New York (EST)</s-option>
                              <s-option value="America/Los_Angeles">America/Los Angeles (PST)</s-option>
                              <s-option value="Europe/London">Europe/London (GMT)</s-option>
                              <s-option value="Asia/Tokyo">Asia/Tokyo (JST)</s-option>
                            </s-select>
                          </s-form-field>

                          <s-form-field>
                            <s-select
                              name="dateFormat"
                              label="Date Format"
                              value={settings?.dateFormat || "Default (Eg: Sun, 31 Dec 2023)"}
                            >
                              <s-option value="Default (Eg: Sun, 31 Dec 2023)">Default (Eg: Sun, 31 Dec 2023)</s-option>
                              <s-option value="MM/DD/YYYY">MM/DD/YYYY (Eg: 12/31/2023)</s-option>
                              <s-option value="DD/MM/YYYY">DD/MM/YYYY (Eg: 31/12/2023)</s-option>
                              <s-option value="YYYY-MM-DD">YYYY-MM-DD (Eg: 2023-12-31)</s-option>
                            </s-select>
                          </s-form-field>

                          <s-form-field>
                            <s-select
                              name="timeFormat"
                              label="Time Format"
                              value={settings?.timeFormat || "12-hour format (Eg: 2 PM)"}
                            >
                              <s-option value="12-hour format (Eg: 2 PM)">12-hour format (Eg: 2 PM)</s-option>
                              <s-option value="24-hour format (Eg: 14:00)">24-hour format (Eg: 14:00)</s-option>
                            </s-select>
                          </s-form-field>
                        </>
                      )}

                      {section.id === "booking" && (
                        <>
                          <s-form-field>
                            <s-select
                              name="cancellationPolicy"
                              label="Cancellation policy"
                              value={settings?.cancellationPolicy || "Strict-48 hours notice"}
                            >
                              <s-option value="Strict-48 hours notice">Strict-48 hours notice</s-option>
                              <s-option value="Flexible-24 hours notice">Flexible-24 hours notice</s-option>
                              <s-option value="Moderate-72 hours notice">Moderate-72 hours notice</s-option>
                            </s-select>
                            <s-text slot="helper-text" color="subdued">
                              Set cancellation rules for after booking
                            </s-text>
                          </s-form-field>

                          <s-form-field>
                            <s-select
                              name="slotReservationTime"
                              label="Slot Reservation Time"
                              value={settings?.slotReservationTime || "5 min"}
                            >
                              <s-option value="5 min">5 min</s-option>
                              <s-option value="10 min">10 min</s-option>
                              <s-option value="15 min">15 min</s-option>
                              <s-option value="30 min">30 min</s-option>
                            </s-select>
                            <s-text slot="helper-text" color="subdued">
                              When a customer selects a time slot, it&apos;s temporarily reserved and unavailable to others until the booking is confirmed or the reservation expires
                            </s-text>
                          </s-form-field>

                          <s-grid gridTemplateColumns="1fr 1fr" gap="base">
                            <s-grid-item>
                              <s-form-field>
                                <s-select
                                  name="bookingRedirection"
                                  label="Booking Redirection"
                                  value={settings?.bookingRedirection || "Cart page"}
                                >
                                  <s-option value="No redirection">No redirection</s-option>
                                  <s-option value="Cart page">Cart page</s-option>
                                  <s-option value="Checkout page">Checkout page</s-option>
                                </s-select>
                                <s-text slot="helper-text" color="subdued">
                                  Where to redirect after booking
                                </s-text>
                              </s-form-field>
                            </s-grid-item>
                            <s-grid-item>
                              <s-form-field>
                                <s-select
                                  name="paymentStatus"
                                  label="Payment Status"
                                  value={settings?.paymentStatus || "Paid"}
                                >
                                  <s-option value="Paid">Paid</s-option>
                                  <s-option value="Pending">Pending</s-option>
                                  <s-option value="Unpaid">Unpaid</s-option>
                                </s-select>
                                <s-text slot="helper-text" color="subdued">
                                  Default payment status for bookings
                                </s-text>
                              </s-form-field>
                            </s-grid-item>
                          </s-grid>

                          <s-checkbox
                            name="universalBookingLink"
                            label="Universal Booking Link"
                            details="Enable to link your booking widget with any button in your store on any page. You can also share the link to redirect users to your booking widget."
                            checked={settings?.universalBookingLink ?? true}
                          />
                        </>
                      )}


                      {section.id === "shop" && (
                        <>
                          <s-form-field>
                            <s-text-field
                              name="companyName"
                              label="Shop Name"
                              defaultValue={settings?.shopSetting?.companyName || ""}
                            />
                          </s-form-field>

                          <s-form-field>
                            <s-text-field
                              name="adminEmail"
                              label="Admin Email"
                              type="email"
                              defaultValue={settings?.shopSetting?.adminEmail || ""}
                            />
                          </s-form-field>

                          <s-form-field>
                            <s-text-field
                              name="additionalEmails"
                              label="Add additional emails"
                              defaultValue={settings?.shopSetting?.additionalEmails || ""}
                            />
                            <s-text slot="helper-text" color="subdued">
                              All the booking related emails such as confirmation, cancellation, rescheduling, reminders etc are sent to admin email.
                            </s-text>
                          </s-form-field>
                        </>
                      )}
                    </s-stack>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Widget Setting Preview */}
            <div>
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e1e3e5",
                padding: "1.5rem",
              }}>
                <s-heading variant="heading-lg" style={{ marginBottom: "1.5rem" }}>Widget Setting</s-heading>

                {/* Product Widget Preview */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "2rem",
                  padding: "1rem",
                  backgroundColor: "#f6f6f7",
                  borderRadius: "8px",
                }}>
                  <div style={{
                    width: "180px",
                    height: "180px",
                    backgroundColor: "#e1e3e5",
                    borderRadius: "8px",
                    flexShrink: 0,
                  }}></div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ height: "24px", backgroundColor: "#d1d5db", borderRadius: "4px", width: "80%" }}></div>
                    <div style={{ height: "16px", backgroundColor: "#d1d5db", borderRadius: "4px", width: "40%" }}></div>
                    <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} style={{ fontSize: "20px", color: i < 5 ? "#fbbf24" : "#d1d5db" }}>★</div>
                      ))}
                    </div>
                    <div style={{ height: "16px", backgroundColor: "#d1d5db", borderRadius: "4px", width: "30%", marginTop: "4px" }}></div>
                    <div style={{ height: "16px", backgroundColor: "#d1d5db", borderRadius: "4px", width: "50%" }}></div>
                    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{
                        height: "40px",
                        backgroundColor: "#d1d5db",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "500",
                        color: "#6b7280",
                      }}>Add To Cart</div>
                      <div style={{
                        height: "40px",
                        backgroundColor: "#000",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "500",
                        color: "#fff",
                      }}>Book Now</div>
                    </div>
                  </div>
                </div>

                {/* Shop/Archive Section */}
                <div>
                  <s-text variant="body-md" fontWeight="semibold" style={{ display: "block", marginBottom: "1rem" }}>
                    Shop/Archive
                  </s-text>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {[1, 2].map((i) => (
                      <div key={i}>
                        <div style={{
                          width: "100%",
                          height: "140px",
                          backgroundColor: "#e1e3e5",
                          borderRadius: "8px",
                          marginBottom: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "48px",
                          color: "#9ca3af",
                        }}>🖼</div>
                        <s-text variant="body-sm" fontWeight="semibold" style={{ display: "block", marginBottom: "8px" }}>
                          Trigger Services
                        </s-text>
                        <div style={{
                          height: "36px",
                          backgroundColor: "#000",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "500",
                          color: "#fff",
                          fontSize: "14px",
                        }}>Book Now</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "1.5rem", display: activeTab === 1 ? "block" : "none" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px"
          }}>
            {/* Left Column - Widget Settings */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Widget Positioning */}
              <s-section heading="Widget Positioning" padding="base" >
                <s-form-field>
                  <s-select
                    label="Date Time Picker Position"
                    value={dateTimePickerPosition}
                    onChange={(e) => setDateTimePickerPosition(e.target.value)}
                  >
                    <s-option value="before_add_to_cart">Default (Before add to cart button)</s-option>
                    <s-option value="after_add_to_cart">After add to cart button</s-option>
                    <s-option value="custom">Custom position</s-option>
                  </s-select>
                  <s-text slot="helper-text" color="subdued">
                    Choose where to position the booking widget
                  </s-text>
                </s-form-field>

                <div style={{ marginTop: "1rem" }}>
                  <s-checkbox
                    checked={hideEndTime}
                    onChange={(e) => setHideEndTime(e.target.checked)}
                    label="Hide End Time"
                    details="Display only start time for the each slot (e.g., hotel check-ins"
                  />
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <s-checkbox
                    checked={hideSlotAvailabilityCount}
                    onChange={(e) => setHideSlotAvailabilityCount(e.target.checked)}
                    label="Hide Slot Availability Count"
                    details="Hide number of remaining slots from customers"
                  />
                </div>
              </s-section>

              {/* Functional Controls */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e1e3e5",
                padding: "1.5rem",
              }}>
                <s-heading variant="heading-md" style={{ marginBottom: "1rem" }}>Functional Controls</s-heading>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
            <div>
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e1e3e5",
                padding: "1.5rem",
              }}>
                <s-heading variant="heading-lg" style={{ marginBottom: "1.5rem" }}>Widget Setting</s-heading>

                {/* Product Widget Preview */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "2rem",
                  padding: "1rem",
                  backgroundColor: "#f6f6f7",
                  borderRadius: "8px",
                }}>
                  <div style={{
                    width: "180px",
                    height: "180px",
                    backgroundColor: "#e1e3e5",
                    borderRadius: "8px",
                    flexShrink: 0,
                  }}></div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ height: "24px", backgroundColor: "#d1d5db", borderRadius: "4px", width: "80%" }}></div>
                    <div style={{ height: "16px", backgroundColor: "#d1d5db", borderRadius: "4px", width: "40%" }}></div>
                    <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} style={{ fontSize: "20px", color: i < 5 ? "#fbbf24" : "#d1d5db" }}>★</div>
                      ))}
                    </div>
                    <div style={{ height: "16px", backgroundColor: "#d1d5db", borderRadius: "4px", width: "30%", marginTop: "4px" }}></div>
                    <div style={{ height: "16px", backgroundColor: "#d1d5db", borderRadius: "4px", width: "50%" }}></div>
                    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{
                        height: "40px",
                        backgroundColor: "#d1d5db",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "500",
                        color: "#6b7280",
                      }}>Add To Cart</div>
                      <div style={{
                        height: "40px",
                        backgroundColor: "#000",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "500",
                        color: "#fff",
                      }}>Book Now</div>
                    </div>
                  </div>
                </div>

                {/* Shop/Archive Section */}
                <div>
                  <s-text variant="body-md" fontWeight="semibold" style={{ display: "block", marginBottom: "1rem" }}>
                    Shop/Archive
                  </s-text>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {[1, 2].map((i) => (
                      <div key={i}>
                        <div style={{
                          width: "100%",
                          height: "140px",
                          backgroundColor: "#e1e3e5",
                          borderRadius: "8px",
                          marginBottom: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "48px",
                          color: "#9ca3af",
                        }}>🖼</div>
                        <s-text variant="body-sm" fontWeight="semibold" style={{ display: "block", marginBottom: "8px" }}>
                          Trigger Services
                        </s-text>
                        <div style={{
                          height: "36px",
                          backgroundColor: "#000",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "500",
                          color: "#fff",
                          fontSize: "14px",
                        }}>Book Now</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden inputs for widget settings */}
          <input type="hidden" name="widgetSettings" value={JSON.stringify({
            dateTimePickerPosition,
            hideEndTime,
            hideSlotAvailabilityCount,
            showPricing,
            showStaffPhotos,
            showDuration,
            showReviews,
          })} />
        </div>

        <div style={{ padding: "1.5rem", display: activeTab === 2 ? "block" : "none" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px"
          }}>
            {/* Left Column - Notification Settings */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Customer Notifications */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e1e3e5",
                padding: "1.5rem",
              }}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setNotificationExpanded(prev => ({ ...prev, customer: !prev.customer }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setNotificationExpanded(prev => ({ ...prev, customer: !prev.customer }));
                    }
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    marginBottom: notificationExpanded.customer ? "1rem" : "0",
                  }}
                >
                  <s-heading variant="heading-md">Customer notifications</s-heading>
                  <s-icon type={notificationExpanded.customer ? "chevron-down" : "chevron-up"}></s-icon>
                </div>

                {notificationExpanded.customer && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <s-checkbox
                        checked={bookingConfirmationEmail}
                        onChange={(e) => setBookingConfirmationEmail(e.target.checked)}
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
                        onChange={(e) => setCancellationEmail(e.target.checked)}
                        label="Cancellation email"
                        details="Send email when book in cancelled"
                      />
                    </div>

                    <div style={{ marginTop: "0.5rem" }}>
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
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e1e3e5",
                padding: "1.5rem",
              }}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setNotificationExpanded(prev => ({ ...prev, owner: !prev.owner }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setNotificationExpanded(prev => ({ ...prev, owner: !prev.owner }));
                    }
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    marginBottom: notificationExpanded.owner ? "1rem" : "0",
                  }}
                >
                  <s-heading variant="heading-md">Store Owner Notifications</s-heading>
                  <s-icon type={notificationExpanded.owner ? "chevron-down" : "chevron-up"}></s-icon>
                </div>

                {notificationExpanded.owner && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <s-checkbox
                        checked={newBookingAlerts}
                        onChange={(e) => setNewBookingAlerts(e.target.checked)}
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
                        onChange={(e) => setCancellationAlerts(e.target.checked)}
                        label="Cancellation alerts"
                        details="Get notified about cancelled bookings"
                      />
                    </div>

                    <div style={{ marginTop: "0.5rem" }}>
                      <s-form-field>
                        <s-select
                          label="Email digest frequency"
                          value={emailDigestFrequency}
                          onChange={(e) => setEmailDigestFrequency(e.target.value)}
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
            <div>
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e1e3e5",
                padding: "1.5rem",
              }}>
                <s-heading variant="heading-lg" style={{ marginBottom: "1.5rem" }}>Widget Setting</s-heading>

                {/* Product Widget Preview */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "2rem",
                  padding: "1rem",
                  backgroundColor: "#f6f6f7",
                  borderRadius: "8px",
                }}>
                  <div style={{
                    width: "180px",
                    height: "180px",
                    backgroundColor: "#e1e3e5",
                    borderRadius: "8px",
                    flexShrink: 0,
                  }}></div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ height: "24px", backgroundColor: "#d1d5db", borderRadius: "4px", width: "80%" }}></div>
                    <div style={{ height: "16px", backgroundColor: "#d1d5db", borderRadius: "4px", width: "40%" }}></div>
                    <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} style={{ fontSize: "20px", color: i < 5 ? "#fbbf24" : "#d1d5db" }}>★</div>
                      ))}
                    </div>
                    <div style={{ height: "16px", backgroundColor: "#d1d5db", borderRadius: "4px", width: "30%", marginTop: "4px" }}></div>
                    <div style={{ height: "16px", backgroundColor: "#d1d5db", borderRadius: "4px", width: "50%" }}></div>
                    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{
                        height: "40px",
                        backgroundColor: "#d1d5db",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "500",
                        color: "#6b7280",
                      }}>Add To Cart</div>
                      <div style={{
                        height: "40px",
                        backgroundColor: "#000",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "500",
                        color: "#fff",
                      }}>Book Now</div>
                    </div>
                  </div>
                </div>

                {/* Shop/Archive Section */}
                <div>
                  <s-text variant="body-md" fontWeight="semibold" style={{ display: "block", marginBottom: "1rem" }}>
                    Shop/Archive
                  </s-text>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {[1, 2].map((i) => (
                      <div key={i}>
                        <div style={{
                          width: "100%",
                          height: "140px",
                          backgroundColor: "#e1e3e5",
                          borderRadius: "8px",
                          marginBottom: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "48px",
                          color: "#9ca3af",
                        }}>🖼</div>
                        <s-text variant="body-sm" fontWeight="semibold" style={{ display: "block", marginBottom: "8px" }}>
                          Trigger Services
                        </s-text>
                        <div style={{
                          height: "36px",
                          backgroundColor: "#000",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "500",
                          color: "#fff",
                          fontSize: "14px",
                        }}>Book Now</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden inputs for notification settings */}
          <input type="hidden" name="customerNotificationSettings" value={JSON.stringify({
            bookingConfirmationEmail,
            reminderEmails,
            cancellationEmail,
            reminderTiming,
          })} />
          <input type="hidden" name="ownerNotificationSettings" value={JSON.stringify({
            newBookingAlerts,
            noShowAlerts,
            cancellationAlerts,
            emailDigestFrequency,
          })} />
        </div>
      </Form>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
