// typescript 函数重载
function debounce(fn: Function, ms: number): Function

function debounce(fn: Function, ms: number = 200, immediate = false): Function {
  let timer: NodeJS.Timeout | null = null
  let hasBeenCalled = false

  return function (...args: any[]) {
    const context = this

    if (immediate && !hasBeenCalled) {
      fn.apply(context, args)
      hasBeenCalled = true
    }

    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(context, args)
      } else {
        hasBeenCalled = false
      }
      timer = null
    }, ms)
  }
}


export default debounce


