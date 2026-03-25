/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';

/**
 * DashedCircle - Custom icon for setup steps matching Figma design.
 */
const DashedCircle = () => (
  <div
    className={`w-5 h-5 rounded-full border border-dashed flex-shrink-0 border-gray-400`}
  />
);

/**
 * SetupStep - A single collapsible step item.
 */
const SetupStep = ({ title, description, children, isOpen, onToggle }) => {
  const contentRef = useRef(null);
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
        <DashedCircle />
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

export function SetupGuide({ steps, activeStepId, onStepToggle }) {
  return (
    <div className="flex flex-col gap-1">
      {steps.map((step) => (
        <SetupStep
          key={step.id}
          title={step.title}
          description={step.description}
          isOpen={activeStepId === step.id}
          onToggle={() => onStepToggle(step.id)}
        >
          {step.actions}
        </SetupStep>
      ))}
    </div>
  );
}
