export type FormErrors = Record<string, string>;
export type ClearErrorFn = (field: string) => void;

export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  image?: { src: string } | null;
}

export interface ProductData {
  id: string;
  title: string;
  variants: ProductVariant[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface RegularSlotConfig {
  slots: TimeSlot[];
}

export type FullDaySlotConfig = Record<string, TimeSlot[]>;

export interface BundleBookingConfig {
  enabled: boolean;
  minSlots: number | null;
  maxSlots: number | null;
}

export interface CancelBookingConfig {
  allowed: boolean;
  cutoffTime: string;
  cutoffUnit: string;
}

export interface PaymentPreferencesConfig {
  type: string;
  fullPayment: { name: string; label: string; description: string };
  bookNowPayLater: { name: string; description: string };
}

export interface CustomerField {
  id: number;
  name: string;
  label: string;
  type: string;
  required: boolean;
  visible: boolean;
}

export interface ServiceFormData {
  id?: number;
  name?: string;
  category?: string;
  shopifyProductId?: string | null;
  productData?: ProductData | null;
  shopifyVariantIds?: string[];
  timezone?: string;
  serviceType?: string;
  capacity?: number | string | null;
  bundleBooking?: BundleBookingConfig | null;
  minDays?: number;
  maxDays?: number;
  multiDayBooking?: string;
  allowedDays?: string[];
  slotConfiguration?: RegularSlotConfig | FullDaySlotConfig | null;
  locationType?: string;
  selectedLocations?: number[];
  hideLocationSelection?: boolean;
  selectedStaff?: number[];
  hideStaffSelection?: boolean;
  minimumAdvancedNotice?: number;
  minimumAdvancedNoticeUnit?: string;
  serviceVisibilityDays?: number;
  maxProductQuantities?: number;
  notificationEmail?: string;
  cancelBooking?: CancelBookingConfig | null;
  allowReschedule?: boolean;
  paymentPreferences?: PaymentPreferencesConfig | null;
  customerFields?: CustomerField[];
}

export interface ServiceCategoryOption {
  id: number;
  name: string;
}

export interface LocationOption {
  id: number;
  name: string;
  address?: string | { street?: string } | null;
}

export interface StaffOption {
  id: number;
  name: string;
}
