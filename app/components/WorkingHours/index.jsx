import { useWorkingHoursStore } from '../../stores/workingHoursStore';
import CalendarViewModal from './CalendarViewModal';
import CreateScheduleModal from './CreateScheduleModal';
import DateSpecificHoursModal from './DateSpecificHoursModal';
import DayRow from './DayRow';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formatDateLabel = (dateKey) => {
  const [, m, d] = dateKey.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}`;
};

const TIME_OPTIONS = [
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 pm',
  '5:30 PM',
  '6:00 PM',
];

export default function WorkingHoursSection() {
  const {
    schedules,
    activeScheduleId,
    weeklyHours,
    dateSpecificHours,
    addSchedule,
    setActiveSchedule,
    addSlot,
    removeSlot,
    updateSlot,
    setDateSpecificSlots,
    setWeekdaySlots,
    removeDateSpecificDate,
  } = useWorkingHoursStore();

  const activeHours = weeklyHours[activeScheduleId];
  const activeDateSpecific = dateSpecificHours[activeScheduleId] || {};

  const dateEntriesByYear = (() => {
    const byYear = {};
    Object.entries(activeDateSpecific).forEach(([dateKey, slots]) => {
      const year = dateKey.slice(0, 4);
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push({ dateKey, slots });
    });
    return Object.entries(byYear).sort();
  })();

  return (
    <div className="flex flex-col gap-[10px] pt-2">
      {/* Schedule selector */}
      <div>
        <s-select
          value={activeScheduleId}
          onChange={(e) => setActiveSchedule(e.target.value)}
        >
          {schedules.map((s) => (
            <s-option key={s.id} value={s.id}>
              {s.name}
            </s-option>
          ))}
        </s-select>
        <div className="flex justify-between items-center mt-3">
          <s-text color="subdued">New Schedule</s-text>
          <s-button
            type="button"
            icon="plus"
            commandFor="create-schedule-modal"
            command="--show"
          >
            Create schedule
          </s-button>
        </div>
      </div>

      <CreateScheduleModal onCreate={addSchedule} />

      <CalendarViewModal
        scheduleId={activeScheduleId}
        scheduleName={
          schedules.find((s) => s.id === activeScheduleId)?.name ?? ''
        }
        weeklyHours={weeklyHours}
        dateSpecificHours={dateSpecificHours}
        setDateSpecificSlots={setDateSpecificSlots}
        setWeekdaySlots={setWeekdaySlots}
        timeOptions={TIME_OPTIONS}
      />

      <hr className="border-none border-t border-[#E1E3E5] m-0" />

      {/* Weekly hours */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1">
            <s-icon type="clock" />
            <div className="flex items-center gap-1">
              <s-text type="strong" interestFor="weekly-hours-tooltip">
                Weekly hours
              </s-text>
              <s-tooltip id="weekly-hours-tooltip">
                Set when you are typically available for meetings
              </s-tooltip>
            </div>
          </div>
          <div className="flex border border-[#E1E3E5] rounded-[6px] overflow-hidden">
            <s-button type="button" icon="list-bulleted" variant="tertiary">
              List
            </s-button>
            <s-button
              type="button"
              icon="calendar"
              variant="tertiary"
              commandFor="calendar-view-modal"
              command="--show"
            >
              Calendar
            </s-button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {Object.entries(activeHours).map(([day, slots]) => (
            <DayRow
              key={day}
              day={day}
              slots={slots}
              scheduleId={activeScheduleId}
              timeOptions={TIME_OPTIONS}
              addSlot={addSlot}
              removeSlot={removeSlot}
              updateSlot={updateSlot}
            />
          ))}
        </div>
      </div>

      <hr className="border-none border-t border-[#E1E3E5] my-2" />

      {/* Date-specific hours */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <s-icon type="calendar-list" />
            <s-text type="strong" interestFor="date-specific-hours-tooltip">
              Date-specific hours
            </s-text>
            <s-tooltip id="date-specific-hours-tooltip">
              Adjust hours for specific days
            </s-tooltip>
          </div>
          <s-button
            type="button"
            icon="plus"
            variant="primary"
            commandFor="date-specific-hours-modal"
            command="--show"
          >
            Hours
          </s-button>
        </div>

        <DateSpecificHoursModal
          timeOptions={TIME_OPTIONS}
          onApply={(dateKey, slots) =>
            setDateSpecificSlots(activeScheduleId, dateKey, slots)
          }
        />

        {dateEntriesByYear.map(([year, entries]) => (
          <div key={year} className="mt-2">
            <div className="text-[13px] font-semibold text-[#6D7175] py-1">
              {year}
            </div>
            {entries.map(({ dateKey, slots }) => (
              <div key={dateKey} className="flex items-center gap-3 py-1">
                <span className="min-w-[70px] text-[14px]">
                  {formatDateLabel(dateKey)}
                </span>
                <div className="py-1 px-3 bg-[#F6F6F7] rounded-[6px] border border-[#E1E3E5] text-[14px] text-[#8C9196] flex-1">
                  {slots.length === 0
                    ? 'Unavailable'
                    : slots.map((s) => `${s.start} – ${s.end}`).join(', ')}
                </div>
                <s-button
                  type="button"
                  icon="x"
                  variant="tertiary"
                  accessibilityLabel="Remove date"
                  onClick={() =>
                    removeDateSpecificDate(activeScheduleId, dateKey)
                  }
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <hr className="border-none border-t border-[#E1E3E5] my-2" />

      {/* Time zone */}
      <div>
        <s-select
          label="Time zone"
          value="Eastern time (ET)"
          onChange={() => {}}
        >
          <s-option value="Eastern time (ET)">Eastern time (ET)</s-option>
        </s-select>
        <s-text color="subdued" className="mt-1 block">
          {"The timezone for this service's availability"}
        </s-text>
      </div>
    </div>
  );
}
