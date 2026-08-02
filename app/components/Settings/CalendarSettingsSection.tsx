import type { ReactNode } from 'react';

function GoogleCalendarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="6"
        fill="#fff"
        stroke="#dadce0"
      />
      <rect x="1" y="1" width="30" height="9" rx="6" fill="#1a73e8" />
      <rect x="1" y="6" width="30" height="4" fill="#1a73e8" />
      <text
        x="16"
        y="24"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#3c4043"
        fontFamily="Arial, sans-serif"
      >
        31
      </text>
      <circle cx="9" cy="27" r="1.5" fill="#34a853" />
      <circle cx="16" cy="27" r="1.5" fill="#fbbc04" />
      <circle cx="23" cy="27" r="1.5" fill="#ea4335" />
    </svg>
  );
}

function OutlookCalendarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="6" fill="#0078d4" />
      <rect x="8" y="9" width="16" height="14" rx="1.5" fill="#fff" />
      <rect x="8" y="9" width="16" height="4" fill="#0078d4" />
      <rect x="11" y="6.5" width="1.6" height="5" rx="0.8" fill="#0078d4" />
      <rect x="19.4" y="6.5" width="1.6" height="5" rx="0.8" fill="#0078d4" />
      <text
        x="16"
        y="21.5"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="#0078d4"
        fontFamily="Arial, sans-serif"
      >
        31
      </text>
    </svg>
  );
}

interface CalendarIntegrationRowProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

function CalendarIntegrationRow({
  icon,
  title,
  subtitle,
}: CalendarIntegrationRowProps) {
  return (
    <s-stack
      direction="inline"
      justifyContent="space-between"
      alignItems="center"
      gap="base"
    >
      <s-stack direction="inline" alignItems="center" gap="small-100">
        {icon}
        <s-stack direction="block" gap="small-0">
          <s-stack direction="inline" alignItems="center" gap="small-100">
            <s-text color="subdued">{title}</s-text>
            <s-badge tone="info">Coming soon</s-badge>
          </s-stack>
          <s-text color="subdued">{subtitle}</s-text>
        </s-stack>
      </s-stack>

      <s-button variant="primary" disabled>
        Connect
      </s-button>
    </s-stack>
  );
}

export function CalendarSettingsSection() {
  return (
    <s-stack direction="block" gap="base">
      <s-text color="subdued">
        Calendar sync is coming in a future release — connect Google or Outlook
        to automatically block out busy times.
      </s-text>
      <CalendarIntegrationRow
        icon={<GoogleCalendarIcon />}
        title="Google Calendar"
        subtitle="Gmail, G Suite"
      />
      <CalendarIntegrationRow
        icon={<OutlookCalendarIcon />}
        title="Outlook Calendar"
        subtitle="Office 365, Outlook.com, live.com, or hotmail calendar"
      />
    </s-stack>
  );
}
