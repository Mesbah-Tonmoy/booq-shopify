import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

type ButtonVariant = 'auto' | 'primary' | 'secondary' | 'tertiary';
type ButtonTone = 'auto' | 'neutral' | 'critical';

interface ClickableButtonProps {
  onClick?: (e: MouseEvent) => void;
  children?: ReactNode;
  variant?: ButtonVariant;
  slot?: Lowercase<string>;
  loading?: boolean;
  disabled?: boolean;
  tone?: ButtonTone;
  icon?: string;
  [key: string]: unknown;
}

/**
 * ClickableButton - Wraps Polaris s-button web component to work with React onClick
 * This uses a ref to attach native event listeners to the web component
 */
export function ClickableButton({
  onClick,
  children,
  variant = 'primary',
  slot,
  loading,
  disabled,
  tone,
  icon,
  ...props
}: ClickableButtonProps) {
  const buttonRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (button && onClick) {
      const handleClick = (e: Event) => {
        e.preventDefault();
        onClick(e as unknown as MouseEvent);
      };

      button.addEventListener('click', handleClick);

      return () => {
        button.removeEventListener('click', handleClick);
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
      tone={tone}
      icon={icon}
      {...props}
    >
      {children}
    </s-button>
  );
}

interface ButtonPatternProps {
  onClick?: (e: MouseEvent) => void;
  children?: ReactNode;
  loading?: boolean;
  [key: string]: unknown;
}

/**
 * Helper components for common button patterns
 */
export function PrimaryActionButton({
  onClick,
  children,
  loading,
  ...props
}: ButtonPatternProps) {
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

export function SecondaryActionButton({
  onClick,
  children,
  ...props
}: ButtonPatternProps) {
  return (
    <ClickableButton onClick={onClick} slot="secondary-actions" {...props}>
      {children}
    </ClickableButton>
  );
}

export function PlainButton({
  onClick,
  children,
  ...props
}: ButtonPatternProps) {
  return (
    <ClickableButton onClick={onClick} variant="tertiary" {...props}>
      {children}
    </ClickableButton>
  );
}
