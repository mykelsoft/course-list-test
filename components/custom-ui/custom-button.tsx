// File: ./components/custom-ui/custom-button.tsx
import Link from 'next/link';
import React from 'react';

import { Button } from '../ui/button';
import Spinner from '../ui/spinner';
import { BUTTON_VARIANTS } from './button-variants';
import { APPS } from '@/types/ENUMS';
import Themes from './styling/Themes';

type ButtonVariant = (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];

type CustomButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  url?: string;
  app?: APPS;
  title: string;
  isLoading?: boolean;
  width?: string;
  type?: 'button' | 'submit' | 'reset';
  buttonProps?: Record<string, any>;
  variant?: ButtonVariant;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  className?: string;
  buttonClass?: string;
  form?: string;
};

const defaultButtonProps = {};

const CustomButton = (
    { ref, onClick, url, app = APPS.PORTAL, title, isLoading, width = 'px-[16px] py-[10px]', type = 'button', buttonProps = defaultButtonProps, variant = BUTTON_VARIANTS.DEFAULT, disabled = false, className, leadingIcon, trailingIcon, buttonClass, form }: CustomButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }
  ) => {
    const content = (
      <span className="inline-flex justify-center items-center gap-2 w-full min-w-0 overflow-hidden">
        {isLoading === true ? (
          <div className="flex flex-row justify-center items-center gap-2 min-w-0 overflow-hidden">
            <Spinner
              size={16}
              color={
                variant === BUTTON_VARIANTS.DESTRUCTIVE
                  ? 'text-white'
                  : variant === BUTTON_VARIANTS.OUTLINE
                  ? 'text-gray-700'
                  : 'text-white'
              }
            />
            <span className="truncate">{title}</span>
          </div>
        ) : (
          <>
            {leadingIcon && <span className="flex-shrink-0">{leadingIcon}</span>}
            <span className="truncate">{title}</span>
            {trailingIcon && <span className="flex-shrink-0">{trailingIcon}</span>}
          </>
        )}
      </span>
    );

    // Combine buttonProps (arbitrary) with specific props for the Shadcn Button
    const finalButtonProps = {
      disabled: isLoading || disabled,
      type,
      // --- FIX: Pass the correct variant to the underlying Shadcn Button ---
      variant: variant === BUTTON_VARIANTS.PRIMARY ? 'default' : variant,
      // --- END FIX ---
      className: `h-[41px] ${width || 'min-w-[150px]'} ${(isLoading && 'opacity-50') || ''} 
      ${variant === BUTTON_VARIANTS.DEFAULT && Themes(app).button.default}
      ${variant === BUTTON_VARIANTS.OUTLINE && Themes(app).button.outline}
      ${variant === BUTTON_VARIANTS.GHOST && Themes(app).button.ghost}
      ${variant === BUTTON_VARIANTS.DESTRUCTIVE && Themes(app).button.destructive} 
      ${width || 'w-fit'} ${buttonClass || ''}`, // Use buttonClass for the <Button>
      onClick: isLoading ? undefined : onClick,
      form, // <-- PASS THE FORM PROP HERE
      ref, // Forward the ref to the Button
      ...buttonProps, // Spread other arbitrary props
    };

    if (url) {
      return (
        <Link
          href={url}
          className={`${isLoading ? 'pointer-events-none' : ''} ${className || ''}`} // Apply className to Link
        >
          <Button {...finalButtonProps}>{content}</Button>
        </Link>
      );
    }

    // If not a link, `className` should apply to the Button itself if `buttonClass` isn't specified
    // or if you want to allow styling the button directly.
    // Let's prioritize buttonClass for the Button and className for the Link/wrapper.
    if (!buttonClass && className) {
      finalButtonProps.className =
        `${finalButtonProps.className} ${className}`.trim();
    }

    return <Button {...finalButtonProps}>{content}</Button>;
  };

CustomButton.displayName = 'CustomButton';

export default CustomButton;
