export function FunctionalControlsSection({
  showPricing,
  setShowPricing,
  showStaffPhotos,
  setShowStaffPhotos,
  showDuration,
  setShowDuration,
  showReviews,
  setShowReviews,
}) {
  return (
    <div className="bg-white rounded-lg border border-[#e1e3e5] p-6">
      <s-heading variant="heading-md" className="mb-4">
        Functional Controls
      </s-heading>

      <div className="flex flex-col gap-4">
        <s-checkbox
          checked={showPricing}
          onChange={(e) => setShowPricing(e.target.checked)}
          label="Show pricing"
          details="Display service Prices"
        />

        <s-checkbox
          checked={showStaffPhotos}
          onChange={(e) => setShowStaffPhotos(e.target.checked)}
          label="Show staff photos"
          details="Display staff profile pictures"
        />

        <s-checkbox
          checked={showDuration}
          onChange={(e) => setShowDuration(e.target.checked)}
          label="Show duration"
          details="Display appointment duration"
        />

        <s-checkbox
          checked={showReviews}
          onChange={(e) => setShowReviews(e.target.checked)}
          label="Show reviews"
          details="Display customer reviews"
        />
      </div>
    </div>
  );
}
