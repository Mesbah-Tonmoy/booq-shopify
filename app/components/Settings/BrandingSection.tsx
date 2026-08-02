import type { Dispatch, SetStateAction } from 'react';

interface BrandingSectionProps {
  accentColor: string;
  setAccentColor: Dispatch<SetStateAction<string>>;
  addToCartButtonText: string;
  setAddToCartButtonText: Dispatch<SetStateAction<string>>;
  bookNowButtonText: string;
  setBookNowButtonText: Dispatch<SetStateAction<string>>;
}

export function BrandingSection({
  accentColor,
  setAccentColor,
  addToCartButtonText,
  setAddToCartButtonText,
  bookNowButtonText,
  setBookNowButtonText,
}: BrandingSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e1e3e5] p-6">
      <s-heading className="mb-4">Branding</s-heading>

      <div className="flex flex-col gap-4">
        <div>
          <s-text className="block mb-2">Accent color</s-text>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.currentTarget.value)}
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid #e1e3e5',
                borderRadius: '6px',
                cursor: 'pointer',
                padding: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <s-text-field
                label="Accent color hex"
                labelAccessibilityVisibility="exclusive"
                value={accentColor}
                onChange={(e) => setAccentColor(e.currentTarget.value)}
              />
            </div>
          </div>
        </div>

        <s-text-field
          label="Add To Cart button text"
          value={addToCartButtonText}
          onChange={(e) => setAddToCartButtonText(e.currentTarget.value)}
        />

        <s-text-field
          label="Book Now button text"
          value={bookNowButtonText}
          onChange={(e) => setBookNowButtonText(e.currentTarget.value)}
        />
      </div>
    </div>
  );
}
