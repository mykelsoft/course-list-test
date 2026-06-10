import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

const DEFAULT_VISIBLE_TIME = 5000;

const CustomErrorCard = ({
  title = 'Something went wrong',
  errorMessage,
  size,
  onErrorMessageChange,
}: {
  title?: string;
  errorMessage: string;
  size?: { height?: number; width?: number };
  onErrorMessageChange?: (newMessage: string | null) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setIsTruncated(element.scrollHeight > element.clientHeight);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [errorMessage]);

  useEffect(() => {
    if (!errorMessage) return;
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsVisible(true); // Reset visibility when error message changes
    const timer = setTimeout(() => {
      setIsVisible(false);
      onErrorMessageChange?.(null);
    }, DEFAULT_VISIBLE_TIME);

    return () => clearTimeout(timer);
  }, [errorMessage, onErrorMessageChange]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="flex flex-col justify-center h-auto w-full md:w-[60%] p-4 bg-red-100 border border-red-500 rounded-sm"
      style={{
        height: size?.height,
        width: size?.width,
      }}
    >
      <h1 className="text-base font-medium text-green-600 hidden">{title}</h1>
      <div className="relative">
        <p
          ref={textRef}
          className={`text-sm text-red-500 ${expanded ? '' : 'line-clamp-1 text-ellipsis'} overflow-hidden`}
        >
          {errorMessage}
        </p>
        {!expanded && isTruncated && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-xs text-red-600 underline ml-1 pl-4 absolute right-0 bottom-0 cursor-pointer bg-red-100"
          >
            Show more
          </button>
        )}
      </div>
      {expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-xs text-red-600 underline mt-1 self-end cursor-pointer"
        >
          Show less
        </button>
      )}
    </div>
  );
};

export default CustomErrorCard;

export const CustomErrorCardNoBorder = (
  { title = "Something went wrong", errorMessage, size, onErrorMessageChange, className }:
    { title?: string, errorMessage: string | ReactNode, size?: { height?: number, width?: number }, onErrorMessageChange?: (newMessage: string | null) => void, className?: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setIsTruncated(element.scrollHeight > element.clientHeight);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [errorMessage]);

  useEffect(() => {
    if (!errorMessage) return;
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsVisible(true); // Reset visibility when error message changes
    const timer = setTimeout(() => {
      setIsVisible(false);
      onErrorMessageChange?.(null);
    }, DEFAULT_VISIBLE_TIME);

    return () => clearTimeout(timer);
  }, [errorMessage, onErrorMessageChange]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`flex flex-col justify-center h-auto w-[60%] px-3 py-2 bg-red-100 border-1 border-[#e6e7eb] rounded-md ${className}`}
      style={{
        height: size?.height,
        width: size?.width,
      }}
    >
      <h1 className="text-base font-medium text-green-600 hidden">{title}</h1>
      <div className="relative">
        <div
          ref={textRef}
          className={`text-sm text-red-500 ${expanded ? '' : 'line-clamp-1 text-ellipsis'} overflow-hidden flex items-center gap-2`}
        >
          {errorMessage}
        </div>
        {!expanded && isTruncated && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-xs text-red-600 underline ml-1 pl-4 absolute right-0 bottom-0 cursor-pointer bg-red-100"
          >
            Show more
          </button>
        )}
      </div>
      {expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-xs text-red-600 underline mt-1 self-end cursor-pointer"
        >
          Show less
        </button>
      )}
    </div>
  );
};
