export interface LocationAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface LocationDayHours {
  open?: boolean;
  start?: string;
  end?: string;
  breakEnabled?: boolean;
  breakStart?: string;
  breakEnd?: string;
}

export type LocationWorkingHours = Record<string, LocationDayHours>;
