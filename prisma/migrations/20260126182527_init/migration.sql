-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domain" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "email" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "shopifyPlan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" JSONB,
    "country" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Dhaka',
    "status" TEXT NOT NULL DEFAULT 'enabled',
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "maxCapacity" INTEGER DEFAULT 10,
    "workingHours" JSONB,
    "blockoutDates" JSONB,
    "details" TEXT,
    "instructions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopId" INTEGER NOT NULL,
    CONSTRAINT "Location_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "bio" TEXT,
    "photoUrl" TEXT,
    "timezone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "menuOrderBy" INTEGER NOT NULL DEFAULT 0,
    "maxCapacity" INTEGER NOT NULL,
    "blockoutDates" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopId" INTEGER NOT NULL,
    "locationId" INTEGER,
    "staffGroupId" INTEGER,
    CONSTRAINT "Staff_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Staff_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Staff_staffGroupId_fkey" FOREIGN KEY ("staffGroupId") REFERENCES "StaffGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StaffGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    CONSTRAINT "StaffGroup_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    CONSTRAINT "ServiceCategory_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "shopifyProductId" TEXT,
    "shopifyVariantIds" JSONB,
    "timezone" TEXT NOT NULL DEFAULT 'Eastern time (ET)',
    "serviceType" TEXT NOT NULL DEFAULT 'regular',
    "bundleBooking" JSONB,
    "capacity" INTEGER,
    "minDays" INTEGER DEFAULT 1,
    "maxDays" INTEGER DEFAULT 1,
    "multiDayBooking" TEXT DEFAULT 'flexible',
    "allowedDays" JSONB,
    "locationType" TEXT,
    "selectedLocations" JSONB,
    "hideLocationSelection" BOOLEAN DEFAULT false,
    "selectedStaff" JSONB,
    "hideStaffSelection" BOOLEAN DEFAULT false,
    "minimumAdvancedNotice" INTEGER DEFAULT 0,
    "minimumAdvancedNoticeUnit" TEXT DEFAULT 'Hours',
    "serviceVisibilityDays" INTEGER DEFAULT 60,
    "maxProductQuantities" INTEGER DEFAULT 5,
    "notificationEmail" TEXT,
    "cancelBooking" JSONB,
    "allowReschedule" BOOLEAN DEFAULT false,
    "paymentPreferences" JSONB,
    "customerFields" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "shopId" INTEGER NOT NULL,
    CONSTRAINT "Service_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Slots" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serviceId" INTEGER NOT NULL,
    "slotConfiguration" JSONB,
    CONSTRAINT "Slots_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weekStartsOn" TEXT NOT NULL DEFAULT 'Sunday',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Dhaka',
    "dateFormat" TEXT NOT NULL DEFAULT 'Default (Eg: Sun, 31 Dec 2023)',
    "timeFormat" TEXT NOT NULL DEFAULT '12-hour format (Eg: 2 PM)',
    "shopSetting" JSONB,
    "cancellationPolicy" TEXT NOT NULL DEFAULT 'Strict-48 hours notice',
    "slotReservationTime" TEXT NOT NULL DEFAULT '5 min',
    "bookingRedirection" TEXT NOT NULL DEFAULT 'Cart page',
    "paymentStatus" TEXT NOT NULL DEFAULT 'Paid',
    "universalBookingLink" BOOLEAN NOT NULL DEFAULT true,
    "widgetSettings" JSONB,
    "customerNotificationSettings" JSONB,
    "ownerNotificationSettings" JSONB,
    "emailTemplates" JSONB,
    "emailConfig" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "shopId" INTEGER NOT NULL,
    CONSTRAINT "Settings_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_domain_key" ON "Shop"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "StaffGroup_shopId_slug_key" ON "StaffGroup"("shopId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_shopId_slug_key" ON "ServiceCategory"("shopId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_shopId_key" ON "Settings"("shopId");
