import { WidgetPreview } from 'app/components/WidgetPreview';
import { WidgetPositioningSection } from './WidgetPositioningSection';
import { FunctionalControlsSection } from './FunctionalControlsSection';

export function WidgetStyleTab({ widgetSettings }) {
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
        </div>

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
    </>
  );
}
