/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

/**
 * ClickableButton - Wraps Polaris s-button web component to work with React onClick
 * This uses a ref to attach native event listeners to the web component
 */
export function ClickableButton({ 
  onClick, 
  children, 
  variant = "primary",
  slot,
  loading,
  disabled,
  size,
  tone,
  icon,
  ...props 
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (button && onClick) {
      const handleClick = (e) => {
        e.preventDefault();
        onClick(e);
      };
      
      button.addEventListener("click", handleClick);
      
      return () => {
        button.removeEventListener("click", handleClick);
      };
    }
  }, [onClick]);

  return (
    <s-button
      ref={buttonRef}
      variant={variant}
      slot={slot}
      loading={loading}
      disabled={disabled}
      size={size}
      tone={tone}
      icon={icon}
      {...props}
    >
      {children}
    </s-button>
  );
}

/**
 * Helper components for common button patterns
 */
export function PrimaryActionButton({ onClick, children, loading, ...props }) {
  return (
    <ClickableButton
      onClick={onClick}
      variant="primary"
      slot="primary-action"
      loading={loading}
      {...props}
    >
      {children}
    </ClickableButton>
  );
}

export function SecondaryActionButton({ onClick, children, ...props }) {
  return (
    <ClickableButton
      onClick={onClick}
      slot="secondary-actions"
      {...props}
    >
      {children}
    </ClickableButton>
  );
}

export function PlainButton({ onClick, children, ...props }) {
  return (
    <ClickableButton
      onClick={onClick}
      variant="plain"
      {...props}
    >
      {children}
    </ClickableButton>
  );
}
