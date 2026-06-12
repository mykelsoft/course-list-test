import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

const DEFAULT_VISIBLE_TIME = 5000;

function TimedVisibility({
  children,
  duration,
  onDismiss,
}: {
  children: ReactNode;
  duration: number;
  onDismiss?: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!visible) {
    return null;
  }

  return children;
}

function useTruncation(
  ref: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList
) {
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const checkTruncation = () => {
      setIsTruncated(element.scrollHeight > element.clientHeight);
    };

    const observer = new ResizeObserver(checkTruncation);
    observer.observe(element);
    checkTruncation();

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return isTruncated;
}

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
  const textRef = useRef<HTMLParagraphElement>(null);
  const isTruncated = useTruncation(textRef, [errorMessage]);

  if (!errorMessage) {
    return null;
  }

  return (
    <TimedVisibility
      key={errorMessage}
      duration={DEFAULT_VISIBLE_TIME}
      onDismiss={() => onErrorMessageChange?.(null)}
    >
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
    </TimedVisibility>
  );
};

export default CustomErrorCard;

export const CustomErrorCardNoBorder = ({
  title = 'Something went wrong',
  errorMessage,
  size,
  onErrorMessageChange,
  className,
}: {
  title?: string;
  errorMessage: string | ReactNode;
  size?: { height?: number; width?: number };
  onErrorMessageChange?: (newMessage: string | null) => void;
  className?: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const isTruncated = useTruncation(textRef, [errorMessage]);

  if (!errorMessage) {
    return null;
  }

  return (
    <TimedVisibility
      key={String(errorMessage)}
      duration={DEFAULT_VISIBLE_TIME}
      onDismiss={() => onErrorMessageChange?.(null)}
    >
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
    </TimedVisibility>
  );
};
