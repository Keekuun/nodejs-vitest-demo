// react use throttle value hook
import {useEffect, useRef, useState} from 'react';

function useThrottleedValue<T>(value: T, delay: number = 200): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastStampRef = useRef<number>(0);

  useEffect(() => {
    const currentStamp = Date.now();
    if (currentStamp - lastStampRef.current > delay) {
      setThrottledValue(value);
      lastStampRef.current = currentStamp;
    }
  }, [value, delay]);

  return throttledValue;
}
