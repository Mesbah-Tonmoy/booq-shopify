import { create } from 'zustand';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const defaultWeeklyHours = {
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

const emptyWeeklyHours = () =>
  Object.fromEntries(DAYS.map((d) => [d, []]));

export const useWorkingHoursStore = create((set) => ({
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
            i === index ? { ...slot, [field]: value } : slot,
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
      return { dateSpecificHours: { ...s.dateSpecificHours, [scheduleId]: updated } };
    }),
}));
