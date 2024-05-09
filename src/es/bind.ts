// @ts-ignore
Function.prototype.myBind = function (context: any, ...args1: any[]) {
  const self = this
  return function (...args2: any[]) {
    return self.apply(context || window, [...args1, ...args2])
  }
}

// @ts-ignore
Function.prototype.myCall = function (context: any, ...args: any[]) {
  context = context || window
  const symbolFn = Symbol('symbolFn')
  context[symbolFn] = this
  const result = context[symbolFn](...args)
  delete context['fn']

  return result
}

// @ts-ignore
Function.prototype.myApply = function (context: any, ...args: any[]) {
  context = context || window

  const symbolFn = Symbol('symbolFn')
  context[symbolFn] = this

  const result = context[symbolFn](args)

  delete context[symbolFn]
  return result
}


function myNew(target: Function, ...args: any[]) {
  // 创建一个新对象，并将其原型指向构造函数的原型
  const obj = Object.create(target.prototype)

  // 调用构造函数，并将新对象作为 `this` 传入，传递参数
  const result = target.apply(obj, args)

  // 如果构造函数返回一个对象，则返回该对象，否则返回新创建的对象
  return typeof result === 'object' && result !== null ? result : obj;
}
