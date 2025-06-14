export async function serialPromise(
  promiseArr: Promise<any>[],
  callback?: (result: any) => void
): Promise<any[]> {
  if (!Array.isArray(promiseArr)) {
    throw new TypeError('Expected an array of Promises');
  }

  const result: any[] = [];

  for (let i = 0; i < promiseArr.length; i++) {
    const p = promiseArr[i];
    if (!(p instanceof Promise)) {
      throw new TypeError(`Element at index ${i} is not a Promise`);
    }

    try {
      const res = await p;
      result.push(res);
      console.log('ok:', res);
    } catch (e) {
      result.push(e);
      console.log('error:', e);
    }
  }

  if (callback) {
    callback(result);
  }

  return result;
}

/**
 * 异步函数，用于串行执行一组 Promise 或返回 Promise 的函数，并在全部执行完毕后调用回调函数处理结果
 *
 * @param promiseArr 一个包含 Promise 对象或返回 Promise 的函数的数组这些 Promise 或函数将被串行执行
 * @param callback 一个回调函数，用于处理所有 Promise 执行完毕后的结果必须是一个函数
 * @returns 返回一个 Promise，该 Promise 在所有输入的 Promise 执行完毕后解析，解析值为结果数组
 *
 * 此函数的主要作用是组织多个异步操作以串行方式执行，并在所有操作完成后进行统一的结果处理
 * 它通过映射输入数组为一个新的 Promise 数组，每个 Promise 都会被处理以确保其成功或失败的结果
 * 能被统一收集和处理
 */
export async function serialPromise1(
  promiseArr: (Promise<any> | (() => Promise<any>))[],
  callback: (result: any) => void
): Promise<any> {
  // 参数校验，确保 callback 是一个函数
  if (typeof callback !== 'function') {
    throw new TypeError('callback 必须是一个函数');
  }

  // 映射 promiseArr 为一个新的 Promise 数组，处理每个 Promise 或返回 Promise 的函数
  const resolves = promiseArr.map(async item => {
    let p: Promise<any>;

    // 检查 item 是否为 Promise 实例或返回 Promise 的函数，并据此创建 Promise
    if (item instanceof Promise) {
      p = item;
    } else if (typeof item === 'function') {
      p = item();
    } else {
      // 如果 item 既不是 Promise 也不是函数，则返回一个包含错误信息的 Promise
      return Promise.resolve({data: new TypeError('无效的 promise 或函数'), type: 'error'});
    }

    // 处理 Promise 的成功和失败情况，统一格式化结果
    try {
      const data = await p;
      return ({data, type: 'success'});
    } catch (error) {
      return {data: error, type: 'error'};
    }
  });

  // 使用 Promise.all 等待所有 Promise 执行完毕，并调用 callback 处理结果
  return Promise.all(resolves).then(results => {
    callback(results);
    return results;
  });
}


