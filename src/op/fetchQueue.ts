export function fetchQueue(urls: string[], limit: number, callback: Function) {
  const results: Response[] = [];
  for(let i=0; i<limit; i++) {
    _request(urls.shift()!);
  }
  function _request(url: string) {
    fetch(url).then(res => {
      results.push(res);
    }).catch(err => {
      results.push(err);
    }).finally(() => {
      if(urls.length) {
        _request(urls.shift()!);
      } else {
        callback(results);
      }
    })
  }
}

/**
 * 并发限制的队列请求函数
 *
 * @param urls - 需要请求的URL数组
 * @param limit - 最大并发请求数量
 * @param callback - 请求全部完成后调用的回调函数，接收请求结果数组
 */
export function fetchQueue2(
  urls: string[],
  limit: number,
  callback: (results: (Response | Error)[]) => void
) {
  // 存储所有请求的结果或错误
  const results: (Response | Error)[] = [];
  // 当前活动的请求数量
  let activeCount = 0;
  // 当前处理的URL索引
  let index = 0;

  /**
   * 发起单个请求的内部函数
   */
  function _request() {
    // 如果所有URL都已处理完毕，则不再发起请求
    if (index >= urls.length) {
      return;
    }
    // 获取当前要请求的URL
    const url = urls[index++];
    // 活动请求数量加一
    activeCount++;

    // 使用fetch发起请求
    fetch(url)
      .then(res => {
        // 请求成功，存储结果
        results.push(res);
      })
      .catch(err => {
        // 请求失败，存储错误
        results.push(err);
      })
      .finally(() => {
        // 无论成功或失败，活动请求数量减一
        activeCount--;
        // 如果还有未处理的URL或者仍有活动请求，则继续发起请求；否则，调用回调函数返回结果
        if (index < urls.length || activeCount > 0) {
          _request();
        } else {
          callback(results);
        }
      });
  }

  // 根据并发限制，初始化时即发起指定数量的请求
  for (let i = 0; i < Math.min(limit, urls.length); i++) {
    _request();
  }
}


/**
 * 并发限制的请求队列函数，支持中断
 *
 * @param urls 请求的 URL 数组
 * @param limit 最大并发数
 * @param callback 回调函数，接收请求结果数组
 * @returns 返回一个对象，包含中断所有请求的方法
 */
export function fetchQueueWithAbort(urls: string[], limit: number, callback: (results: (Response | Error)[]) => void) {
  // 存储所有请求的结果
  const results: (Response | Error)[] = [];
  // 当前活动的请求数量
  let activeCount = 0;
  // 当前处理的 URL 索引
  let index = 0;
  // 是否已中断请求
  let isAborted = false;

  // 每个 URL 对应一个控制器，用于中断请求
  const controllerMap = new Map<string, AbortController>();

  /**
   * 内部请求函数，用于发起请求并处理结果
   */
  function _request() {
    // 如果已中断或所有 URL 已处理完毕，则不再发起请求
    if (isAborted || index >= urls.length) return;

    // 当前要请求的 URL
    const url = urls[index++];
    // 创建一个新的中断控制器
    const controller = new AbortController();
    // 将控制器与 URL 关联
    controllerMap.set(url, controller);

    // 增加当前活动的请求数量
    activeCount++;

    // 发起请求，传入当前控制器的信号
    fetch(url, { signal: controller.signal })
      .then(res => {
        // 请求成功，将结果存入结果数组
        results.push(res);
      })
      .catch(err => {
        // 请求失败，如果未被中断，则将错误存入结果数组
        if (!controller.signal.aborted) {
          results.push(err);
        }
      })
      .finally(() => {
        // 无论请求成功或失败，减少活动的请求数量，并移除控制器
        activeCount--;
        controllerMap.delete(url);

        // 如果还有 URL 未处理或仍有活动的请求，则继续发起请求；否则，调用回调函数返回结果
        if (index < urls.length || activeCount > 0) {
          _request();
        } else {
          callback(results);
        }
      });
  }

  // 初始时，根据并发限制，发起指定数量的请求
  for (let i = 0; i < Math.min(limit, urls.length); i++) {
    _request();
  }

  /**
   * 中断所有请求
   */
  return {
    abort: () => {
      // 设置中断状态为 true
      isAborted = true;
      // 遍历所有控制器，中断所有请求
      for (const [_, controller] of controllerMap.entries()) {
        controller.abort();
      }
      // 清空控制器映射
      controllerMap.clear();
    },
  };
}


