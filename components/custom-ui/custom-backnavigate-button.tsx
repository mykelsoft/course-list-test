import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '../ui/button';
import { BUTTON_VARIANTS } from './button-variants';

type ButtonVariant = (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];

type CustomButtonProps = {
  url: string; // Optional URL for navigation
  onClick?: () => void; // Made optional
  isLoading?: boolean; // Loading state flag
  width?: string; // Optional width (Tailwind CSS class) for the content container
  type?: 'button' | 'submit' | 'reset'; // Optional button type (default: "button")
  buttonProps?: Record<string, any>;
  variant?: ButtonVariant;
};

const defaultButtonProps = {};

const CustomButton: React.FC<CustomButtonProps> = ({
  url,
  isLoading,
  type = 'button',
  buttonProps = defaultButtonProps,
  variant = BUTTON_VARIANTS.GHOST,
}) => {
  // Additional props to disable the button when loading
  const _buttonProps = {
    disabled: isLoading,
    type,
    variant: variant === BUTTON_VARIANTS.PRIMARY ? 'default' : variant,
    className: isLoading ? 'opacity-50' : '',
    ...buttonProps,
  };

  return (
    <Link href={url}>
      <Button size="icon" {..._buttonProps}>
        <ChevronLeft className="size-7" />
      </Button>
    </Link>
  );
};

export default CustomButton;
