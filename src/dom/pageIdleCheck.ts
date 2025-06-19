/**
 * 网页空闲时间检测（支持 visibility change）
 * @param callback 空闲超时后执行的回调函数
 * @param timeout 超时时间（秒）
 * @param immediate 是否立即执行一次
 * @param pauseOnHidden 页面隐藏时是否暂停倒计时
 * @returns 返回一个对象，包含一个 cancel 方法，用于取消监听
 */
export default function pageIdleCheck(
    callback: () => void,
    timeout = 15 /*s*/,
    immediate = false,
    pauseOnHidden = true
): { cancel: () => void } {
    // 参数校验
    if (typeof callback !== 'function') {
        throw new TypeError('callback 必须是一个函数');
    }
    if (typeof timeout !== 'number' || timeout <= 0) {
        throw new RangeError('timeout 必须是一个正数');
    }

    let timer: number | null = null;
    let lastActiveTime = Date.now();
    let isPageHidden = false;

    const resetTimer = () => {
        lastActiveTime = Date.now();
        if (timer !== null) {
            clearTimeout(timer);
        }
        timer = window.setTimeout(() => {
            callback();
        }, timeout * 1000);
    };

    const handler = () => {
        resetTimer();
    };

    const onVisibilityChange = () => {
        if (document.hidden) {
            isPageHidden = true;
            if (pauseOnHidden && timer) {
                clearTimeout(timer);
                timer = null;
            }
        } else {
            isPageHidden = false;
            if (pauseOnHidden) {
                const idleDuration = (Date.now() - lastActiveTime) / 1000;
                if (idleDuration >= timeout) {
                    callback();
                } else {
                    timer = window.setTimeout(() => {
                        callback();
                    }, (timeout - idleDuration) * 1000);
                }
            } else {
                resetTimer();
            }
        }
    };


    // 立即执行一次
    if (immediate) {
        callback();
        lastActiveTime = Date.now();
    }

    // 初始化监听（使用 passive 提高性能）
    const eventOptions = { passive: true };
    window.addEventListener('mousemove', handler, eventOptions);
    window.addEventListener('keydown', handler, eventOptions);
    window.addEventListener('scroll', handler, eventOptions);
    window.addEventListener('resize', handler, eventOptions);
    document.addEventListener('visibilitychange', onVisibilityChange);

    // 启动初始定时器
    if (!immediate && !isPageHidden) {
        timer = window.setTimeout(() => {
            callback();
        }, timeout * 1000);
    }

    // 返回取消方法
    return {
        cancel: () => {
            if (timer !== null) {
                clearTimeout(timer);
                timer = null;
            }
            window.removeEventListener('mousemove', handler);
            window.removeEventListener('keydown', handler);
            window.removeEventListener('scroll', handler);
            window.removeEventListener('resize', handler);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        },
    };
}

// 示例调用
const idleChecker = pageIdleCheck(() => {
    console.log('页面已空闲超过15秒');
}, 15, true);

// 在适当的时候取消监听（例如组件卸载）
idleChecker.cancel();
