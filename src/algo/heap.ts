// 完全二叉堆
// 大顶堆、小顶堆
// 优先队列、堆排序、获取最大的K个数、获取最小的K个数

// 大根堆实现
class MaxHeap<T> {

    constructor(private readonly data: T[], private readonly compareFn?: (a: T, b: T) => number) {
        if (data.length > 0) {
            // 堆化
            for (let i = this.parent(this.size - 1); i >= 0; i--) {
                this.siftDown(i);
            }
        }
    }

    private compare(a: T, b: T): number {
        if (this.compareFn) {
            return this.compareFn(a, b);
        }
        if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        }
        throw Error('params should be number data or need compareFn');
    }

    private parent(i: number): number {
        return Math.floor((i - 1) / 2);
    }

    private left(i: number): number {
        return i * 2 + 1;
    }

    private right(i: number): number {
        return i * 2 + 2;
    }

    private swap(i: number, j: number) {
        [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    }

    private siftUp(i: number) {
        while (i > 0) {
            const pi = this.parent(i);
            if (pi < 0 || this.compare(this.data[i], this.data[pi]) <= 0) {
                break;
            }
            this.swap(pi, i);
            i = pi;
        }
    }

    private siftDown(i: number) {
        while (true) {
            let ma = i;
            const li = this.left(i);
            const ri = this.right(i);

            if (li < this.size && this.compare(this.data[li], this.data[ma]) > 0) ma = li;
            if (ri < this.size && this.compare(this.data[ri], this.data[ma]) > 0) ma = ri;
            if (ma === i) break;

            this.swap(ma, i);
            i = ma;
        }
    }

    get size(): number {
        return this.data.length;
    }

    get peek(): T {
        if (this.size === 0) {
            throw new RangeError('Heap is empty');
        }
        return this.data[0];
    }

    public push(v: T) {
        this.data.push(v);
        this.siftUp(this.size - 1);
    }

    public pop(): T {
        if (this.size === 0) {
            throw new RangeError('Heap is empty');
        }
        this.swap(0, this.size - 1);
        const max = this.data.pop()!;
        this.siftDown(0);
        return max;
    }
    /**
     * 从堆中移除指定的值
     * @param value 要移除的值
     * @returns 如果成功移除返回 true，否则返回 false
     */
    public remove(value: T): boolean {
        // 利用 compare 来查找值
        const index = this.data.findIndex((v) => this.compare(v, value) === 0);
        if (index === -1) return false;

        this.swap(index, this.size - 1);
        this.data.pop();

        if (index === this.size) return true;

        this.siftDown(index);
        this.siftUp(index);
        return true;
    }

    public isEmpty(): boolean {
        return this.size === 0;
    }

    public toArray(): T[] {
        return [...this.data];
    }

    public clear(): void {
        this.data.length = 0;
    }

    public contains(value: T): boolean {
        return this.data.some((v) => this.compare(v, value) === 0);
    }

    public indexOf(value: T): number {
        return this.data.findIndex((v) => this.compare(v, value) === 0);
    }
    public toSortedArray(): T[] {
        const heapCopy = new MaxHeap<T>([...this.data], this.compareFn);
        const sorted: T[] = [];
        while (!heapCopy.isEmpty()) {
            sorted.push(heapCopy.pop());
        }
        return sorted.reverse();
    }
}

function heapSort(arr: number[]): number[] {
    const heap = new MaxHeap(arr);

    const sorted: number[] = [];
    while (!heap.isEmpty()) {
        sorted.push(heap.pop());
    }
    return sorted.reverse(); // 因为 pop 是从大到小，所以需要反转
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const heap = new MaxHeap(arr);
console.log(heap.toArray())
heap.pop()
console.log(heap.toArray())
console.log(heapSort(arr));
