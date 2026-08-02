import { useEffect, useState } from 'react';

interface DayHours {
  open?: boolean;
  start?: string;
  end?: string;
  breakEnabled?: boolean;
  breakStart?: string;
  breakEnd?: string;
}

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const DEFAULT_OPEN_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

interface WorkingHoursDayEditorProps {
  namePrefix?: string;
  initialWorkingHours?: Record<string, DayHours> | null;
  title?: string;
}

// Per-day working hours editor, shared between Location and Staff forms.
export function WorkingHoursDayEditor({
  namePrefix = 'workingHours',
  initialWorkingHours,
  title = 'Working Hours',
}: WorkingHoursDayEditorProps) {
  const workingHours = initialWorkingHours || {};

  const buildInitialOpenDays = () => {
    const initial: Record<string, boolean> = {};
    DAYS.forEach((day) => {
      const dayData = workingHours[day.toLowerCase()];
      initial[day.toLowerCase()] =
        dayData?.open ?? DEFAULT_OPEN_DAYS.includes(day);
    });
    return initial;
  };

  const buildInitialBreakEnabled = () => {
    const initial: Record<string, boolean> = {};
    DAYS.forEach((day) => {
      const dayData = workingHours[day.toLowerCase()];
      initial[day.toLowerCase()] = dayData?.breakEnabled ?? false;
    });
    return initial;
  };

  const [openDays, setOpenDays] =
    useState<Record<string, boolean>>(buildInitialOpenDays);

  const [breakEnabled, setBreakEnabled] = useState<Record<string, boolean>>(
    buildInitialBreakEnabled
  );

  const [showEdits, setShowEdits] = useState(true);

  // Sync state when the initial working hours change (e.g. editing a different record)
  useEffect(() => {
    const wh = initialWorkingHours || {};
    const openInitial: Record<string, boolean> = {};
    const breakInitial: Record<string, boolean> = {};
    DAYS.forEach((day) => {
      const dayData = wh[day.toLowerCase()];
      openInitial[day.toLowerCase()] =
        dayData?.open ?? DEFAULT_OPEN_DAYS.includes(day);
      breakInitial[day.toLowerCase()] = dayData?.breakEnabled ?? false;
    });
    setOpenDays(openInitial);
    setBreakEnabled(breakInitial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWorkingHours]);

  const getWorkingHourData = (day: string) => {
    const dayData = workingHours[day.toLowerCase()];
    return {
      open: dayData?.open ?? DEFAULT_OPEN_DAYS.includes(day),
      start: dayData?.start || '09:00',
      end: dayData?.end || '17:00',
      breakEnabled: dayData?.breakEnabled ?? false,
      breakStart: dayData?.breakStart || '12:00',
      breakEnd: dayData?.breakEnd || '13:00',
    };
  };

  const handleCheckboxChange = (day: string, checked: boolean) => {
    setOpenDays((prev) => ({
      ...prev,
      [day.toLowerCase()]: checked,
    }));
  };

  const handleBreakChange = (day: string, checked: boolean) => {
    setBreakEnabled((prev) => ({
      ...prev,
      [day.toLowerCase()]: checked,
    }));
  };

  return (
    <s-section>
      <div>
        <s-stack
          direction="inline"
          alignItems="center"
          justifyContent="space-between"
          gap="base"
        >
          <s-heading>{title}</s-heading>
          <s-button variant="tertiary" onClick={() => setShowEdits(!showEdits)}>
            {showEdits ? 'Hide Edits' : 'Show Edits'}
          </s-button>
        </s-stack>
      </div>

      {showEdits && (
        <div style={{ marginTop: '10px' }}>
          <s-stack direction="block" gap="base">
            {DAYS.map((day) => {
              const dayData = getWorkingHourData(day);
              const isOpen = openDays[day.toLowerCase()];
              const hasBreak = breakEnabled[day.toLowerCase()];

              return (
                <div
                  key={day}
                  style={{
                    backgroundColor: '#f6f6f7',
                    borderRadius: '8px',
                    padding: '1rem',
                    border: '2px solid #e3e3e3',
                  }}
                >
                  {/* Day name and Open checkbox */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <s-text>{day}</s-text>
                    <s-checkbox
                      label="Open"
                      name={`${namePrefix}_${day.toLowerCase()}_open`}
                      checked={isOpen}
                      onChange={(e) =>
                        handleCheckboxChange(day, e.currentTarget.checked)
                      }
                    />
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: '1rem' }}>
                      {/* Start and End Time */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '1rem',
                          marginBottom: '1rem',
                        }}
                      >
                        <div>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <s-text>Start Date</s-text>
                          </div>
                          <s-text-field
                            name={`${namePrefix}_${day.toLowerCase()}_start`}
                            {...(dayData.start
                              ? { value: dayData.start }
                              : { value: '09:00' })}
                          />
                        </div>
                        <div>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <s-text>End Time</s-text>
                          </div>
                          <s-text-field
                            name={`${namePrefix}_${day.toLowerCase()}_end`}
                            {...(dayData.end
                              ? { value: dayData.end }
                              : { value: '17:00' })}
                          />
                        </div>
                      </div>

                      {/* Break Time Checkbox */}
                      <div style={{ marginBottom: hasBreak ? '1rem' : '0' }}>
                        <s-checkbox
                          label="Break Time (Optional)"
                          name={`${namePrefix}_${day.toLowerCase()}_breakEnabled`}
                          checked={hasBreak}
                          onChange={(e) =>
                            handleBreakChange(day, e.currentTarget.checked)
                          }
                        />
                      </div>

                      {/* Break Time Fields */}
                      {hasBreak && (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                          }}
                        >
                          <div>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <s-text>Start time</s-text>
                            </div>
                            <s-text-field
                              name={`${namePrefix}_${day.toLowerCase()}_breakStart`}
                              {...(dayData.breakStart
                                ? { value: dayData.breakStart }
                                : { value: '12:00' })}
                            />
                            <div style={{ marginTop: '0.25rem' }}>
                              <s-text color="subdued">When break starts</s-text>
                            </div>
                          </div>
                          <div>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <s-text>End Time</s-text>
                            </div>
                            <s-text-field
                              name={`${namePrefix}_${day.toLowerCase()}_breakEnd`}
                              {...(dayData.breakEnd
                                ? { value: dayData.breakEnd }
                                : { value: '13:00' })}
                            />
                            <div style={{ marginTop: '0.25rem' }}>
                              <s-text color="subdued">When break ends</s-text>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </s-stack>
        </div>
      )}
    </s-section>
  );
}
