// 定时器版
function throttle1(fn: Function, ms = 200): Function {
  let timer: NodeJS.Timeout | null = null

  return function (...args: any[]) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        clearTimeout(timer!)
        timer = null
      }, ms)
    }
  }
}

// 时间戳版
/**
 * 创建一个节流函数，确保在指定的时间间隔内只执行一次 fn
 * @param fn 要节流的函数
 * @param ms 节流时间间隔（毫秒）
 */
function throttle2(fn: Function, ms = 200 /* ms */) {
  let prev = 0;

  return function (...args: any[]) {
    const now = Date.now();
    if (now - prev >= ms) {
      fn.apply(this, args);
      prev = now;
    }
  };
}


// leading: 延迟之前执行, trailing: 延迟之后执行
function throttle(fn: Function, ms = 200, options = { leading: true, trailing: true }) {
  let timer: NodeJS.Timeout | null = null;
  let prev = 0;

  const { leading = true, trailing = true } = options;

  return function (...args: any[]) {
    const now = Date.now();

    if (leading && now - prev >= ms) {
      fn.apply(this, args);
      prev = now;
    }

    if (!timer) {
      timer = setTimeout(() => {
        const current = Date.now();
        if (trailing && current - prev >= ms) {
          fn.apply(this, args);
          prev = current;
        }
        timer = null;
      }, ms);
    }
  };
}


// demo https://codepen.io/dcorb
