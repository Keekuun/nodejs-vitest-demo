"use strict";
const testPromise = new Promise((resolve, reject) => {
    try {
        resolve('new Promise success');
    }
    catch (e) {
        console.error(e);
        reject('new Promise failure');
    }
});
testPromise.then(() => {
    console.log('promise.then success');
}, () => {
    console.error('promise.then failure');
});
Promise.resolve().then((res) => {
});
function isPromiseLike(value) {
    return value instanceof MyPromise || typeof value?.then === 'function';
}
function isFunction(value) {
    return typeof value === 'function';
}
class MyPromise {
    state = 'pending';
    value;
    reason;
    onFulfilledCallbacks = [];
    onRejectedCallbacks = [];
    constructor(executor) {
        if (!isFunction(executor)) {
            throw new TypeError('executor must be a function');
        }
        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        }
        catch (e) {
            this.reject(e);
        }
    }
    resolve(value) {
        let run = () => {
            if (this.state !== 'pending') {
                return;
            }
            if (isPromiseLike(value)) {
                value.then(this.fulfill.bind(this), this.reject.bind(this));
            }
            else {
                // value 收敛 为T类型
                this.fulfill(value);
            }
        };
        setTimeout(run, 0);
    }
    reject(reason) {
        let run = () => {
            if (this.state !== 'pending') {
                return;
            }
            this.state = 'rejected';
            this.reason = reason;
            // 执行所有的 rejected 回调
            this.onRejectedCallbacks.forEach(callback => {
                callback(reason);
            });
            // 清空 rejected 回调
            this.onRejectedCallbacks = [];
        };
        setTimeout(run, 0);
    }
    fulfill(value) {
        let run = () => {
            if (this.state !== 'pending') {
                return;
            }
            this.state = 'fulfilled';
            this.value = value;
            // 执行所有的 fulfilled 回调
            this.onFulfilledCallbacks.forEach(callback => {
                callback(value);
            });
            // 清空 fulfilled 回调
            this.onFulfilledCallbacks = [];
        };
        setTimeout(run, 0);
    }
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            let _fulfilled = () => {
                try {
                    if (isFunction(onFulfilled)) {
                        const result = onFulfilled(this.value);
                        if (isPromiseLike(result)) {
                            result.then(resolve, reject);
                        }
                        else {
                            resolve(result);
                        }
                    }
                    else {
                        // 如果不是函数，值穿透
                        resolve(this.value);
                    }
                }
                catch (e) {
                    reject(e);
                }
            };
            let _rejected = () => {
                try {
                    if (isFunction(onRejected)) {
                        const result = onRejected(this.value);
                        if (isPromiseLike(result)) {
                            result.then(resolve, reject);
                        }
                        else {
                            resolve(result);
                        }
                    }
                    else {
                        reject(this.reason);
                    }
                }
                catch (e) {
                    reject(e);
                }
            };
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
    catch(onRejected) {
        return this.then(null, onRejected);
    }
    finally(onFinally) {
        return this.then(async (value) => {
            return MyPromise.resolve(onFinally ? onFinally() : null).then(() => value);
        }, async (reason) => {
            return MyPromise.resolve(onFinally ? onFinally() : null).then(() => {
                throw reason;
            });
        });
    }
    static resolve(value) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise((resolve) => {
            resolve(value);
        });
    }
    static reject(reason) {
        return new MyPromise((_resolve, reject) => {
            reject(reason);
        });
    }
    static all(promises) {
        return new MyPromise((resolve, reject) => {
            const result = [];
            let count = 0;
            for (let i = 0; i < promises.length; i++) {
                MyPromise.resolve(promises[i]).then((res) => {
                    result[i] = res;
                    count++;
                    if (count === promises.length) {
                        resolve(result);
                    }
                }, reject);
            }
        });
    }
    static race(promises) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                MyPromise.resolve(promises[i]).then(resolve, reject);
            }
        });
    }
    static any(promises) {
        return new MyPromise((resolve, reject) => {
            promises.forEach((promise) => {
                MyPromise.resolve(promise).then(resolve, reject);
            });
        });
    }
    static allSettled(promises) {
        return new MyPromise((resolve) => {
            const result = [];
            let count = 0;
            for (let i = 0; i < promises.length; i++) {
                MyPromise.resolve(promises[i]).then((res) => {
                    result[i] = { status: 'fulfilled', value: res };
                    count++;
                    if (count === promises.length) {
                        resolve(result);
                    }
                }, (err) => {
                    result[i] = { status: 'rejected', reason: err };
                    count++;
                    if (count === promises.length) {
                        resolve(result);
                    }
                });
            }
        });
    }
}
new Promise(() => {
}).then(() => {
}).catch().finally().then().catch().finally();
new MyPromise(() => {
}).then(() => {
}).catch().finally().then().catch().finally();
{
    let mp = new MyPromise(resolve => {
        resolve(1);
    });
    mp.catch();
    mp.finally();
    mp.then();
}
Promise.resolve(1).then(res => {
}).catch().finally();
MyPromise.resolve(1).then(res => {
}).catch().finally();
Promise.all([]);
MyPromise.all([]);
Promise.race([]);
MyPromise.race([]);
Promise.allSettled([]);
MyPromise.allSettled([]);
Promise.reject([]);
MyPromise.reject([]);
Promise.any([]);
MyPromise.any([]);
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
// Promise.withResolvers()
