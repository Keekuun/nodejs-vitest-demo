// react use debounce function hook

import { useCallback, useRef } from 'react';

function useDebouncedFn<T extends (...args: any[]) => any>(fn: T, delay: number = 200): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFn = useCallback(
    (...args: Parameters<T>): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [fn, delay]
  );

  return debouncedFn as T;
}

export default useDebouncedFn;
