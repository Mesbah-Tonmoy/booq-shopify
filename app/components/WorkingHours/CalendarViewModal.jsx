import { useEffect, useRef, useState } from 'react';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_FULL_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DEFAULT_SLOT = { start: '9:00 AM', end: '5:00 pm' };

const toDateKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

function EditSlotsPanel({
  title,
  initialSlots,
  timeOptions,
  onApply,
  onCancel,
}) {
  const [slots, setSlots] = useState(initialSlots);

  // Re-seed when editing a different date/weekday
  useEffect(() => {
    setSlots(initialSlots);
  }, [title]); // eslint-disable-line react-hooks/exhaustive-deps

  const addSlot = () => setSlots((prev) => [...prev, { ...DEFAULT_SLOT }]);
  const removeSlot = (i) =>
    setSlots((prev) => prev.filter((_, idx) => idx !== i));
  const updateSlot = (i, field, value) =>
    setSlots((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s))
    );

  return (
    <div>
      <p className="font-semibold text-[16px] mb-4">{title}</p>
      <p className="text-[14px] font-medium mb-3">
        What hours are you available?
      </p>
      <div className="flex flex-col gap-2 mb-6">
        {slots.map((slot, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-[130px]">
              <s-select
                value={slot.start}
                onChange={(e) => updateSlot(index, 'start', e.target.value)}
              >
                {timeOptions.map((t) => (
                  <s-option key={t} value={t}>
                    {t}
                  </s-option>
                ))}
              </s-select>
            </div>
            <span className="text-[#8C9196]">
              <s-icon type="menu-horizontal" />
            </span>
            <div className="w-[130px]">
              <s-select
                value={slot.end}
                onChange={(e) => updateSlot(index, 'end', e.target.value)}
              >
                {timeOptions.map((t) => (
                  <s-option key={t} value={t}>
                    {t}
                  </s-option>
                ))}
              </s-select>
            </div>
            <s-button
              type="button"
              icon="x"
              variant="tertiary"
              accessibilityLabel="Remove slot"
              onClick={() => removeSlot(index)}
            />
            {index === slots.length - 1 && (
              <s-button
                type="button"
                icon="plus"
                variant="tertiary"
                accessibilityLabel="Add slot"
                onClick={addSlot}
              />
            )}
          </div>
        ))}
        {slots.length === 0 && (
          <div className="flex items-center gap-2">
            <div className="py-1.5 px-4 bg-[#F6F6F7] rounded-[6px] text-[#8C9196] text-[14px] border border-transparent">
              Unavailable
            </div>
            <s-button
              type="button"
              icon="plus"
              variant="tertiary"
              accessibilityLabel="Add slot"
              onClick={addSlot}
            />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded-[6px] border border-[#E1E3E5] text-[14px] font-medium hover:bg-[#F6F6F7]"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-[6px] bg-[#202223] text-white text-[14px] font-medium hover:bg-[#303435]"
          onClick={() => onApply(slots)}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default function CalendarViewModal({
  scheduleId,
  scheduleName,
  weeklyHours,
  dateSpecificHours,
  setDateSpecificSlots,
  setWeekdaySlots,
  timeOptions,
}) {
  const todayDate = new Date();
  const [year, setYear] = useState(todayDate.getFullYear());
  const [month, setMonth] = useState(todayDate.getMonth());
  const [popover, setPopover] = useState(null);
  const [editInfo, setEditInfo] = useState(null);
  const calendarRef = useRef(null);
  const popoverRef = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    if (!popover) return;
    const handleDown = (e) => {
      if (!popoverRef.current?.contains(e.target)) setPopover(null);
    };
    document.addEventListener('mousedown', handleDown);
    return () => document.removeEventListener('mousedown', handleDown);
  }, [popover]);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  // Build 42-cell grid (6 rows × 7 cols)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDayOfMonth + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });

  const getHoursForCell = (day, colIndex) => {
    const dateKey = toDateKey(year, month, day);
    const override = (dateSpecificHours[scheduleId] || {})[dateKey];
    if (override !== undefined) return { slots: override, isOverride: true };
    const slots = (weeklyHours[scheduleId] || {})[WEEK_DAYS[colIndex]] || [];
    return { slots, isOverride: false };
  };

  const handleCellClick = (e, day, colIndex) => {
    const cellRect = e.currentTarget.getBoundingClientRect();
    const calRect = calendarRef.current.getBoundingClientRect();
    const dateKey = toDateKey(year, month, day);
    const dayName = WEEK_DAYS[colIndex];
    const left = Math.min(cellRect.left - calRect.left, calRect.width - 220);
    setPopover({
      dateKey,
      dayName,
      colIndex,
      top: cellRect.bottom - calRect.top + 4,
      left: Math.max(0, left),
    });
  };

  const handleEditDate = () => {
    const { dateKey, colIndex } = popover;
    const day = parseInt(dateKey.split('-')[2], 10);
    const { slots } = getHoursForCell(day, colIndex);
    const [y, m, d] = dateKey.split('-').map(Number);
    setEditInfo({
      mode: 'date',
      dateKey,
      storeKey: null,
      title: `Editing ${MONTH_FULL_NAMES[m - 1]} ${d}, ${y}`,
      initialSlots: slots.length > 0 ? [...slots] : [{ ...DEFAULT_SLOT }],
    });
    setPopover(null);
  };

  const handleEditWeekday = () => {
    const { dayName } = popover;
    const slots = (weeklyHours[scheduleId] || {})[dayName] || [];
    setEditInfo({
      mode: 'weekday',
      dateKey: null,
      storeKey: dayName,
      title: `Edit all ${dayName}s`,
      initialSlots: slots.length > 0 ? [...slots] : [{ ...DEFAULT_SLOT }],
    });
    setPopover(null);
  };

  const handleApply = (slots) => {
    if (editInfo.mode === 'date') {
      setDateSpecificSlots(scheduleId, editInfo.dateKey, slots);
    } else {
      setWeekdaySlots(scheduleId, editInfo.storeKey, slots);
    }
    setEditInfo(null);
  };

  const todayKey = toDateKey(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate()
  );

  return (
    <s-modal
      id="calendar-view-modal"
      heading={scheduleName}
      size="large"
      accessibilityLabel="Calendar view of working hours"
    >
      <div ref={calendarRef} className="relative">
        {/* Calendar header: month navigation + timezone */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <s-button
              type="button"
              icon="chevron-left"
              variant="tertiary"
              accessibilityLabel="Previous month"
              onClick={prevMonth}
            />
            <span className="font-semibold text-[16px] min-w-[160px] text-center select-none">
              {MONTH_FULL_NAMES[month]} {year}
            </span>
            <s-button
              type="button"
              icon="chevron-right"
              variant="tertiary"
              accessibilityLabel="Next month"
              onClick={nextMonth}
            />
          </div>
          <div>
            <s-select value="Eastern time (ET)" onChange={() => {}}>
              <s-option value="Eastern time (ET)">
                Eastern Time - US &amp; Canada
              </s-option>
            </s-select>
          </div>
        </div>

        {/* Day column headers */}
        <div
          className="grid border-t border-l border-[#E1E3E5]"
          style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
        >
          {WEEK_DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[12px] font-semibold text-[#6D7175] py-2 border-r border-b border-[#E1E3E5] uppercase"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div
          className="grid border-l border-[#E1E3E5]"
          style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
        >
          {cells.map((day, i) => {
            if (!day) {
              return (
                <div
                  key={i}
                  className="border-r border-b border-[#E1E3E5] min-h-[100px] bg-[#FAFAFA]"
                />
              );
            }
            const colIndex = i % 7;
            const { slots, isOverride } = getHoursForCell(day, colIndex);
            const dateKey = toDateKey(year, month, day);
            const isToday = dateKey === todayKey;
            return (
              <div
                key={i}
                className="border-r border-b border-[#E1E3E5] min-h-[100px] p-2 cursor-pointer hover:bg-[#F6F6F7]"
                onClick={(e) => handleCellClick(e, day, colIndex)}
              >
                <s-stack
                  direction="inline"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-[13px] mb-1 font-medium ${
                      isToday ? 'bg-[#253858] text-white' : 'text-[#202223]'
                    }`}
                  >
                    {day}
                  </div>
                  <s-icon type={isOverride ? 'calendar' : 'refresh'} />
                </s-stack>

                {slots.length > 0 &&
                  slots.map((slot, si) => (
                    <div
                      key={si}
                      className="flex items-center gap-1 text-[11px] text-[#6D7175] leading-5 flex-wrap"
                    >
                      <span>
                        {slot.start}–{slot.end}
                      </span>
                    </div>
                  ))}
                {slots.length === 0 && isOverride && (
                  <p className="text-[11px] text-[#8C9196] italic">
                    Unavailable
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Cell click popover */}
        {popover && (
          <div
            ref={popoverRef}
            className="absolute z-10 bg-white rounded-[8px] shadow-lg border border-[#E1E3E5] py-1 w-[220px]"
            style={{ top: popover.top, left: popover.left }}
          >
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-[14px] text-[#202223] hover:bg-[#F6F6F7] text-left"
              onClick={handleEditDate}
            >
              <s-icon type="calendar" />
              Edit date
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-[14px] text-[#202223] hover:bg-[#F6F6F7] text-left"
              onClick={handleEditWeekday}
            >
              <s-icon type="refresh" />
              Edit all {popover.dayName}s
            </button>
          </div>
        )}

        {/* Edit hours overlay */}
        {editInfo && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-[480px] shadow-xl max-w-[90vw]">
              <EditSlotsPanel
                title={editInfo.title}
                initialSlots={editInfo.initialSlots}
                timeOptions={timeOptions}
                onApply={handleApply}
                onCancel={() => setEditInfo(null)}
              />
            </div>
          </div>
        )}
      </div>
    </s-modal>
  );
}
