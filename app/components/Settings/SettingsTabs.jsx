export function SettingsTabs({ tabs, activeTab, setActiveTab }) {
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
