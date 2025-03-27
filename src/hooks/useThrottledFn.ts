// react use throttle function hook
import { useCallback, useRef } from 'react';

function useThrottledFn<T extends (...args: any[]) => any>(fn: T, delay: number = 200): T {
  const lastExecTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (lastExecTimeRef.current === null || now - lastExecTimeRef.current >= delay) {
        // 如果距离上次执行时间超过了延迟时间，立即执行函数
        fn(...args);
        lastExecTimeRef.current = now;
      } else {
        // 如果还在节流时间内，清除之前的定时器，重新设置一个定时器
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          fn(...args);
          lastExecTimeRef.current = Date.now();
          timeoutRef.current = null;
        }, delay - (now - lastExecTimeRef.current));
      }
    },
    [fn, delay]
  );

  return throttledFn as T;
}

export default useThrottledFn;
