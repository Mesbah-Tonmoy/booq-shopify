export interface StaffDayHours {
  open?: boolean;
  start?: string;
  end?: string;
  breakEnabled?: boolean;
  breakStart?: string;
  breakEnd?: string;
}

export type StaffWorkingHours = Record<string, StaffDayHours>;
