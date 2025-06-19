// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback

// 实现 react 18 的 requestIdleCallback
// 定义 IdleDeadline 接口（如未全局定义）
interface IdleDeadline {
    readonly timeRemaining: () => number;
    readonly didTimeout: boolean;
}

// 实现 react 18 的 requestIdleCallback
interface IdleDeadline {
  readonly timeRemaining: () => number;
  readonly didTimeout: boolean;
}

export function requestIdleCallback(
  callback: (deadline: IdleDeadline) => void,
  options?: { timeout: number }
): number {
  if (window.requestIdleCallback) {
    return window.requestIdleCallback(callback, options);
  } else {
    const startTime = performance.now();
    const timeout = options?.timeout ?? 0;

    const fakeDeadline: IdleDeadline = {
      didTimeout: false,
      timeRemaining: () => {
        // 模拟浏览器分配的时间片（通常是 5ms）
          return Math.max(0, 5 - (performance.now() - startTime));
      },
    };

    const timeoutId = window.setTimeout(() => {
      callback(fakeDeadline);
    }, timeout ? 0 : 1);

    return timeoutId as number;
  }
}

// 实现 cancelIdleCallback 的兼容版本
export function cancelIdleCallback(handle: number): void {
    if (window.cancelIdleCallback) {
        window.cancelIdleCallback(handle);
    } else {
        window.clearTimeout(handle);
    }
}

requestIdleCallback((deadline) => {
    console.log('剩余可用时间:', deadline.timeRemaining()); // 输出 5
    console.log('是否因超时执行:', deadline.didTimeout);    // 输出 false

    if (deadline.timeRemaining() > 0) {
        // 执行轻量级任务
        console.log('还有时间可以工作');
    }
});
