import { useState, useRef, useEffect, type ReactNode } from 'react';

/**
 * DashedCircle - Custom icon for setup steps matching Figma design.
 */
const DashedCircle = ({ completed }: { completed?: boolean }) =>
  completed ? (
    <div className="w-5 h-5 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="white"
        className="w-3 h-3"
      >
        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
      </svg>
    </div>
  ) : (
    <div
      className={`w-5 h-5 rounded-full border border-dashed flex-shrink-0 border-gray-400`}
    />
  );

interface SetupStepProps {
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
  isOpen: boolean;
  completed?: boolean;
  onToggle: () => void;
}

/**
 * SetupStep - A single collapsible step item.
 */
const SetupStep = ({
  title,
  description,
  children,
  isOpen,
  completed,
  onToggle,
}: SetupStepProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isOpen]);

  return (
    <div
      className={`relative transition-all duration-300 rounded-[12px] p-2 ${
        isOpen
          ? 'bg-[#F6F6F7] border border-gray-200/50'
          : 'bg-transparent hover:bg-gray-50/50'
      }`}
    >
      <div
        className="flex items-stretch gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded-lg"
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <DashedCircle completed={completed} />
        <div className="flex-1">
          <p
            className={`text-[15px] font-medium text-gray-900 ${isOpen ? 'mb-1' : ''}`}
          >
            {title}
          </p>

          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ height }}
          >
            <div ref={contentRef}>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                {description}
              </p>
              <div className="flex flex-wrap gap-2">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface SetupStepData {
  id: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  completed?: boolean;
}

interface SetupGuideProps {
  steps: SetupStepData[];
  activeStepId: string | null;
  onStepToggle: (id: string) => void;
}

export function SetupGuide({
  steps,
  activeStepId,
  onStepToggle,
}: SetupGuideProps) {
  return (
    <div className="flex flex-col gap-1">
      {steps.map((step) => (
        <SetupStep
          key={step.id}
          title={step.title}
          description={step.description}
          isOpen={activeStepId === step.id}
          completed={step.completed}
          onToggle={() => onStepToggle(step.id)}
        >
          {step.actions}
        </SetupStep>
      ))}
    </div>
  );
}
