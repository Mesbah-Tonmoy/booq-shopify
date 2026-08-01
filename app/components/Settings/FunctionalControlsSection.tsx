import type { Dispatch, SetStateAction } from 'react';

interface FunctionalControlsSectionProps {
  showPricing: boolean;
  setShowPricing: Dispatch<SetStateAction<boolean>>;
  showStaffPhotos: boolean;
  setShowStaffPhotos: Dispatch<SetStateAction<boolean>>;
  showDuration: boolean;
  setShowDuration: Dispatch<SetStateAction<boolean>>;
  showReviews: boolean;
  setShowReviews: Dispatch<SetStateAction<boolean>>;
}

export function FunctionalControlsSection({
  showPricing,
  setShowPricing,
  showStaffPhotos,
  setShowStaffPhotos,
  showDuration,
  setShowDuration,
  showReviews,
  setShowReviews,
}: FunctionalControlsSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e1e3e5] p-6">
      <s-heading className="mb-4">Functional Controls</s-heading>

      <div className="flex flex-col gap-4">
        <s-checkbox
          checked={showPricing}
          onChange={(e) => setShowPricing(e.currentTarget.checked)}
          label="Show pricing"
          details="Display service Prices"
        />

        <s-checkbox
          checked={showStaffPhotos}
          onChange={(e) => setShowStaffPhotos(e.currentTarget.checked)}
          label="Show staff photos"
          details="Display staff profile pictures"
        />

        <s-checkbox
          checked={showDuration}
          onChange={(e) => setShowDuration(e.currentTarget.checked)}
          label="Show duration"
          details="Display appointment duration"
        />

        <s-checkbox
          checked={showReviews}
          onChange={(e) => setShowReviews(e.currentTarget.checked)}
          label="Show reviews"
          details="Display customer reviews"
        />
      </div>
    </div>
  );
}
