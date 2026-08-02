import type { WidgetSettings } from '../types/settings';

export interface WidgetPreviewService {
  name: string;
}

export interface WidgetPreviewStaffMember {
  name: string;
  photoUrl?: string | null;
}

interface WidgetPreviewProps extends WidgetSettings {
  service?: WidgetPreviewService | null;
  staff?: WidgetPreviewStaffMember[];
}

const SAMPLE_STAFF: WidgetPreviewStaffMember[] = [
  { name: 'Jane S.' },
  { name: 'Alex M.' },
];

export const WidgetPreview = ({
  dateTimePickerPosition = 'before_add_to_cart',
  hideEndTime = false,
  hideSlotAvailabilityCount = false,
  showPricing = true,
  showStaffPhotos = true,
  showDuration = true,
  showReviews = true,
  accentColor = '#000000',
  addToCartButtonText = 'Add To Cart',
  bookNowButtonText = 'Book Now',
  service,
  staff,
}: WidgetPreviewProps) => {
  const isSampleData = !service;
  const serviceName = service?.name ?? 'Haircut & Styling Session';
  const staffList =
    staff && staff.length > 0 ? staff.slice(0, 2) : SAMPLE_STAFF;
  const renderDatePicker = () => {
    if (dateTimePickerPosition === 'custom') {
      return (
        <div className="mb-4 p-3 bg-amber-50 rounded border border-amber-200 text-center">
          <s-text color="subdued">
            ⚠️ Date & Time picker positioned via custom anchor container.
          </s-text>
        </div>
      );
    }

    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <s-text className="block mb-3">Select Date & Time</s-text>

        {/* Date Row */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {[
            { day: 'Fri', date: '19', active: true },
            { day: 'Sat', date: '20' },
            { day: 'Sun', date: '21' },
            { day: 'Mon', date: '22' },
          ].map((d, index) => (
            <button
              key={index}
              type="button"
              className={`flex-1 min-w-[50px] py-2 px-1 rounded-lg border text-center transition-all ${
                d.active
                  ? 'border-black bg-black text-white font-medium shadow-sm'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
              }`}
            >
              <div className="text-[10px] uppercase opacity-80">{d.day}</div>
              <div className="text-[14px] font-semibold">{d.date}</div>
            </button>
          ))}
        </div>

        {/* Time Slots */}
        <div className="flex flex-col gap-2">
          {[
            {
              start: '10:00 AM',
              end: '10:45 AM',
              slotsLeft: 2,
              active: true,
            },
            {
              start: '11:30 AM',
              end: '12:15 PM',
              slotsLeft: 1,
            },
          ].map((slot, index) => (
            <button
              key={index}
              type="button"
              className={`w-full py-2 px-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                slot.active
                  ? 'border-black bg-gray-900 text-white font-medium'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
              }`}
            >
              <span className="text-[13px]">
                {hideEndTime ? slot.start : `${slot.start} - ${slot.end}`}
              </span>
              {!hideSlotAvailabilityCount && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    slot.active
                      ? 'bg-white/20 text-white'
                      : slot.slotsLeft === 1
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {slot.slotsLeft === 1
                    ? 'Last slot'
                    : `${slot.slotsLeft} left`}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-[#e1e3e5] p-6">
      <s-heading className="mb-1 block text-[#202223] font-semibold">
        Widget Setting Preview
      </s-heading>
      <div className="mb-5">
        {isSampleData && (
          <s-text color="subdued">
            Preview shown with sample data — create a service to see it here.
          </s-text>
        )}
      </div>

      {/* Product Widget Preview Container */}
      <div className="flex gap-4 mb-8 p-4 bg-[#f6f6f7] rounded-lg">
        {/* Left Side: Product Image Placeholder */}
        <div className="w-[180px] h-[180px] bg-[#e1e3e5] rounded-lg shrink-0 flex items-center justify-center text-[54px] text-gray-400 select-none">
          💇‍♀️
        </div>

        {/* Right Side: Details & Action */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Title */}
          <s-heading className="block text-[#202223] font-semibold">
            {serviceName}
          </s-heading>

          {/* Reviews Rating */}
          {showReviews && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-[#fbbf24] text-[18px]">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-500 text-[12px] font-medium">
                4.9 (84 reviews)
              </span>
            </div>
          )}

          {/* Pricing & Duration */}
          <div className="flex items-center gap-3 my-1">
            {showPricing && (
              <span className="text-[16px] font-bold text-gray-900">
                $75.00
              </span>
            )}
            {showDuration && (
              <span className="text-[13px] text-gray-500 flex items-center gap-1">
                ⏱ 45 mins
              </span>
            )}
          </div>

          {/* Staff Selection Preview */}
          {showStaffPhotos && (
            <div className="mt-2 mb-3">
              <s-text color="subdued" className="block mb-2 font-medium">
                Select Specialist
              </s-text>
              <div className="flex gap-3">
                {staffList.map((member, i) => {
                  const initial = member.name.charAt(0).toUpperCase();
                  const active = i === 0;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all cursor-pointer ${
                        active
                          ? 'border-black bg-white shadow-sm ring-1 ring-black'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-700">
                          {initial}
                        </div>
                      )}
                      <span className="text-[11px] font-medium text-gray-800">
                        {member.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Slot picker (Position: Before Add To Cart) */}
          {dateTimePickerPosition === 'before_add_to_cart' &&
            renderDatePicker()}

          {/* Add To Cart & Book Now Buttons */}
          <div className="mt-auto flex flex-col gap-2">
            <div className="h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center font-medium text-gray-700 border border-gray-200 cursor-pointer transition-colors text-[14px]">
              {addToCartButtonText}
            </div>
            <div
              className="h-10 rounded-lg flex items-center justify-center font-medium text-white cursor-pointer transition-colors text-[14px]"
              style={{ backgroundColor: accentColor }}
            >
              {bookNowButtonText}
            </div>
          </div>

          {/* Slot picker (Position: After Add To Cart) */}
          {dateTimePickerPosition === 'after_add_to_cart' && renderDatePicker()}
        </div>
      </div>

      {/* Shop/Archive Section */}
      <div>
        <s-text className="block mb-4">Shop/Archive Grid</s-text>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-lg p-3 bg-white"
            >
              <div className="w-full h-[120px] bg-[#e1e3e5] rounded-lg mb-2 flex items-center justify-center text-[36px] text-[#9ca3af] select-none">
                🖼
              </div>
              <s-text className="block mb-2 text-gray-800">
                {i === 1 ? 'Cut & Blow Dry' : 'Full Color Service'}
              </s-text>
              {showPricing && (
                <span className="text-[12px] font-bold text-gray-900 block mb-2">
                  {i === 1 ? '$50.00' : '$120.00'}
                </span>
              )}
              <div
                className="h-9 rounded-lg flex items-center justify-center font-medium text-white text-[13px] cursor-pointer transition-colors"
                style={{ backgroundColor: accentColor }}
              >
                {bookNowButtonText}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
