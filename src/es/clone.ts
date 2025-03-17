// 浅克隆
function shallowClone(obj: any) {
  if (!isObject(obj)) {
    return obj
  }

  let newObj = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = isObject(obj[key]) ? shallowClone(obj[key]) : obj[key];
    }
  }

  return newObj;
}

// 判断是否是对象
function isObject(obj: any): boolean {
  // 判断是否是对象
  // Object.prototype.toString.call(obj) === '[object Object]';
  return typeof obj === 'object' && obj !== null;
}

function deepClone(obj: any, cache = new WeakMap()): any {
  if (!isObject(obj)) {
    return obj;
  }

  if (cache.has(obj)) {
    return cache.get(obj);
  }

  let newObj;

  // 处理 Date
  if (obj instanceof Date) {
    // 确保日期的精确复制
    newObj = new Date(obj.getTime());
    cache.set(obj, newObj);
    return newObj;
  }

  // 处理 RegExp
  if (obj instanceof RegExp) {
    // 确保正则表达式的精确复制
    newObj = new RegExp(obj.source, obj.flags);
    cache.set(obj, newObj);
    return newObj;
  }

  // 处理 Set
  if (obj instanceof Set) {
    newObj = new Set();
    cache.set(obj, newObj);
    obj.forEach(item => {
      newObj.add(deepClone(item, cache));
    });
    return newObj;
  }

  // 处理 Map
  if (obj instanceof Map) {
    newObj = new Map();
    cache.set(obj, newObj);
    obj.forEach((value, key) => {
      newObj.set(key, deepClone(value, cache));
    });
    return newObj;
  }

  // 处理 Error
  if (obj instanceof Error) {
    newObj = new Error(obj.message);
    cache.set(obj, newObj);
    return newObj;
  }

  // 处理 Promise
  if (obj instanceof Promise) {
    newObj = new Promise((resolve, reject) => {
      obj.then(resolve, reject);
    });
    cache.set(obj, newObj);
    return newObj;
  }

  // 处理 Symbol
  if (obj instanceof Symbol) {
    newObj = Symbol(obj.description);
    cache.set(obj, newObj);
    return newObj;
  }

  // 处理 Function
  if (typeof obj === 'function') {
    newObj = obj.bind(null);
    cache.set(obj, newObj);
    return newObj;
  }

  // 处理普通对象和数组
  newObj = Array.isArray(obj) ? [] : {};
  cache.set(obj, newObj);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepClone(obj[key], cache);
    }
  }

  return newObj;
}

function getType(obj: any): string {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}
