import { useState } from 'react';

export default function CreateScheduleModal({ onCreate }) {
  const [scheduleName, setScheduleName] = useState('');

  const handleCreate = () => {
    if (!scheduleName.trim()) return;
    onCreate(scheduleName.trim());
    setScheduleName('');
  };

  const handleCancel = () => setScheduleName('');

  return (
    <s-modal
      id="create-schedule-modal"
      heading="Create Schedule"
      size="base"
      padding="base"
      accessibilityLabel="Create a new schedule"
    >
      <s-stack direction="block" gap="base">
        <s-text-field
          label="Schedule name"
          value={scheduleName}
          onInput={(e) => setScheduleName(e.target.value)}
          placeholder="e.g. Summer hours"
        />
      </s-stack>

      <s-button
        slot="secondary-actions"
        commandFor="create-schedule-modal"
        command="--hide"
        onClick={handleCancel}
      >
        Cancel
      </s-button>

      <s-button
        slot="primary-action"
        variant="primary"
        commandFor="create-schedule-modal"
        command="--hide"
        onClick={handleCreate}
      >
        Create
      </s-button>
    </s-modal>
  );
}
