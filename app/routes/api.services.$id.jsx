import prisma from "../db.server";

// GET /api/services/:id
export const loader = async ({ params }) => {
  try {
    const serviceId = parseInt(params.id);

    if (!serviceId || isNaN(serviceId)) {
      return JSON.stringify({ error: "Invalid service ID" }, { status: 400 });
    }

    // Fetch service with all related data
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        slots: true,
      },
    });

    if (!service) {
      return JSON.stringify({ error: "Service not found" }, { status: 404 });
    }

    // Fetch locations and staff if they are assigned to the service
    const locationIds = service.selectedLocations || [];
    const staffIds = service.selectedStaff || [];

    const locations = locationIds.length > 0
      ? await prisma.location.findMany({
        where: {
          id: { in: locationIds },
          status: "enabled",
        },
        select: {
          id: true,
          name: true,
          address: true,
          timezone: true,
          email: true,
          phone: true,
          workingHours: true,
        },
      })
      : [];

    const staffMembers = staffIds.length > 0
      ? await prisma.staff.findMany({
        where: {
          id: { in: staffIds },
          status: "active",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          bio: true,
          photoUrl: true,
          timezone: true,
          maxCapacity: true,
        },
      })
      : [];

    // Get widget settings for this shop
    const widgetSettings = await prisma.settings.findUnique({
      where: { shopId: service.shopId },
      select: {
        widgetSettings: true,
      },
    });

    // Format the response
    const response = {
      service: {
        id: service.id,
        name: service.name,
        category: service.category,
        timezone: service.timezone,
        serviceType: service.serviceType,
        capacity: service.capacity,

        // Bundle booking settings
        bundleBooking: service.bundleBooking,

        // Multi-day settings
        minDays: service.minDays,
        maxDays: service.maxDays,
        multiDayBooking: service.multiDayBooking,
        allowedDays: service.allowedDays,

        // Location & Staff
        locationType: service.locationType,
        hideLocationSelection: service.hideLocationSelection,
        hideStaffSelection: service.hideStaffSelection,

        // Booking settings
        minimumAdvancedNotice: service.minimumAdvancedNotice,
        minimumAdvancedNoticeUnit: service.minimumAdvancedNoticeUnit,
        serviceVisibilityDays: service.serviceVisibilityDays,

        // Cancellation & Rescheduling
        cancelBooking: service.cancelBooking,
        allowReschedule: service.allowReschedule,

        // Payment preferences
        paymentPreferences: service.paymentPreferences,

        // Customer fields
        customerFields: service.customerFields,

        // Shopify product data
        shopifyProductId: service.shopifyProductId,
        shopifyVariantIds: service.shopifyVariantIds,
      },

      // Slot configurations
      slots: service.slots.map(slot => ({
        id: slot.id,
        slotConfiguration: slot.slotConfiguration,
      })),

      // Locations
      locations,

      // Staff members
      staffMembers,

      // Widget settings
      widgetSettings: widgetSettings?.widgetSettings || null,
    };

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return JSON.stringify(
      { error: "Failed to fetch service data" },
      { status: 500 }
    );
  }
};

// OPTIONS request for CORS preflight
export const options = () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
