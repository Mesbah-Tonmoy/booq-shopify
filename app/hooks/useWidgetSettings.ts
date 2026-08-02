import { useState } from 'react';
import type { Settings } from '@prisma/client';
import type { WidgetSettings } from '../types/settings';

export function useWidgetSettings(settings: Settings | null | undefined) {
  const w = (settings?.widgetSettings as WidgetSettings | null) || {};

  const [dateTimePickerPosition, setDateTimePickerPosition] = useState(
    w.dateTimePickerPosition || 'before_add_to_cart'
  );
  const [hideEndTime, setHideEndTime] = useState(w.hideEndTime || false);
  const [hideSlotAvailabilityCount, setHideSlotAvailabilityCount] = useState(
    w.hideSlotAvailabilityCount || false
  );
  const [showPricing, setShowPricing] = useState(
    w.showPricing !== undefined ? w.showPricing : true
  );
  const [showStaffPhotos, setShowStaffPhotos] = useState(
    w.showStaffPhotos !== undefined ? w.showStaffPhotos : true
  );
  const [showDuration, setShowDuration] = useState(
    w.showDuration !== undefined ? w.showDuration : true
  );
  const [showReviews, setShowReviews] = useState(
    w.showReviews !== undefined ? w.showReviews : true
  );
  const [accentColor, setAccentColor] = useState(w.accentColor || '#000000');
  const [addToCartButtonText, setAddToCartButtonText] = useState(
    w.addToCartButtonText || 'Add To Cart'
  );
  const [bookNowButtonText, setBookNowButtonText] = useState(
    w.bookNowButtonText || 'Book Now'
  );

  return {
    dateTimePickerPosition,
    setDateTimePickerPosition,
    hideEndTime,
    setHideEndTime,
    hideSlotAvailabilityCount,
    setHideSlotAvailabilityCount,
    showPricing,
    setShowPricing,
    showStaffPhotos,
    setShowStaffPhotos,
    showDuration,
    setShowDuration,
    showReviews,
    setShowReviews,
    accentColor,
    setAccentColor,
    addToCartButtonText,
    setAddToCartButtonText,
    bookNowButtonText,
    setBookNowButtonText,
  };
}

export type WidgetSettingsState = ReturnType<typeof useWidgetSettings>;
