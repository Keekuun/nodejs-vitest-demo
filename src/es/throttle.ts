// 节流函数

function throttle1(fn: Function, delay: number) {
  let timer: NodeJS.Timeout | null = null

  function throttledFn(...args: any[]) {
    if (timer !== null) {
      return
    }

    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, delay)
  }

  throttledFn.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }
  return throttledFn
}

function throttle2(fn: Function, delay: number, leading?: boolean, trailing?: boolean) {
  let timer: NodeJS.Timeout | null = null
  let prev = 0

  function throttledFn(...args: any[]) {
    const now = Date.now()
    if (leading && !timer && now - prev >= delay) {
      fn.apply(this, args)
      prev = now
    }

    if (!timer) {
      timer = setTimeout(() => {
        if (trailing && now - prev >= delay) {
          fn.apply(this, args)
        }
        timer = null
        prev = now
      }, delay)
    }
  }

  throttledFn.cancel = function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
      prev = 0
    }
  }
  return throttledFn
}

function throttle(func: Function, wait: number, options: { leading?: boolean; trailing?: boolean }) {
  let timeout: NodeJS.Timeout | null = null
  let previous = 0;
  if (!options) options = {}

  function throttled(...args: any[]) {
    const now = new Date().getTime();
    if (!previous && !options.leading) previous = now
    const remaining = wait - (now - previous);
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(this, args)
    } else if (!timeout && options.trailing) {
      timeout = setTimeout(() => {
        previous = !options.leading ? 0 : new Date().getTime()
        timeout = null
        func.apply(this, args)
      }, remaining)
    }
  }

  throttled.cancel = function () {
    if (timeout) {
      clearTimeout(timeout)
      previous = 0
      timeout = null
    }
  }
  return throttled
}
