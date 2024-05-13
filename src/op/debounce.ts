// typescript 函数重载
function debounce(fn: Function, ms: number): Function

function debounce(fn: Function, ms: number = 200, immediate = false): Function {
  let timer: NodeJS.Timeout | null = null
  let flag = immediate

  return function (...args: any[]) {
    if(flag) {
      fn.apply(this, args)
      flag = false
    }
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
      flag = immediate
    }, ms)
  }
}

export default debounce


