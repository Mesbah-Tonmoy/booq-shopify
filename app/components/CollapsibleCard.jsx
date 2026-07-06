/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';

export function CollapsibleCard({
  header,
  children,
  onDismiss,
  initialOpen = true,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState('0px');

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (!contentRef.current) return;

    const updateHeight = () => {
      if (isOpen) {
        setContentHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        setContentHeight('0px');
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, [isOpen, children]);

  // Handle dismiss button click
  const handleDismiss = (e) => {
    e.stopPropagation();
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <s-section {...props}>
      <s-stack>
        {/* Header Section */}
        <div
          onClick={toggleOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleOpen();
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-controls="card-content"
        >
          <s-stack
            direction="inline"
            justifyContent="space-between"
            alignItems="center"
          >
            <div className="flex-1">{header}</div>

            <s-stack direction="inline">
              {/* Dismiss Button */}
              {onDismiss && (
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-500 hover:text-gray-700"
                  aria-label="Dismiss"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              )}

              {/* Chevron Toggle Button */}
              <div
                className={`p-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-gray-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </s-stack>
          </s-stack>
        </div>

        {/* Expandable Content Section */}
        <div
          id="card-content"
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: contentHeight }}
          aria-hidden={!isOpen}
        >
          <div ref={contentRef}>{children}</div>
        </div>
      </s-stack>
    </s-section>
  );
}
