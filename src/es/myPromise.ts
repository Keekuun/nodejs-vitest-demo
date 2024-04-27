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
    return value && typeof value?.then === 'function';
}

class MyPromise<T> {
    private state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
    private value: T | undefined;
    private reason: any;
    private onFulfilledCallbacks: ((value: T) => void)[] = [];
    private onRejectedCallbacks: ((reason: any) => void)[] = [];

    constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
        this.value = undefined;
        this.reason = undefined;

        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (e: any) {
            this.reject(e);
        }
    }

    // todo 实现异步
    private resolve(value?: T | PromiseLike<T>) {
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

    private reject(reason?: any) {
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

    private fulfill(value: T) {
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

    public then<TResult1 = T, TResult2 = never>(
        onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): MyPromise<TResult1 | TResult2> {
        return new MyPromise<TResult1 | TResult2>((resolve, reject) => {
            if (this.state === 'fulfilled') {
                const result = onFulfilled ? onFulfilled(this.value as T) : this.value;
                resolve(result as TResult1);
            } else if (this.state === 'rejected') {
                const result = onRejected ? onRejected(this.reason) : this.reason;
                reject(result);
            } else {
                this.onFulfilledCallbacks.push((value) => {
                    const result = onFulfilled ? onFulfilled(value) : value;
                    resolve(result as TResult1);
                });
                this.onRejectedCallbacks.push((reason) => {
                    const result = onRejected ? onRejected(reason) : reason;
                    reject(result);
                });
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
            return MyPromise.resolve(onFinally ? onFinally() : null).then(() => { throw reason; });
        });
    }

    public static resolve(value: void | null) {
        return new MyPromise((resolve) => {
            resolve(value);
        })
    }
}

new Promise(() => {}).then(() => {}).catch().finally().then().catch().finally()
new MyPromise(() => {}).then(() => {}).catch().finally().then().catch().finally()

Promise.resolve().then().catch().finally()
MyPromise.resolve().then().catch().finally()

Promise.all([])
Promise.race([])
Promise.allSettled([])
Promise.reject([])
Promise.any([]);

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
// Promise.withResolvers()

