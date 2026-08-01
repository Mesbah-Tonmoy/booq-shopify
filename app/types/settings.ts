export interface WidgetSettings {
  dateTimePickerPosition?: string;
  hideEndTime?: boolean;
  hideSlotAvailabilityCount?: boolean;
  showPricing?: boolean;
  showStaffPhotos?: boolean;
  showDuration?: boolean;
  showReviews?: boolean;
}

export interface CustomerNotificationSettings {
  bookingConfirmationEmail?: boolean;
  reminderEmails?: boolean;
  cancellationEmail?: boolean;
  reminderTiming?: string;
}

export interface OwnerNotificationSettings {
  newBookingAlerts?: boolean;
  noShowAlerts?: boolean;
  cancellationAlerts?: boolean;
  emailDigestFrequency?: string;
}

export interface ShopSetting {
  companyName?: string | null;
  adminEmail?: string | null;
  additionalEmails?: string | null;
  refundOnBookingCancel?: boolean;
}
