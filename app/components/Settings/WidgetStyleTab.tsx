import type { WidgetSettingsState } from '../../hooks/useWidgetSettings';
import {
  WidgetPreview,
  type WidgetPreviewService,
  type WidgetPreviewStaffMember,
} from '../WidgetPreview';
import { WidgetPositioningSection } from './WidgetPositioningSection';
import { FunctionalControlsSection } from './FunctionalControlsSection';
import { BrandingSection } from './BrandingSection';

interface WidgetStyleTabProps {
  widgetSettings: WidgetSettingsState;
  previewService?: WidgetPreviewService | null;
  previewStaff?: WidgetPreviewStaffMember[];
}

export function WidgetStyleTab({
  widgetSettings,
  previewService,
  previewStaff,
}: WidgetStyleTabProps) {
  const {
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
  } = widgetSettings;

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <WidgetPositioningSection
            dateTimePickerPosition={dateTimePickerPosition}
            setDateTimePickerPosition={setDateTimePickerPosition}
            hideEndTime={hideEndTime}
            setHideEndTime={setHideEndTime}
            hideSlotAvailabilityCount={hideSlotAvailabilityCount}
            setHideSlotAvailabilityCount={setHideSlotAvailabilityCount}
          />

          <FunctionalControlsSection
            showPricing={showPricing}
            setShowPricing={setShowPricing}
            showStaffPhotos={showStaffPhotos}
            setShowStaffPhotos={setShowStaffPhotos}
            showDuration={showDuration}
            setShowDuration={setShowDuration}
            showReviews={showReviews}
            setShowReviews={setShowReviews}
          />

          <BrandingSection
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            addToCartButtonText={addToCartButtonText}
            setAddToCartButtonText={setAddToCartButtonText}
            bookNowButtonText={bookNowButtonText}
            setBookNowButtonText={setBookNowButtonText}
          />
        </div>

        <WidgetPreview
          {...widgetSettings}
          service={previewService}
          staff={previewStaff}
        />
      </div>

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
          accentColor,
          addToCartButtonText,
          bookNowButtonText,
        })}
      />
    </>
  );
}
