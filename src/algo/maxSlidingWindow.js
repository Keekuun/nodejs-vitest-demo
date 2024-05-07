"use strict";
function maxSlidingWindow(nums, k) {
    const result = [];
    const maxHeap = new MaxHeap({ compareFn: (a, b) => a.value - b.value });
    // 前k个元素
    for (let i = 0; i < k; i++) {
        maxHeap.push({ value: nums[i], index: i });
    }
    // 前k个元素的最大值
    result.push(maxHeap.peek().value);
    // 开始滑动
    for (let i = k; i < nums.length; i++) {
        maxHeap.push({ value: nums[i], index: i });
        // 最大值不在滑动窗口中，则从堆顶移除
        while (maxHeap.peek().index <= i - k) {
            maxHeap.pop();
        }
        // 移除之后，获取当前堆顶的值
        result.push(maxHeap.peek().value);
    }
    return result;
}
class MaxHeap {
    maxHeap;
    compareFn;
    constructor(param) {
        this.maxHeap = param?.data ? [...param?.data] : [];
        this.compareFn = param?.compareFn;
        // 从后往前堆化非叶子节点
        for (let i = this.parent(this.size() - 1); i >= 0; i--) {
            this.siftDown(i);
        }
    }
    compare(a, b) {
        if (this.compareFn) {
            return this.compareFn(a, b);
        }
        else if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        }
        else {
            throw new Error('请传入 compareFn 或 number数组');
        }
    }
    // 获取节点索引为i的父节点索引
    parent(i) {
        return Math.floor((i - 1) / 2);
    }
    // 获取节点索引为i的左子节点索引
    left(i) {
        return i * 2 + 1;
    }
    // 获取节点索引为i的右子节点索引
    right(i) {
        return i * 2 + 2;
    }
    size() {
        return this.maxHeap.length;
    }
    isEmpty() {
        return this.size() === 0;
    }
    peek() {
        return this.maxHeap[0];
    }
    // 从节点i开始，从顶至底堆化
    siftDown(i) {
        while (true) {
            const left = this.left(i);
            const right = this.right(i);
            let max = i;
            if (left < this.size() && this.compare(this.maxHeap[left], this.maxHeap[max]) > 0) {
                max = left;
            }
            if (right < this.size() && this.compare(this.maxHeap[right], this.maxHeap[max]) > 0) {
                max = right;
            }
            if (max === i)
                break;
            this.swap(i, max);
            i = max;
        }
    }
    swap(i, j) {
        [this.maxHeap[i], this.maxHeap[j]] = [this.maxHeap[j], this.maxHeap[i]];
    }
    // 元素入堆
    push(val) {
        // 添加节点
        this.maxHeap.push(val);
        // 从底至顶堆化
        this.siftUp(this.size() - 1);
    }
    siftUp(i) {
        while (true) {
            // 获取节点 i 的父节点
            const p = this.parent(i);
            // 当“越过根节点”或“节点无须修复”时，结束堆化
            if (p < 0 || this.compare(this.maxHeap[i], this.maxHeap[p]) <= 0)
                break;
            // 交换两节点
            this.swap(i, p);
            // 循环向上堆化
            i = p;
        }
    }
    // 元素出堆
    pop() {
        // 判空处理
        if (this.isEmpty())
            throw new RangeError('Heap is empty.');
        // 交换根节点与最右叶节点（交换首元素与尾元素）
        this.swap(0, this.size() - 1);
        // 删除节点
        const val = this.maxHeap.pop();
        // 从顶至底堆化
        this.siftDown(0);
        // 返回堆顶元素
        return val;
    }
}