export interface FetchQueueOptions {
  timeout?: number;     // 单个请求超时时间（毫秒）
  retry?: number;       // 每个请求最大重试次数
}

/**
 * 并发请求队列管理函数，支持重试和超时
 * @param urls 请求URL数组
 * @param limit 最大并发请求数量
 * @param options 配置选项，包括超时时间和重试次数
 * @returns 返回一个对象，包含请求结果的Promise和中止请求的方法
 */
export function fetchQueueWithReTry(
  urls: string[],
  limit: number,
  options: FetchQueueOptions = {}
): {
  promise: Promise<(Response | Error)[]>;
  abort: () => void;
} {
  // 解构配置选项中的超时时间和重试次数，默认值分别为5000毫秒和0次
  const { timeout = 5000, retry = 0 } = options;

  // 存储所有请求的结果，包括成功的Response和失败的Error
  const results: (Response | Error)[] = [];
  // 当前活动的请求数量
  let activeCount = 0;
  // 当前处理的URL索引
  let index = 0;
  // 标记是否已中止请求
  let isAborted = false;

  // 存储每个请求的AbortController，以便单独控制每个请求
  const controllerMap = new Map<string, AbortController>();

  /**
   * 发起请求的内部函数
   * @param url 请求的URL
   * @param attempt 当前重试次数，默认为0
   */
  function _request(url: string, attempt = 0): void {
    if (isAborted || !url) return;

    const controller = new AbortController();
    controllerMap.set(url, controller);

    activeCount++;

    const fetchPromise = fetch(url, { signal: controller.signal });

    // 超时逻辑
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        if (!controller.signal.aborted) {
          controller.abort();
          reject(new Error(`Request timeout: ${url}`));
        }
      }, timeout);
    });

    // 使用Promise.race竞态处理fetch请求和超时请求
    Promise.race([fetchPromise, timeoutPromise])
      .then(res => {
        results.push(res);
      })
      .catch(err => {
        if (controller.signal.aborted) {
          results.push(new Error(`Request aborted: ${url}`));
          return;
        }

        if (attempt < retry) {
          console.log(`Retrying ${url} (attempt ${attempt + 1})`);
          _request(url, attempt + 1); // 重试
        } else {
          results.push(err);
        }
      })
      .finally(() => {
        activeCount--;
        controllerMap.delete(url);

        if (index < urls.length || activeCount > 0) {
          _request(urls[index++], 0);
        } else if (!isAborted) {
          callbackResolve(results);
        }
      });
  }

  // 定义Promise的resolve和reject回调函数
  let callbackResolve!: (value: (Response | Error)[] | PromiseLike<(Response | Error)[]>) => void;
  let callbackReject!: (reason?: any) => void;

  // 创建并返回一个Promise对象
  const promise = new Promise<(Response | Error)[]>((resolve, reject) => {
    callbackResolve = resolve;
    callbackReject = reject;
  });

  // 启动请求
  for (let i = 0; i < Math.min(limit, urls.length); i++) {
    _request(urls[index++], 0);
  }

  // 返回包含请求结果的Promise和中止请求的方法
  return {
    promise,
    abort: () => {
      isAborted = true;
      for (const controller of controllerMap.values()) {
        controller.abort();
      }
      controllerMap.clear();
      callbackReject(new Error('Fetch queue was aborted'));
    },
  };
}



// Example usage1
const urls = ['https://api.example.com/1', 'https://api.example.com/2', 'https://api.example.com/3'];
const limit = 2;

fetchQueue(urls, limit, (results: any) => {
  console.log(results);
});

// Example usage2
const queue = fetchQueueWithAbort(urls, limit, (results) => {
  console.log('Fetch completed:', results);
});

// 取消所有未完成的请求
setTimeout(() => {
  console.log('Aborting all requests...');
  queue.abort();
}, 1000);



// Example usage3
fetchQueueWithReTry(urls, 2, {
  timeout: 3000,
  retry: 2
})
    .promise.then(results => {
  console.log('All requests completed:', results);
})
    .catch(error => {
      console.error('Error occurred:', error);
    });

// 可选：中途取消
setTimeout(() => {
  console.log('Aborting all requests...');
  fetchQueueWithReTry(urls, 2).abort();
}, 5000);