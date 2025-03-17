function debounce(fn: Function, delay: number, immediate) {
  let timer: NodeJS.Timeout | null = null

  function debouncedFn(...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }

    if (immediate) {
      let canExecNow = !timer
      if (canExecNow) {
        fn.apply(this, args)
      } else {
        timer = setTimeout(() => {
          timer = null
        }, delay)
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, delay)
    }
  }

  debouncedFn.cancel = function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return debouncedFn
}
