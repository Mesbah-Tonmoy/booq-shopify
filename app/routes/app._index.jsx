import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

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

  // Fetch dashboard data
  const services = await prisma.service.findMany({
    where: { shopId: shop.id },
  });

  const staffs = await prisma.staff.findMany({
    where: { shopId: shop.id },
  });

  const settings = await prisma.settings.findUnique({
    where: { shopId: shop.id },
  });

  // Calculate setup progress
  const setupSteps = {
    createLocation: false, // For now, locations aren't created in your app
    addStaffMember: staffs.length > 0,
    createService: services.length > 0,
    customizeBookingWidget: !!settings?.widgetSettings,
    confirmEmailSettings: !!settings?.emailConfig,
  };

  const completedSteps = Object.values(setupSteps).filter(Boolean).length;
  const totalSteps = Object.keys(setupSteps).length;

  return {
    shop,
    stats: {
      services: services.length,
      staff: staffs.length,
      activeServices: services.filter(s => s.status === 'active').length,
    },
    setupProgress: {
      completed: completedSteps,
      total: totalSteps,
      percentage: (completedSteps / totalSteps) * 100,
      steps: setupSteps,
    },
  };
};

export default function Index() {
  const { stats, setupProgress } = useLoaderData();
  const navigate = useNavigate();
  const [selectedDateRange, setSelectedDateRange] = useState("today");

  const dateRangeOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 days", value: "last7days" },
    { label: "Last 30 days", value: "last30days" },
  ];

  return (
    <s-page heading="Booking Widgets">
      {/* Setup Progress Section */}
      {setupProgress.percentage < 100 && (
        <s-card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <s-text variant="heading-md" as="h2" fontWeight="semibold">Booq Setup Guide</s-text>
            <s-text variant="body-sm" color="subdued">
              {setupProgress.completed} of {setupProgress.total} tasks completed
            </s-text>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <s-text>
                {setupProgress.steps.createService ? "✓" : "○"} Create a service
              </s-text>
              {!setupProgress.steps.createService && (
                <s-button size="slim" onClick={() => navigate("/app/service/new")}>
                  Create service
                </s-button>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <s-text>
                {setupProgress.steps.addStaffMember ? "✓" : "○"} Add a staff member
              </s-text>
              {!setupProgress.steps.addStaffMember && (
                <s-button size="slim" onClick={() => navigate("/app/staff")}>
                  Add staff
                </s-button>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <s-text>
                {setupProgress.steps.customizeBookingWidget ? "✓" : "○"} Customize booking widget
              </s-text>
              {!setupProgress.steps.customizeBookingWidget && (
                <s-button size="slim" onClick={() => navigate("/app/settings")}>
                  Customize widget
                </s-button>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <s-text>
                {setupProgress.steps.confirmEmailSettings ? "✓" : "○"} Confirm email settings
              </s-text>
              {!setupProgress.steps.confirmEmailSettings && (
                <s-button size="slim" onClick={() => navigate("/app/settings")}>
                  Setup emails
                </s-button>
              )}
            </div>
          </div>
        </s-card>
      )}

      {/* First Row Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginTop: "1.5rem" }}>
        <div>
          <s-text variant="body-sm" color="subdued">Date Range</s-text>
          <div style={{ marginTop: "0.5rem" }}>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "0.875rem",
                border: "1px solid #babfc3",
                borderRadius: "0.5rem",
                backgroundColor: "white",
              }}
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <s-text variant="body-sm" color="subdued">Goal Value</s-text>
          <div style={{ marginTop: "0.5rem" }}>
            <s-text variant="heading-lg" as="p">$0</s-text>
          </div>
        </div>

        <div>
          <s-text variant="body-sm" color="subdued">Confirmed Appointments</s-text>
          <div style={{ marginTop: "0.5rem" }}>
            <s-text variant="heading-lg" as="p">0</s-text>
          </div>
        </div>

        <div>
          <s-text variant="body-sm" color="subdued">Pending Appointments</s-text>
          <div style={{ marginTop: "0.5rem" }}>
            <s-text variant="heading-lg" as="p">0</s-text>
          </div>
        </div>
      </div>

      {/* Second Row Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginTop: "1.5rem" }}>
        <div>
          <s-text variant="body-sm" color="subdued">Total Appointments</s-text>
          <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <s-text variant="heading-md" as="p">0</s-text>
            <s-text variant="body-sm" color="subdued">0.0%</s-text>
          </div>
        </div>

        <div>
          <s-text variant="body-sm" color="subdued">Pending Appointments</s-text>
          <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <s-text variant="heading-md" as="p">0</s-text>
            <s-text variant="body-sm" color="subdued">0.0%</s-text>
          </div>
        </div>

        <div>
          <s-text variant="body-sm" color="subdued">Total Appointments</s-text>
          <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <s-text variant="heading-md" as="p">$0.00</s-text>
            <s-text variant="body-sm" color="subdued">0.0%</s-text>
          </div>
        </div>

        <div>
          <s-text variant="body-sm" color="subdued">Total Appointments</s-text>
          <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <s-text variant="heading-md" as="p">$0.00</s-text>
            <s-text variant="body-sm" color="subdued">0.0%</s-text>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div style={{ marginTop: "1.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <s-text variant="heading-md" as="h3">Date Value</s-text>
          <div style={{ marginTop: "0.25rem" }}>
            <s-text variant="heading-lg" as="p">39.17%</s-text>
            <s-text variant="body-sm" color="subdued">Data Unavailable</s-text>
          </div>
        </div>

        <div
          style={{
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fafbfb",
            borderRadius: "0.5rem",
            border: "1px solid #e1e3e5",
          }}
        >
          <s-text variant="body-md" color="subdued">
            Chart will appear here when you have booking data
          </s-text>
        </div>
      </div>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
