import type { Day, TimeSlot } from '../../stores/workingHoursStore';

interface DayRowProps {
  day: Day;
  slots: TimeSlot[];
  scheduleId: string;
  timeOptions: string[];
  addSlot: (scheduleId: string, day: Day) => void;
  removeSlot: (scheduleId: string, day: Day, index: number) => void;
  updateSlot: (
    scheduleId: string,
    day: Day,
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => void;
}

export default function DayRow({
  day,
  slots,
  scheduleId,
  timeOptions,
  addSlot,
  removeSlot,
  updateSlot,
}: DayRowProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="min-w-[50px] py-[5px] px-2 bg-[#F6F6F7] rounded-[6px] text-center text-[14px] font-medium text-[#202223] border border-[#E1E3E5]">
        {day}
      </div>
      <div className="flex-1 flex flex-col gap-2">
        {slots.length === 0 ? (
          <div className="flex items-center gap-2">
            <div className="py-1.5 px-4 bg-[#F6F6F7] rounded-[6px] text-[#8C9196] text-[14px] w-[200px] border border-transparent">
              Unavailable
            </div>
            <s-button
              type="button"
              icon="plus"
              variant="tertiary"
              accessibilityLabel="Add time slot"
              onClick={() => addSlot(scheduleId, day)}
            />
          </div>
        ) : (
          slots.map((slot, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-[130px]">
                <s-select
                  value={slot.start}
                  onChange={(e) =>
                    updateSlot(
                      scheduleId,
                      day,
                      index,
                      'start',
                      e.currentTarget.value
                    )
                  }
                >
                  {timeOptions.map((t) => (
                    <s-option key={t} value={t}>
                      {t}
                    </s-option>
                  ))}
                </s-select>
              </div>
              <span className="flex items-center text-[#8C9196]">
                <s-icon type="menu-horizontal" />
              </span>
              <div className="w-[130px]">
                <s-select
                  value={slot.end}
                  onChange={(e) =>
                    updateSlot(
                      scheduleId,
                      day,
                      index,
                      'end',
                      e.currentTarget.value
                    )
                  }
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
                accessibilityLabel="Remove time slot"
                onClick={() => removeSlot(scheduleId, day, index)}
              />
              {index === 0 && (
                <s-button
                  type="button"
                  icon="plus"
                  variant="tertiary"
                  accessibilityLabel="Add time slot"
                  onClick={() => addSlot(scheduleId, day)}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
