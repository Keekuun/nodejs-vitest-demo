const testPromise = new Promise<string>((resolve: (value: string) => void, reject: (reason: string) => void) => {
  try {
    resolve('new Promise success')
  } catch (e: any) {
    console.error(e)
    reject('new Promise failure');
  }
})

testPromise.then(() => {
  console.log('promise.then success')
}, () => {
  console.error('promise.then failure')
})

function isPromiseLike<T>(value: any): value is PromiseLike<T> {
  return value instanceof MyPromise || typeof value?.then === 'function';
}

function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

class MyPromise<T> {
  private state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
  private value: T | undefined;
  private reason: any;
  private onFulfilledCallbacks: ((value: T) => void)[] = [];
  private onRejectedCallbacks: ((reason: any) => void)[] = [];

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    if (!isFunction(executor)) {
      throw new TypeError('executor must be a function');
    }
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (e: any) {
      this.reject(e);
    }
  }

  private resolve(value?: T | PromiseLike<T>) {
    let run = () => {
      if (this.state !== 'pending') {
        return
      }

      if (isPromiseLike(value)) {
        value.then(this.fulfill.bind(this), this.reject.bind(this));
      } else {
        // value 收敛 为T类型
        this.fulfill(<T>value);
      }
    }

    setTimeout(run, 0);
  }

  private reject(reason?: any) {
    let run = () => {
      if (this.state !== 'pending') {
        return
      }
      this.state = 'rejected';
      this.reason = reason;

      // 执行所有的 rejected 回调
      this.onRejectedCallbacks.forEach(callback => {
        callback(reason);
      })
      // 清空 rejected 回调
      this.onRejectedCallbacks = [];
    }

    setTimeout(run, 0);
  }

  private fulfill(value: T) {
    let run = () => {
      if (this.state !== 'pending') {
        return
      }
      this.state = 'fulfilled';
      this.value = value;

      // 执行所有的 fulfilled 回调
      this.onFulfilledCallbacks.forEach(callback => {
        callback(value);
      })
      // 清空 fulfilled 回调
      this.onFulfilledCallbacks = [];
    }

    setTimeout(run, 0);
  }

  public then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): MyPromise<TResult1 | TResult2> {
    return new MyPromise<TResult1 | TResult2>((resolve, reject) => {
      let _fulfilled = () => {
        try {
          if (isFunction(onFulfilled)) {
            const result = onFulfilled(this.value as T);
            if (isPromiseLike(result)) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } else {
            // 如果不是函数，值穿透
            resolve(this.value as TResult1);
          }
        } catch (e: any) {
          reject(e);
        }
      }

      let _rejected = () => {
        try {
          if (isFunction(onRejected)) {
            const result = onRejected(this.value as T);
            if (isPromiseLike(result)) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } else {
            reject(this.reason as TResult2);
          }
        } catch (e: any) {
          reject(e);
        }
      }

      switch (this.state) {
        case 'fulfilled':
          _fulfilled();
          break;
        case 'rejected':
          _rejected();
          break;
        case 'pending':
          this.onFulfilledCallbacks.push(_fulfilled);
          this.onRejectedCallbacks.push(_rejected);
          break;
      }
    });
  }

  public catch<TResult = never>(onRejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): MyPromise<T | TResult> {
    return this.then(null, onRejected);
  }

  public finally(onFinally?: (() => void) | undefined | null): MyPromise<T> {
    return this.then((value) => {
      return MyPromise.resolve(onFinally ? onFinally() : null).then(() => value);
    }, (reason) => {
      return MyPromise.resolve(onFinally ? onFinally() : null).then(() => {
        throw reason;
      });
    });
  }

  public static resolve(value?: any): MyPromise<void> {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise((resolve) => {
      resolve(value);
    })
  }
}

new Promise(() => {
}).then(() => {
}).catch().finally().then().catch().finally()
new MyPromise(() => {
}).then(() => {
}).catch().finally().then().catch().finally()

Promise.resolve().then().catch().finally()
MyPromise.resolve().then().catch().finally()

Promise.all([])
Promise.race([])
Promise.allSettled([])
Promise.reject([])
Promise.any([]);

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
// Promise.withResolvers()

