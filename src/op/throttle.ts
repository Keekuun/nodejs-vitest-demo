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
function throttle2(fn: Function, ms = 200) {
  let prev = 0

  return function (...args: any[]) {
    const now = Date.now()
    if (now - prev >= ms) {
      fn.apply(this, args)
      prev = now
    }
  }
}

// 防抖版
function throttle(fn: Function, ms = 200, options = {leading: true, trailing: true}) {
  let timer: NodeJS.Timeout | null = null;
  let prev = 0;

  return function (...args: any[]) {
    const now = Date.now();

    if (options.leading && !timer && now - prev >= ms) {
      fn.apply(this, args);
      prev = now;
    }

    if (!timer) {
      timer = setTimeout(() => {
        if (options.trailing && now - prev >= ms) {
          fn.apply(this, args);
        }
        timer = null;
        prev = now;
      }, ms);
    }
  };
}

// demo https://codepen.io/dcorb
