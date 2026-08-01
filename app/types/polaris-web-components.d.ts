import type { HTMLAttributes, Key, ReactNode, Ref } from 'react';

/**
 * @shopify/polaris-types@1.0.1 declares JSX.IntrinsicElements per <s-*> element with
 * ONLY that element's own semantic props (plus `id`/`key`/`ref`/`slot`) - it never merges
 * in standard DOM/React attributes (className, style, event handlers, etc.), even though
 * every <s-*> tag is a real custom element that supports them natively at runtime.
 *
 * The overrides below re-declare the specific <s-*> elements this app actually uses with
 * className/style, adding those DOM attributes back in while preserving the element's real
 * (used-in-this-app) semantic props. Re-declaring `IntrinsicElements['s-x']` replaces rather
 * than merges with the upstream declaration, so each entry below must restate every prop this
 * app relies on for that element - extend as new elements/props are needed.
 */
/**
 * Event handler props (onChange/onClick/etc.) are omitted from the DOM attributes base
 * because each element below re-declares them with the specific `currentTarget` shape
 * that element's real callback event carries - merging both would make the prop's type
 * an ambiguous union, and `e.currentTarget.value`/`.checked` would stop typechecking.
 */
type PolarisBaseProps = Omit<
  HTMLAttributes<HTMLElement>,
  'onChange' | 'onInput' | 'onClick' | 'onFocus' | 'onBlur'
> & {
  key?: Key;
  ref?: Ref<HTMLElement>;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      's-app-nav': PolarisBaseProps;

      's-card': PolarisBaseProps;

      's-form-field': PolarisBaseProps & {
        label?: string;
        error?: string;
        required?: boolean;
        details?: string;
      };

      's-text': PolarisBaseProps & {
        children?: ReactNode;
        type?: string;
        color?: string;
        tone?: string;
        fontVariantNumeric?: 'auto' | 'normal' | 'tabular-nums';
        dir?: 'ltr' | 'rtl' | 'auto' | '';
        interestFor?: string;
      };

      's-heading': PolarisBaseProps & {
        children?: ReactNode;
        accessibilityRole?: string;
        accessibilityVisibility?: string;
        lineClamp?: number;
      };

      's-button': PolarisBaseProps & {
        children?: ReactNode;
        accessibilityLabel?: string;
        disabled?: boolean;
        command?: '--show' | '--hide' | '--toggle' | '--auto';
        commandFor?: string;
        icon?: string;
        interestFor?: string;
        lang?: string;
        loading?: boolean;
        type?: string;
        tone?: 'auto' | 'neutral' | 'critical';
        variant?: 'auto' | 'primary' | 'secondary' | 'tertiary';
        target?: string;
        href?: string;
        download?: string;
        onClick?: (event: Event) => void;
        onFocus?: (event: Event) => void;
        onBlur?: (event: Event) => void;
      };

      's-stack': PolarisBaseProps & {
        children?: ReactNode;
        direction?: string;
        gap?: string;
        rowGap?: string;
        columnGap?: string;
        alignItems?: string;
        alignContent?: string;
        justifyContent?: string;
        paddingBlockEnd?: string;
        onClick?: (event: Event) => void;
      };

      's-box': PolarisBaseProps & {
        children?: ReactNode;
        padding?: string;
        paddingBlock?: string;
        paddingBlockStart?: string;
        paddingBlockEnd?: string;
        paddingInline?: string;
        border?: string;
        borderRadius?: string;
        background?: string;
        display?: string;
        accessibilityLabel?: string;
      };

      's-icon': PolarisBaseProps & {
        type?: string;
        tone?: string;
        onClick?: (event: Event) => void;
      };

      's-checkbox': PolarisBaseProps & {
        checked?: boolean;
        label?: string;
        name?: string;
        details?: string;
        onChange?: (
          event: Event & { currentTarget: { checked: boolean } }
        ) => void;
        onClick?: (event: Event) => void;
      };

      's-select': PolarisBaseProps & {
        children?: ReactNode;
        name?: string;
        label?: string;
        details?: string;
        value?: string;
        defaultValue?: string;
        required?: boolean;
        onChange?: (
          event: Event & { currentTarget: { value: string } }
        ) => void;
      };

      's-text-field': PolarisBaseProps & {
        name?: string;
        label?: string;
        details?: string;
        error?: string;
        value?: string;
        defaultValue?: string;
        placeholder?: string;
        required?: boolean;
        suffix?: string;
        prefix?: string;
        icon?: string;
        multiline?: boolean;
        autocomplete?: string;
        labelAccessibilityVisibility?: 'visible' | 'exclusive';
        onChange?: (
          event: Event & { currentTarget: { value: string } }
        ) => void;
        onInput?: (event: Event & { currentTarget: { value: string } }) => void;
      };

      's-number-field': PolarisBaseProps & {
        name?: string;
        label?: string;
        details?: string;
        error?: string;
        value?: string;
        defaultValue?: string;
        placeholder?: string;
        required?: boolean;
        suffix?: string;
        prefix?: string;
        min?: number;
        max?: number;
        onChange?: (
          event: Event & { currentTarget: { value: string } }
        ) => void;
        onInput?: (event: Event & { currentTarget: { value: string } }) => void;
      };

      's-email-field': PolarisBaseProps & {
        name?: string;
        label?: string;
        details?: string;
        error?: string;
        value?: string;
        defaultValue?: string;
        placeholder?: string;
        required?: boolean;
        onChange?: (
          event: Event & { currentTarget: { value: string } }
        ) => void;
        onInput?: (event: Event & { currentTarget: { value: string } }) => void;
      };

      's-url-field': PolarisBaseProps & {
        name?: string;
        label?: string;
        details?: string;
        error?: string;
        value?: string;
        defaultValue?: string;
        placeholder?: string;
        required?: boolean;
        onChange?: (
          event: Event & { currentTarget: { value: string } }
        ) => void;
        onInput?: (event: Event & { currentTarget: { value: string } }) => void;
      };

      's-table-header': PolarisBaseProps & {
        children?: ReactNode;
        listSlot?: string;
        format?: string;
      };

      's-text-area': PolarisBaseProps & {
        name?: string;
        label?: string;
        details?: string;
        error?: string;
        value?: string;
        defaultValue?: string;
        placeholder?: string;
        required?: boolean;
        rows?: number;
        onChange?: (
          event: Event & { currentTarget: { value: string } }
        ) => void;
        onInput?: (event: Event & { currentTarget: { value: string } }) => void;
      };
    }
  }
}

export {};
