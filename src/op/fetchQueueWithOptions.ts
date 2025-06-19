/**
 * 并发请求队列，支持不同URL和自定义请求参数
 */
interface RequestTask {
    url: string;
    options?: RequestInit; // fetch 请求配置项，如 method, headers, body 等
}

export function fetchQueueWithOptions(
    tasks: RequestTask[],
    limit: number
): {
    promise: Promise<(Response | Error)[]>;
    abort: () => void;
} {
    const results: (Response | Error)[] = [];
    let activeCount = 0;
    let index = 0;
    let isAborted = false;

    const controllerMap = new Map<number, AbortController>();

    // 主 Promise 的 resolve 和 reject
    let outerResolve!: (value: (Response | Error)[] | PromiseLike<(Response | Error)[]>) => void;
    let outerReject!: (reason?: any) => void;

    const promise = new Promise<(Response | Error)[]>((resolve, reject) => {
        outerResolve = resolve;
        outerReject = reject;
    });

    function _request(taskIndex: number): void {
        if (isAborted || taskIndex >= tasks.length) return;

        const task = tasks[taskIndex];
        const {url, options = {}} = task;

        const controller = new AbortController();
        controllerMap.set(taskIndex, controller);

        activeCount++;

        fetch(url, {
            ...options,
            signal: controller.signal,
        })
            .then(res => {
                results[taskIndex] = res;
            })
            .catch(err => {
                if (!controller.signal.aborted) {
                    results[taskIndex] = err;
                }
            })
            .finally(() => {
                activeCount--;
                controllerMap.delete(taskIndex);

                if (index < tasks.length) {
                    _request(index++);
                } else if (!isAborted && activeCount === 0) {
                    outerResolve(results);
                }
            });
    }

    // 启动初始并发请求
    for (let i = 0; i < Math.min(limit, tasks.length); i++) {
        _request(index++);
    }

    return {
        promise,
        abort: () => {
            isAborted = true;
            for (const controller of controllerMap.values()) {
                controller.abort();
            }
            controllerMap.clear();
            outerReject(new Error('Request queue was aborted'));
        },
    };
}

const tasks: RequestTask[] = [
    {
        url: 'https://api.example.com/login',
        options: {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: 'user1', password: 'pass1'}),
        },
    },
    {
        url: 'https://api.example.com/data',
        options: {
            method: 'GET',
        },
    },
    {
        url: 'https://api.example.com/submit',
        options: {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: 123, value: 'test'}),
        },
    },
];

fetchQueueWithOptions(tasks, 2).promise
    .then(results => {
        results.forEach((res, i) => {
            if (res instanceof Response && res.ok) {
                console.log(`Request ${i} succeeded:`, res);
            } else if (res instanceof Error) {
                console.error(`Request ${i} failed:`, res.message);
            } else {
                console.warn(`Request ${i} unknown result:`, res);
            }
        });
    })
    .catch(err => {
        console.error('Error occurred:', err);
    });
