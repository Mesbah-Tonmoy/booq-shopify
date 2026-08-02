export interface WidgetSettings {
  dateTimePickerPosition?: string;
  hideEndTime?: boolean;
  hideSlotAvailabilityCount?: boolean;
  showPricing?: boolean;
  showStaffPhotos?: boolean;
  showDuration?: boolean;
  showReviews?: boolean;
  accentColor?: string;
  addToCartButtonText?: string;
  bookNowButtonText?: string;
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

export interface HolidaySettings {
  country: string;
  enabled: boolean;
  enabledHolidayIds: string[];
}

export type EmailTemplateKey =
  | 'bookingConfirmation'
  | 'cancellation'
  | 'reminder'
  | 'ownerNewBookingAlert';

export interface EmailTemplateContent {
  subject: string;
  body: string;
}

export type EmailTemplates = Record<EmailTemplateKey, EmailTemplateContent>;
