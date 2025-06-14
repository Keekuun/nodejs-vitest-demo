/**
 * vue nextTick polyfill
 * Vue 的 nextTick 底层依赖微任务（microtask），优先使用性能最好的方式调度：
 * 优先使用：Promise.then
 * 次选：MutationObserver
 * 最后降级到：setTimeout(callback, 0)
 * */

const callbacks: Function[] = [];
let pending = false;

function flushCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}

let microTimerFunc: (cb?: Function) => void;
let macroTimerFunc: (cb?: Function) => void;

/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined') {
    const p = Promise.resolve();
    microTimerFunc = () => {
        p.then(flushCallbacks);
    };
} else if (typeof MutationObserver !== 'undefined') {
    let counter = 1;
    const observer = new MutationObserver(flushCallbacks);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
        characterData: true,
    });
    microTimerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
    };
} else {
    // Fallback to setTimeout
    microTimerFunc = macroTimerFunc = (cb?: Function) => {
        setTimeout(() => cb, 0);
    };
}

/**
 * 在下次事件循环时执行回调
 * @param {Function} cb 要执行的回调函数
 */
export function nextTick(cb?: Function): Promise<void> {
    return new Promise(resolve => {
        callbacks.push(() => {
            if (cb) {
                try {
                    cb();
                } catch (e) {
                    console.error('Error in nextTick callback:', e);
                }
            }
            resolve();
        });

        if (!pending) {
            pending = true;
            microTimerFunc(cb);
        }
    });
}
