interface Tab {
  id: number;
  label: string;
}

interface SettingsTabsProps {
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (id: number) => void;
}

export function SettingsTabs({
  tabs,
  activeTab,
  setActiveTab,
}: SettingsTabsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <s-button
          key={tab.id}
          type="button"
          variant={activeTab === tab.id ? 'secondary' : 'tertiary'}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </s-button>
      ))}
    </div>
  );
}
