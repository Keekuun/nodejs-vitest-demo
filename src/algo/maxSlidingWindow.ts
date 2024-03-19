function maxSlidingWindow(nums: number[], k: number): number[] {
    type MaxHeapItem = {value: number, index: number}
    const result = []
    const maxHeap = new MaxHeap<MaxHeapItem>({compareFn: (a: MaxHeapItem, b: MaxHeapItem) => a.value - b.value})

    // 前k个元素
    for (let i = 0; i < k; i++) {
        maxHeap.push({value: nums[i], index: i})
    }
    // 前k个元素的最大值
    result.push(maxHeap.peek().value)

    // 开始滑动
    for (let i = k; i < nums.length; i++) {
        maxHeap.push({value: nums[i], index: i})
        // 最大值不在滑动窗口中，则从堆顶移除
        while (maxHeap.peek().index <= i - k) {
            maxHeap.pop()
        }
        // 移除之后，获取当前堆顶的值
        result.push(maxHeap.peek().value)
    }
    return result
}

class MaxHeap<T> {
    private readonly maxHeap: T[]
    private readonly compareFn: ((a: T, b: T) => number) | undefined

    constructor(param: { data?: T[]; compareFn?: (a: T, b: T) => number }) {
        this.maxHeap = param?.data ? [...param?.data] : [];
        this.compareFn = param?.compareFn;

        // 从后往前堆化非叶子节点
        for (let i = this.parent(this.size() - 1); i >= 0; i--) {
            this.siftDown(i)
        }
    }

    private compare(a: T, b: T): number {
        if (this.compareFn) {
            return this.compareFn(a, b)
        } else if(typeof a === 'number' && typeof b === 'number') {
            return a - b
        } else {
            throw new Error('请传入 compareFn 或 number数组');
        }
    }

    // 获取节点索引为i的父节点索引
    private parent(i: number): number {
        return Math.floor((i - 1) / 2);
    }

    // 获取节点索引为i的左子节点索引
    private left(i: number): number {
        return i * 2 + 1;
    }

    // 获取节点索引为i的右子节点索引
    private right(i: number): number {
        return i * 2 + 2;
    }

    public size(): number {
        return this.maxHeap.length
    }

    public isEmpty(): boolean {
        return this.size() === 0;
    }

    public peek(): T {
        return this.maxHeap[0];
    }

    // 从节点i开始，从顶至底堆化
    private siftDown(i: number) {
        while (true) {
            const left = this.left(i)
            const right = this.right(i)

            let max = i

            if (left < this.size() && this.compare(this.maxHeap[left], this.maxHeap[max]) > 0) {
                max = left
            }

            if (right < this.size() && this.compare(this.maxHeap[right], this.maxHeap[max]) > 0) {
                max = right
            }
            if (max === i) break;
            this.swap(i, max)
            i = max
        }
    }

    private swap(i: number, j: number) {
        [this.maxHeap[i], this.maxHeap[j]] = [this.maxHeap[j], this.maxHeap[i]]
    }

    // 元素入堆
    public push(val: T) {
        // 添加节点
        this.maxHeap.push(val);
        // 从底至顶堆化
        this.siftUp(this.size() - 1);
    }

    private siftUp(i: number): void {
        while (true) {
            // 获取节点 i 的父节点
            const p = this.parent(i);
            // 当“越过根节点”或“节点无须修复”时，结束堆化
            if (p < 0 || this.compare(this.maxHeap[i], this.maxHeap[p]) <= 0) break;
            // 交换两节点
            this.swap(i, p);
            // 循环向上堆化
            i = p;
        }
    }

    // 元素出堆
    public pop(): T | undefined {
        // 判空处理
        if (this.isEmpty()) throw new RangeError('Heap is empty.');
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