import { create } from 'zustand';

export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface TimeSlot {
  start: string;
  end: string;
}

export interface Schedule {
  id: string;
  name: string;
}

export type WeeklyHours = Record<Day, TimeSlot[]>;
export type DateSpecificHours = Record<string, TimeSlot[]>;

const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const defaultWeeklyHours: WeeklyHours = {
  Mon: [
    { start: '9:00 AM', end: '5:00 pm' },
    { start: '9:00 AM', end: '5:00 pm' },
  ],
  Tue: [{ start: '9:00 AM', end: '5:00 pm' }],
  Wed: [{ start: '9:00 AM', end: '5:00 pm' }],
  Thu: [{ start: '9:00 AM', end: '5:00 pm' }],
  Fri: [],
  Sat: [],
  Sun: [],
};

const emptyWeeklyHours = (): WeeklyHours =>
  DAYS.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {} as WeeklyHours);

interface WorkingHoursState {
  schedules: Schedule[];
  activeScheduleId: string;
  weeklyHours: Record<string, WeeklyHours>;
  dateSpecificHours: Record<string, DateSpecificHours>;

  addSchedule: (name: string) => void;
  setActiveSchedule: (id: string) => void;
  addSlot: (scheduleId: string, day: Day) => void;
  removeSlot: (scheduleId: string, day: Day, index: number) => void;
  updateSlot: (
    scheduleId: string,
    day: Day,
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => void;
  setWeekdaySlots: (scheduleId: string, day: Day, slots: TimeSlot[]) => void;
  setDateSpecificSlots: (
    scheduleId: string,
    dateKey: string,
    slots: TimeSlot[]
  ) => void;
  removeDateSpecificDate: (scheduleId: string, dateKey: string) => void;
}

export const useWorkingHoursStore = create<WorkingHoursState>()((set) => ({
  schedules: [{ id: 'default', name: 'Working hours (default)' }],
  activeScheduleId: 'default',
  weeklyHours: { default: defaultWeeklyHours },
  dateSpecificHours: { default: {} },

  addSchedule: (name) => {
    const id = `schedule-${Date.now()}`;
    set((s) => ({
      schedules: [...s.schedules, { id, name }],
      activeScheduleId: id,
      weeklyHours: { ...s.weeklyHours, [id]: emptyWeeklyHours() },
      dateSpecificHours: { ...s.dateSpecificHours, [id]: {} },
    }));
  },

  setActiveSchedule: (id) => set({ activeScheduleId: id }),

  addSlot: (scheduleId, day) =>
    set((s) => ({
      weeklyHours: {
        ...s.weeklyHours,
        [scheduleId]: {
          ...s.weeklyHours[scheduleId],
          [day]: [
            ...s.weeklyHours[scheduleId][day],
            { start: '9:00 AM', end: '5:00 pm' },
          ],
        },
      },
    })),

  removeSlot: (scheduleId, day, index) =>
    set((s) => ({
      weeklyHours: {
        ...s.weeklyHours,
        [scheduleId]: {
          ...s.weeklyHours[scheduleId],
          [day]: s.weeklyHours[scheduleId][day].filter((_, i) => i !== index),
        },
      },
    })),

  updateSlot: (scheduleId, day, index, field, value) =>
    set((s) => ({
      weeklyHours: {
        ...s.weeklyHours,
        [scheduleId]: {
          ...s.weeklyHours[scheduleId],
          [day]: s.weeklyHours[scheduleId][day].map((slot, i) =>
            i === index ? { ...slot, [field]: value } : slot
          ),
        },
      },
    })),

  setWeekdaySlots: (scheduleId, day, slots) =>
    set((s) => ({
      weeklyHours: {
        ...s.weeklyHours,
        [scheduleId]: { ...s.weeklyHours[scheduleId], [day]: slots },
      },
    })),

  setDateSpecificSlots: (scheduleId, dateKey, slots) =>
    set((s) => ({
      dateSpecificHours: {
        ...s.dateSpecificHours,
        [scheduleId]: {
          ...(s.dateSpecificHours[scheduleId] || {}),
          [dateKey]: slots,
        },
      },
    })),

  removeDateSpecificDate: (scheduleId, dateKey) =>
    set((s) => {
      const updated = { ...(s.dateSpecificHours[scheduleId] || {}) };
      delete updated[dateKey];
      return {
        dateSpecificHours: { ...s.dateSpecificHours, [scheduleId]: updated },
      };
    }),
}));
