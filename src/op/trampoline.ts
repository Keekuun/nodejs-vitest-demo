/**
 * 创建一个弹跳函数，用于优化递归调用，避免调用栈溢出
 * 弹跳函数通过迭代而不是递归来调用函数，从而减少调用栈的消耗
 *
 * @param fn {Function} 需要转换为弹跳调用的函数
 * @returns {Function} 返回一个新函数，该函数使用弹跳方式执行
 */
function trampoline(fn: Function): Function {
    return function (...params) {
        let result: any;
        let count = 0;
        const MAX_ITERATIONS = 10000; // 防止无限循环

        // 初始函数调用
        try {
            result = fn.apply(this, params);
        } catch (error) {
            console.error('Initial function call failed:', error);
            throw error;
        }

        // 迭代调用，直到结果不是一个函数
        while (typeof result === 'function') {
            if (count++ > MAX_ITERATIONS) {
                throw new Error(`Trampoline exceeded maximum iteration of ${MAX_ITERATIONS}`);
            }
            try {
                result = result();
            } catch (error) {
                console.error('Error during trampoline execution:', error);
                throw error;
            }
        }

        // 返回最终结果
        return result;
    };
}


// 尾递归风格的阶乘函数（返回一个 thunk 延迟执行）
function factorial(n: number): Function {
    function inner(n: number, acc: number): Function | number {
        return n <= 1 ? acc : () => inner(n - 1, n * acc);
    }

    return trampoline(inner)(n, 1);
}

// 使用示例：计算 10000 的阶乘（模拟）
console.log(factorial(5)); // 输出: 120
console.log(factorial(10)); // 输出: 3628800

// 深度递归测试（普通递归会爆栈，这个不会）
try {
    console.log(factorial(10000)); // 浏览器或 Node.js 中可安全运行
} catch (e) {
    console.error('Error in deep recursion:', e);
}