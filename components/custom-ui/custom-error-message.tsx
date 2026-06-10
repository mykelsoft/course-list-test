import React from 'react';

type CustomErrorMessageProps = {
  errorMessage: string | null;
  className?: string;
  // Optionally, you can also allow inline styles:
  style?: React.CSSProperties;
  detailed?: boolean;
};

const CustomErrorMessage: React.FC<CustomErrorMessageProps> = ({
  errorMessage,
  className,
  style,
  detailed = false,
}) => {
  if (!errorMessage) {
    return null;
  }

  return (
    <div
      className={`flex items-start ${className || ''}`}
      style={{
        ...style,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'pre-wrap',
      }}
    >
      <p
        className={`text-xs text-red-600 flex-1 break-words ${detailed ? 'whitespace-pre-wrap' : ''}`}
      >
        {errorMessage}
      </p>
    </div>
  );
};

export default CustomErrorMessage;
